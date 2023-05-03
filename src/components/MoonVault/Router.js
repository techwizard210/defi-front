// libs
import { LWeb3 } from './Libs/LWeb3';

// contracts
import { ABI_IRouter } from './Contracts/ABI_IRouter';
import { ABI_IFactory } from './Contracts/ABI_IFactory';

// classes
import Token from './Token';

class Router {
  constructor(_data, vaultinator3000) {
    // init
    this.initialized = false;
    this.vaultinator3000 = vaultinator3000;

    // base values
    this.id = _data.id;
    this.address = _data.contract;
    this.linkSwap = _data.linkSwap;
    this.linkAddLiquidity = _data.linkAddLiquidity;
    this.linkRemoveLiquidity = _data.linkRemoveLiquidity;
    this.factoryAddress = '';
    this.factoryContract = null;

    // runtime data
    this.pairs = [];
  }

  debugErrorString(_text) {
    return `Router [${this.id}] failed at: ${_text}`;
  }

  getContract(_user) {
    const web3 = this.vaultinator3000.selectWeb3Connection(_user);
    const con = new web3.eth.Contract(ABI_IRouter, this.address);
    return con;
  }

  /// /////////////////////////////////

  static async batchInit(_routers, vaultinator3000) {
    const batchObjects = [];
    const batchCalls = [];

    // get valid vaults
    _routers.forEach((r) => {
      if (!r.initialized && r.address !== '') {
        batchObjects.push(r);
        batchCalls.push(r.makeRequest_init());
      }
    });
    if (batchObjects.length !== 0) {
      // make multicall
      const mc = vaultinator3000.makeMultiCall(false);
      const [ret] = await LWeb3.tryMultiCall(
        mc,
        batchCalls,
        '[Router] batch init',
        'Router: init'
      );

      // process calls
      for (let n = 0; n < batchObjects.length; n += 1) {
        const t = batchObjects[n];
        const r = ret[n];
        // eslint-disable-next-line no-await-in-loop
        await t.processRequest_init(r);
      }
    }

    return _routers.filter((r) => r.initialized);
  }

  makeRequest_init() {
    const con = this.getContract();
    return {
      factoryAddress: con.methods.factory(),
    };
  }

  async processRequest_init(_data) {
    this.factoryAddress = _data.factoryAddress;

    // process
    const { web3 } = LWeb3.findWeb3Connection('data');
    this.factoryContract = new web3.eth.Contract(
      ABI_IFactory,
      this.factoryAddress
    );

    // complete
    this.initialized = true;
  }

  async init() {
    if (this.initialized) {
      return;
    }

    // handle result
    const [ret] = await LWeb3.tryMultiCall(
      this.vaultinator3000.makeMultiCall(false),
      [this.makeRequest_init()],
      this.debugErrorString('init'),
      'Router: init'
    );
    this.processRequest_init(ret[0]);
  }

  /// /////////////////////////////////

  lookupPair(_token0, _token1) {
    const t0 =
      LWeb3.compareAddress(_token0.address, _token1.address) === -1
        ? _token0
        : _token1;
    const t1 =
      LWeb3.compareAddress(_token0.address, _token1.address) === -1
        ? _token1
        : _token0;

    // find
    const ret = this.pairs.find(
      (p) =>
        LWeb3.checkEqualAddress(p.token0.address, t0.address) &&
        LWeb3.checkEqualAddress(p.token1.address, t1.address)
    );
    if (ret) {
      return ret.pairToken;
    }

    return null;
  }

  makeRequest_findPair(_t0, _t1) {
    return {
      pair: this.factoryContract.methods.getPair(_t0.address, _t1.address),
    };
  }

  processRequest_findPair(_pair, _t0, _t1) {
    const t0 =
      LWeb3.compareAddress(_t0.address, _t1.address) === -1 ? _t0 : _t1;
    const t1 =
      LWeb3.compareAddress(_t0.address, _t1.address) === -1 ? _t1 : _t0;

    if (
      this.vaultinator3000.toBN(_pair).cmp(this.vaultinator3000.toBN(0)) === 0
    ) {
      console.error(
        this.debugErrorString(
          `findOrCreatePair: no pair found [${_t0.symbol}-${_t1.symbol}]`
        )
      );
      return null;
    }
    let pairToken = this.vaultinator3000.findToken(_pair);
    if (pairToken === null) {
      pairToken = new Token(
        {
          contract: _pair,
          router: this.id,
          initPair: true,
          oracleType: 'LP',
        },
        this.vaultinator3000
      );
      this.vaultinator3000.tokens.push(pairToken);
    }
    this.pairs.push({
      token0: t0,
      token1: t1,
      pairToken,
    });

    return pairToken;
  }

  static async batchFindPairs(_pairs, vaultinator3000) {
    // load pairs
    const batchObjects = [];
    const batchCalls = [];
    _pairs.forEach((p) => {
      batchObjects.push(p);
      batchCalls.push(p.router.makeRequest_findPair(p.token0, p.token1));
    });

    const foundPairs = [];
    if (batchObjects.length !== 0) {
      // make multicall
      const mc = vaultinator3000.makeMultiCall(false);
      const [ret] = await LWeb3.tryMultiCall(
        mc,
        batchCalls,
        '[Router] batch findPair',
        'Router: findPair'
      );

      // process calls
      for (let n = 0; n < batchObjects.length; n += 1) {
        const t = batchObjects[n];
        const r = ret[n];
        foundPairs.push(
          t.router.processRequest_findPair(r.pair, t.token0, t.token1)
        );
      }
    }

    return foundPairs;
  }

  async findPair(_token0, _token1) {
    await this.init();
    if (!this.initialized) {
      return null;
    }

    const ret = this.lookupPair(_token0, _token1);
    if (ret !== null) {
      return ret;
    }

    // get info
    const pair = await LWeb3.tryCall(
      this.makeRequest_findPair(_token0.address, _token1.address).pair,
      'findOrCreatePair'
    );
    const pairToken = this.processRequest_findPair(pair, _token0, _token1);
    if (pairToken === null) {
      return null;
    }

    try {
      await pairToken.init();
      // eslint-disable-next-line no-empty
    } catch (e) {}

    return pairToken;
  }
}

export default Router;
