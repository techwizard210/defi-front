/* eslint-disable no-empty */
// libs
import { LLib } from './Libs/LLib';
import { LWeb3 } from './Libs/LWeb3';

// classes
import Cache from './Cache';
import Token from './Token';

// contracts
import { ABI_MoonChef } from './Contracts/ABI_MoonChef';

class MoonChef {
  /// /////////////////////////////////

  constructor(vaultinator3000) {
    // init
    this.initialized = false;
    this.vaultinator3000 = vaultinator3000;

    // values
    this.chainID = this.vaultinator3000.moonConfig.moonChain;
    this.address = this.vaultinator3000.moonConfig.moonChef;
    this.versionString = '0.0';
    this.version = LLib.getVersion(this.versionString);
    this.percentFactor = 1000000;

    // data
    this.moonToken = null;
    this.peggedToken = null;
    this.moonTokenAddress = '';
    this.peggedTokenAddress = '';
    this.minBuyPrice = '0';
    this.buyPriceMultiplicator = 0;
    this.buyPriceFee = 0;
    this.feeAddress = '';
    this.mintableSupply = '0';
    this.totalMinted = '0';
    this.emissionPerDay = '0';
    this.totalSupply = '0';
    this.burnedSupply = '0';
    this.circulatingSupply = '0';
    this.availableSupply = '0';
    this.burnedSupply = '0';
    this.totalBalance = '0';
    this.tokenValue = '0';
    this.tokenPrice = '0';
    this.wrappedBalance = '0';
    this.wrappedBalanceUSD = '0';

    if (!this.isValidChain()) {
      this.moonToken = new Token(
        {
          symbol: 'MOON',
          icon: './assets/tokens/MOON.png',
        },
        vaultinator3000
      );
    }

    // cache
    this.cache_liquidityData = new Cache(
      async (_p) => this.db_getLiquidityData(_p, true),
      60
    );

    // db
    this.db = {
      syncBlock: 0,
      originBlock: 0,
    };
    this.last = {
      syncBlock: 0,
    };
  }

  /// /////////////////////////////////

  // eslint-disable-next-line class-methods-use-this
  debugErrorString(_text) {
    return `MoonChef failed at: ${_text}`;
  }

  getContract(_user) {
    const web3 = this.vaultinator3000.selectWeb3Connection(_user);
    const con = new web3.eth.Contract(ABI_MoonChef, this.address);
    return con;
  }

  isValidChain() {
    return this.vaultinator3000.currentChain?.id === this.chainID;
  }

  /// /////////////////////////////////

  async init() {
    if (this.initialized || !this.isValidChain()) {
      return;
    }

    // make multicall
    const mc = this.vaultinator3000.makeMultiCall(false);
    const con = this.getContract();
    const calls = [
      {
        percentFactor: con.methods.PERCENT_FACTOR(),
        versionString: con.methods.VERSION(),
        moonTokenAddress: con.methods.moonToken(),
        peggedTokenAddress: con.methods.peggedToken(),
        minBuyPrice: con.methods.minBuyPrice(),
        feeAddress: con.methods.feeAddress(),
        emissionPerDay: con.methods.emissionPerDay(),
        buyPriceFee: con.methods.buyPriceFee(),
        buyPriceMultiplicator: con.methods.buyPriceMultiplicator(),
      },
    ];

    // handle result
    const [ret] = await LWeb3.tryMultiCall(
      mc,
      calls,
      this.debugErrorString('init'),
      'MoonChef: init'
    );
    const res = ret[0];
    this.percentFactor = parseInt(res.percentFactor, 10);
    this.versionString = res.versionString;
    this.moonTokenAddress = res.moonTokenAddress;
    this.peggedTokenAddress = res.peggedTokenAddress;
    this.minBuyPrice = res.minBuyPrice;
    this.buyPriceMultiplicator =
      parseFloat(res.buyPriceMultiplicator) / this.percentFactor;
    this.buyPriceFee = parseFloat(res.buyPriceFee) / this.percentFactor;
    this.feeAddress = res.feeAddress;
    this.emissionPerDay = res.emissionPerDay;

    // process
    this.version = LLib.getVersion(this.versionString);
    this.moonToken = new Token(
      {
        symbol: 'MOON',
        contract: this.moonTokenAddress,
        icon: './assets/tokens/MOON.png',
      },
      this.vaultinator3000
    );
    this.peggedToken = this.vaultinator3000.findToken(this.peggedTokenAddress);
    this.vaultinator3000.addDepositToken(this.peggedToken);
    this.vaultinator3000.addDepositToken(this.moonToken);
    if (this.vaultinator3000.findToken(this.moonToken.address) === null) {
      this.vaultinator3000.tokens.push(this.moonToken);
    }

    // complete
    this.initialized = true;
  }

  async reloadData() {
    // lazy init
    this.init();
    if (!this.initialized || !this.isValidChain()) {
      return;
    }

    // make multicall
    const mc = this.vaultinator3000.makeMultiCall(false);
    const con = this.getContract();
    const calls = [
      {
        totalSupply: con.methods.totalSupply(),
        circulatingSupply: con.methods.circulatingSupply(),
        availableSupply: con.methods.availableSupply(),
        burnedSupply: con.methods.burnedSupply(),
        mintableSupply: con.methods.mintableSupply(),
        totalBalance: con.methods.totalBalance(),
        wrappedBalance: con.methods.wrappedBalance(),
        tokenValue: con.methods.tokenValue(),
        tokenPrice: con.methods.tokenPrice(),
        totalMinted: con.methods.totalMinted(),
      },
    ];

    // handle result
    const [ret] = await LWeb3.tryMultiCall(
      mc,
      calls,
      this.debugErrorString('reloadData'),
      'MoonChef: reloadData'
    );
    const res = ret[0];
    this.totalSupply = res.totalSupply;
    this.circulatingSupply = res.circulatingSupply;
    this.availableSupply = res.availableSupply;
    this.burnedSupply = res.burnedSupply;
    this.totalBalance = res.totalBalance;
    this.wrappedBalance = res.wrappedBalance;
    this.tokenValue = res.tokenValue;
    this.tokenPrice = res.tokenPrice;
    this.mintableSupply = res.mintableSupply;
    this.totalMinted = res.totalMinted;

    // process
    this.wrappedBalanceUSD =
      await this.vaultinator3000.wrappedCoin.getPriceUSDForAmount(
        this.wrappedBalance
      );

    // event
    document.dispatchEvent(new CustomEvent('moonChef_info'));
  }

  /// /////////////////////////////////

  async checkApprovedMoon() {
    return this.moonToken.checkApproved(this.address);
  }

  async checkApprovedPegged() {
    return this.peggedToken.checkApproved(this.address);
  }

  async buy(_amount) {
    const con = this.getContract(true);
    await this.vaultinator3000.trySend(
      con.methods.buy(_amount),
      this.vaultinator3000.account,
      this.debugErrorString('buy')
    );
  }

  async sell(_amount) {
    const con = this.getContract(true);
    await this.vaultinator3000.trySend(
      con.methods.sell(_amount),
      this.vaultinator3000.account,
      this.debugErrorString('sell')
    );
  }

  async swapForLiquidity(_token) {
    const con = this.getContract(true);
    await this.vaultinator3000.trySend(
      con.methods.swapForLiquidity(_token.address),
      this.vaultinator3000.account,
      this.debugErrorString('swapForLiquidity')
    );
  }

  /// /////////////////////////////////

  getPriceUSDForAmount(_amount) {
    const amount = this.vaultinator3000.toBN(_amount);
    const circulatingSupply = this.vaultinator3000.toBN(this.circulatingSupply);
    const totalBalance = this.vaultinator3000.toBN(this.totalBalance);
    let balanceUSDValue = this.vaultinator3000.toBN(0);
    if (circulatingSupply.cmp(this.vaultinator3000.toBN(0)) !== 0) {
      balanceUSDValue = totalBalance.mul(amount).div(circulatingSupply);
    }
    const balanceUSD = balanceUSDValue.toString(10);
    return balanceUSD;
  }

  getBalanceUSD() {
    return this.getPriceUSDForAmount(this.moonToken.userBalance);
  }
  /// /////////////////////////////////

  async scanEvent(_name, _fromBlock, _toBlock) {
    // defaulting
    if (_fromBlock === undefined) {
      // eslint-disable-next-line no-param-reassign
      _fromBlock = this.vaultinator3000.currentBlock - 5000;
    }
    if (_toBlock === undefined) {
      // eslint-disable-next-line no-param-reassign
      _toBlock = 'latest';
    }

    // get logs
    let result = null;
    const options = {
      fromBlock: _fromBlock,
      toBlock: _toBlock,
    };
    try {
      result = await this.getContract().getPastEvents(_name, options);
    } catch (e) {}

    return result;
  }

  async scanEvent_AddLiquidity(_fromBlock, _toBlock) {
    return this.scanEvent('AddLiquidity', _fromBlock, _toBlock);
  }

  async scanEvent_RemoveLiquidity(_fromBlock, _toBlock) {
    return this.scanEvent('RemoveLiquidity', _fromBlock, _toBlock);
  }

  /// /////////////////////////////////

  async db_getLiquidityData(_filter, _forceReload) {
    // eslint-disable-next-line no-param-reassign
    _filter = _filter || {};

    if (_forceReload) {
      let data;
      try {
        let apiURL = `${this.vaultinator3000.api_url}?module=token&action=getTokenLiquidity`;
        apiURL += `&days=${_filter.days || 30}`;
        data = await LLib.fetchJSON(apiURL);
        // eslint-disable-next-line no-empty
      } catch (e) {}

      return data;
    }

    return this.cache_liquidityData.getData(_filter);
  }

  async db_getSyncBlock() {
    try {
      const apiURL = `${this.vaultinator3000.api_url}?module=token&action=getTokenLiquiditySyncBlock`;
      const apiJson = await LLib.fetchJSON(apiURL);
      if (apiJson.block !== undefined) {
        this.db.syncBlock = parseInt(apiJson.block, 10);
        this.last.syncBlock = this.db.syncBlock;
      }
    } catch (e) {}
    return this.db.syncBlock;
  }

  async db_getOriginBlock() {
    if (this.db.originBlock === 0) {
      try {
        const apiURL = `${this.vaultinator3000.api_url}?module=token&action=getTokenLiquidityOriginBlock`;
        const apiJson = await LLib.fetchJSON(apiURL);
        if (apiJson.block !== undefined) {
          this.db.originBlock = parseInt(apiJson.block, 10);
        }
      } catch (e) {}
    }
    return this.db.originBlock;
  }

  // eslint-disable-next-line class-methods-use-this
  async db_setSyncBlock(_block) {
    try {
      let apiURL = `${this.vaultinator3000.api_url}?module=token&action=setTokenLiquiditySyncBlock`;
      apiURL += `&block=${_block}`;
      await LLib.fetchJSON(apiURL);
    } catch (e) {}
  }

  // eslint-disable-next-line class-methods-use-this
  async db_modifyLiquidity(_event, _isAddLiquidity) {
    // get values
    const c_block = _event.blockNumber;
    const c_transactionIndex = _event.transactionIndex;
    const c_logIndex = _event.logIndex;
    const c_timestamp = (
      await this.vaultinator3000
        .selectWeb3Connection(false)
        .eth.getBlock(c_block)
    ).timestamp;
    const c_datetime = new Date(c_timestamp * 1000);
    const c_from = _event.returnValues[0];
    const c_amount = _event.returnValues[1];
    const c_peggedBalance = _event.returnValues[2];
    const c_circulatingSupply = _event.returnValues[3];
    const peggedBalance = this.vaultinator3000.toBN(c_peggedBalance);
    const circulatingSupply = this.vaultinator3000.toBN(c_circulatingSupply);

    // get unit price
    let unitPriceValue = this.vaultinator3000.toBN(0);
    if (circulatingSupply.cmp(this.vaultinator3000.toBN(0)) !== 0) {
      unitPriceValue = peggedBalance
        .mul(this.vaultinator3000.moonChef.moonToken.one)
        .div(circulatingSupply);
    }
    const unitPrice = parseFloat(
      LWeb3.fullFormatTokens(
        unitPriceValue.toString(10),
        this.vaultinator3000.moonChef.peggedToken
      )
    );

    // write to db
    {
      let apiURL = `${this.vaultinator3000.api_url}?module=token&action=${
        _isAddLiquidity ? 'add' : 'remove'
      }TokenLiquidity`;
      apiURL += `&block=${c_block}`;
      apiURL += `&transactionIndex=${c_transactionIndex}`;
      apiURL += `&logIndex=${c_logIndex}`;
      apiURL += `&timestamp=${c_timestamp}`;
      apiURL += `&wallet=${c_from}`;
      apiURL += `&amount=${LWeb3.abiEncodeUint256(c_amount)}`;
      apiURL += `&peggedBalance=${LWeb3.abiEncodeUint256(c_peggedBalance)}`;
      apiURL += `&circulatingSupply=${LWeb3.abiEncodeUint256(
        c_circulatingSupply
      )}`;
      apiURL += `&unitPrice=${unitPrice.toFixed(8)}`;
      await LLib.fetch(apiURL);
    }

    return {
      timestamp: c_timestamp,
      datetime: c_datetime,
      block: c_block,
    };
  }

  async db_addLiquidity(_event) {
    return this.db_modifyLiquidity(_event, true);
  }

  async db_removeLiquidity(_event) {
    return this.db_modifyLiquidity(_event, false);
  }

  async syncToBlockchain(_step, _logEvent) {
    // get block sync
    const curBlock = this.vaultinator3000.currentBlock;
    const minBlock = parseInt(
      Math.max(
        await this.db_getSyncBlock(),
        await this.db_getOriginBlock(),
        this.last.syncBlock
      ),
      10
    );
    const maxBlock = parseInt(Math.min(minBlock + _step, curBlock), 10);
    if (minBlock >= maxBlock) {
      return;
    }

    // get add liquidity events
    const adds = await this.scanEvent_AddLiquidity(minBlock, maxBlock);
    if (adds !== null) {
      for (let n = 0; n < adds.length; n += 1) {
        const add = adds[n];
        // eslint-disable-next-line no-await-in-loop
        const cRet = await this.db_addLiquidity(add);
        if (!!_logEvent && cRet !== undefined) {
          _logEvent(
            `[Token] add @ [${
              cRet.block
            }] ${cRet.datetime.toLocaleDateString()} ${cRet.datetime.toLocaleTimeString()}`
          );
        }
      }
    }

    // get withdraw events
    const removes = await this.scanEvent_RemoveLiquidity(minBlock, maxBlock);
    if (removes !== null) {
      for (let n = 0; n < removes.length; n += 1) {
        const remove = removes[n];
        // eslint-disable-next-line no-await-in-loop
        const cRet = await this.db_removeLiquidity(remove);
        if (!!_logEvent && cRet !== undefined) {
          _logEvent(
            `[Token] remove @ [${
              cRet.block
            }] ${cRet.datetime.toLocaleDateString()} ${cRet.datetime.toLocaleTimeString()}`
          );
        }
      }
    }

    // set block sync
    this.last.syncBlock = maxBlock;
    this.db_setSyncBlock(maxBlock);
  }
}

export default MoonChef;
