/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
// libs
import { LWeb3 } from './Libs/LWeb3';

// classes
import Token from './Token';
import Router from './Router';

class Oracle {
  constructor(vaultinator3000) {
    this.debug = false;
    this.pairs = [];
    this.vaultinator3000 = vaultinator3000;
  }

  // eslint-disable-next-line class-methods-use-this
  debugErrorString(_text) {
    return `Oracle failed at: ${_text}`;
  }

  /// /////////////////////////////////

  static async getPricePairsToLoad(_tokens, vaultinator3000) {
    // init routers
    await Router.batchInit(vaultinator3000.routers, vaultinator3000);

    const tokenPairs = [];
    for (let n = 0; n < _tokens.length; n += 1) {
      const t = _tokens[n];

      // get router
      const router = vaultinator3000.findRouter(t.router);
      if (router === null || !router.initialized) {
        continue;
      }

      // get partner
      let pairPartner = null;
      if (t.oracleType === 'LPCoin') {
        pairPartner = vaultinator3000.wrappedCoin;
      } else if (t.oracleType === 'LPStable') {
        pairPartner = vaultinator3000.stableToken;
      } else {
        continue;
      }

      // check pair
      const routerPair = router.lookupPair(t, pairPartner);
      if (routerPair !== null) {
        continue;
      }

      // add to list
      tokenPairs.push({
        router,
        token0: t,
        token1: pairPartner,
      });
    }

    return tokenPairs;
  }

  static async batchLoadPricePairs(_tokens, vaultinator3000) {
    // get pairs to load
    const pairsToLoad = await Oracle.getPricePairsToLoad(
      _tokens,
      vaultinator3000
    );

    // load pairs
    const foundPairs = await Router.batchFindPairs(
      pairsToLoad,
      vaultinator3000
    );

    // init pairs
    await Token.batchInit(foundPairs, vaultinator3000);
  }

  /// /////////////////////////////////

  async reloadPriceData(_token) {
    if (
      _token.lastPriceUpdate !== null &&
      (new Date().getTime() - _token.lastPriceUpdate) / 1000 < 60
    ) {
      return null;
    }

    switch (_token.oracleType) {
      case 'Stable':
        // get unit of stable
        return this.reloadPriceData_Stable(_token);

      case 'LP':
        // token is LP token, so get price by value of child tokens and amount (no param)
        return this.reloadPriceData_LP(_token);

      case 'Alias':
        // user price of parameter token (token to get price from)
        return this.reloadPriceData_Alias(_token);

      case 'LPStable':
        // search token-stable to make price (optional parameter: LP)
        return this.reloadPriceData_LPStable(_token);

      case 'LPCoin':
        // search token-coin to make price (optional parameter LP)
        return this.reloadPriceData_LPCoin(_token);

      case 'LPMirror':
        // use parameter LP and other token value to get current token value (LP to use)
        return null;

      default:
        console.error(
          this.debugErrorString(`getPrice [${_token.getFullName()}]`)
        );
        return 0;
    }
  }

  async reloadPriceData_Stable(_token) {
    // set value
    _token.unitPriceUSD = this.vaultinator3000.stableToken.one.toString(10);
    _token.liquidityValue = this.vaultinator3000.stableToken.one.toString(10);
    _token.liquidityAmount = _token.one.toString(10);
    _token.lastPriceUpdate = new Date();
    _token.initializedPrice = true;
    _token.priceUpdated();
    this.logUnitPrice(_token);

    return _token.unitPriceUSD;
  }

  async reloadPriceData_LP(_token) {
    // check
    const token0 = this.vaultinator3000.findToken(_token.token0);
    const token1 = this.vaultinator3000.findToken(_token.token1);
    if (!token0.initializedPrice || !token1.initializedPrice) {
      return '0';
    }

    // token 0
    const token0Price = this.vaultinator3000.toBN(token0.unitPriceUSD);
    const token0Res = this.vaultinator3000.toBN(_token.token0Reserve);
    const token0USD = token0Price.mul(token0Res).div(token0.one);

    // token 1
    const token1Price = this.vaultinator3000.toBN(token1.unitPriceUSD);
    const token1Res = this.vaultinator3000.toBN(_token.token1Reserve);
    const token1USD = token1Price.mul(token1Res).div(token1.one);

    // total amount & unit price
    const totalPrice = token0USD.add(token1USD);
    const totalSupply = this.vaultinator3000.toBN(_token.totalSupply);
    const unitPrice = totalPrice.mul(_token.one).div(totalSupply);
    if (unitPrice.cmp(this.vaultinator3000.toBN(0)) === 0) {
      return '0';
    }

    // set value
    _token.unitPriceUSD = unitPrice.toString(10);
    _token.liquidityValue = totalPrice.toString(10);
    _token.liquidityAmount = totalSupply.toString(10);
    _token.lastPriceUpdate = new Date();
    _token.initializedPrice = true;
    _token.priceUpdated();
    this.logUnitPrice(_token);

    return _token.unitPriceUSD;
  }

  async reloadPriceData_Alias(_token) {
    // find alias
    const tokenAlias = this.vaultinator3000.findToken(_token.oracleParameter);
    if (tokenAlias === null || !tokenAlias.initialized) {
      console.error(
        this.debugErrorString(`getPrice_Alias [${_token.getFullName()}]`)
      );
      return '0';
    }

    const unitPriceUSD = this.vaultinator3000.toBN(tokenAlias.unitPriceUSD);
    if (unitPriceUSD.cmp(this.vaultinator3000.toBN(0)) === 0) {
      return '0';
    }

    // set value
    _token.unitPriceUSD = tokenAlias.unitPriceUSD;
    _token.liquidityValue = tokenAlias.liquidityValue;
    _token.liquidityAmount = tokenAlias.liquidityAmount;
    _token.lastPriceUpdate = new Date();
    _token.initializedPrice = true;
    _token.priceUpdated();
    this.logUnitPrice(_token);

    return _token.unitPriceUSD;
  }

  async reloadPriceData_LPStable(_token) {
    const stable = this.vaultinator3000.stableToken;
    const pair = await this.findPair(_token, stable);
    if (pair === null || !pair.initialized) {
      console.error(
        this.debugErrorString(`getPrice_LPStable [${_token.getFullName()}]`)
      );
      return '0';
    }

    // get exchange rate
    const res = this.getTokenLPReserves(pair, _token);
    const { tokenReserve } = res;
    if (tokenReserve.cmp(this.vaultinator3000.toBN(0)) === 0) {
      return '0';
    }
    const stableReserve = res.partnerReserve;
    const unitPrice = stableReserve.mul(_token.one).div(tokenReserve);
    if (unitPrice.cmp(this.vaultinator3000.toBN(0)) === 0) {
      return '0';
    }

    // set value
    _token.unitPriceUSD = unitPrice.toString(10);
    _token.liquidityValue = stableReserve.toString(10);
    _token.liquidityAmount = tokenReserve.toString(10);
    _token.lastPriceUpdate = new Date();
    _token.initializedPrice = true;
    _token.priceUpdated();
    this.logUnitPrice(_token);

    return _token.unitPriceUSD;
  }

  async reloadPriceData_LPCoin(_token) {
    const wrapped = this.vaultinator3000.wrappedCoin;
    const pair = await this.findPair(_token, wrapped);
    if (pair === null || !pair.initialized) {
      console.error(
        this.debugErrorString(`getPrice_LPCoin [${_token.getFullName()}]`)
      );
      return '0';
    }

    // get exchange rate
    const res = this.getTokenLPReserves(pair, _token);
    const { tokenReserve } = res;
    if (tokenReserve.cmp(this.vaultinator3000.toBN(0)) === 0) {
      return '0';
    }
    const wrappedReserve = res.partnerReserve;
    const stableReserve = this.vaultinator3000.toBN(
      wrapped.getPriceUSDForAmount(wrappedReserve)
    );
    const unitPrice = stableReserve.mul(_token.one).div(tokenReserve);
    if (unitPrice.cmp(this.vaultinator3000.toBN(0)) === 0) {
      return '0';
    }

    // set value
    _token.unitPriceUSD = unitPrice.toString(10);
    _token.liquidityValue = stableReserve.toString(10);
    _token.liquidityAmount = tokenReserve.toString(10);
    _token.lastPriceUpdate = new Date();
    _token.initializedPrice = true;
    _token.priceUpdated();
    this.logUnitPrice(_token);

    return _token.unitPriceUSD;
  }

  // eslint-disable-next-line class-methods-use-this
  getTokenLPReserves(_pair, _token) {
    // token reserves
    const token0Res = this.vaultinator3000.toBN(_pair.token0Reserve);
    const token1Res = this.vaultinator3000.toBN(_pair.token1Reserve);

    // get price
    let tokenReserve;
    let partnerReserve;
    if (LWeb3.checkEqualAddress(_token.address, _pair.token0)) {
      tokenReserve = token0Res;
      partnerReserve = token1Res;
    } else {
      tokenReserve = token1Res;
      partnerReserve = token0Res;
    }

    return {
      tokenReserve,
      partnerReserve,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  async findPair(_token, _tokenPartner) {
    const router = this.vaultinator3000.findRouter(_token.router);
    if (router === null) {
      return null;
    }

    return router.lookupPair(_token, _tokenPartner);
  }

  logUnitPrice(_token) {
    if (!this.debug) {
      return;
    }
    console.log(
      `Oracle Unit Price [${_token.getFullName()} @ ${
        _token.oracleType
      }] = ${LWeb3.smartFormatFiat(
        _token.unitPriceUSD,
        this.vaultinator3000.stableToken
      )}`
    );
  }
}

export default Oracle;
