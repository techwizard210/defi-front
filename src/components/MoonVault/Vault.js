// libs
import { LLib } from './Libs/LLib';
import { LWeb3 } from './Libs/LWeb3';

// classes
import Cache from './Cache';
import VaultStrategy from './VaultStrategy';

// contracts
import { ABI_Vault } from './Contracts/ABI_Vault';

class Vault {
  /// /////////////////////////////////

  constructor(_data, _platform, vaultinator3000) {
    // init
    this.initialized = false;
    this.initializedInfo = false;
    this.initializedUser = false;
    this.initializedDB = false;

    this.vaultinator3000 = vaultinator3000;
    this.api_url = this.vaultinator3000.api_url;
    this.id = _data.id;
    this.address = _data.contract;
    this.name = _data.name;
    this.platform = _platform;
    this.originBlock = _data.originBlock || 0;
    this.icon = _data.icon || '';
    this.depositTokenAddress = _data.depositToken;
    this.rewardTokenAddress = _data.rewardToken;
    this.strategyAddress = '';
    this.strategy = null;
    this.additionalDepositTax = (_data.additionalDepositTax || 0) / 100;
    this.additionalWithdrawTax = (_data.additionalWithdrawTax || 0) / 100;

    // values
    this.versionString = '0.0';
    this.version = LLib.getVersion(this.versionString);
    this.router = '';

    // fees
    this.depositFee = 0;
    this.withdrawFee = 0;
    this.totalDepositFeeTaxFactor = 1;
    this.totalWithdrawFeeTaxFactor = 1;
    this.calculateFees();

    // get total values
    this.totalDeposit = '0';
    this.totalPending = '0';

    // get user value
    this.userDeposit = '0';
    this.userPending = '0';
    this.userProfitLoss = 0;

    // apr
    this.apr = 0;
    this.dailyAPR = 0;
    this.dailyLPFeeAPR = 0;
    this.lpFeeAPR = 0;
    this.compoundedDailyAPR = 0;
    this.compounds24h = 1;
    this.compoundedAPY = 0;
    this.combinedAPY = 0;
    this.combinedDailyAPR = 0;

    // meta data
    this.lastCompound = null;
    this.isFarmable = false;
    this.allocPoints = 1;
    this.startBlock = 0;
    this.endBlock = 0;
    this.endTime = null;
    this.harvestLockUntil = null;
    this.isApproved = false;
    this.proposedStrategy = '0';
    this.proposedTime = 0;

    // usd
    this.totalDepositUSD = '0';
    this.totalPendingUSD = '0';
    this.userDepositUSD = '0';
    this.userPendingUSD = '0';
    this.compoundRewardUSD = '0';

    // stats
    this.roiDailyAPR = 0;
    this.roiWeeklyAPR = 0;
    this.roiMonthlyAPR = 0;
    this.roiYearlyAPR = 0;
    this.roiDailyAPY = 0;
    this.roiWeeklyAPY = 0;
    this.roiMonthlyAPY = 0;
    this.roiYearlyAPY = 0;

    // cache
    this.cache_vaultCompoundHistory = new Cache(
      async (_p) => this.db_getHistoricCompounds(_p, true),
      60
    );

    // db
    this.dailyAPR = 0;
    this.db = {
      syncBlock: 0,
      processBlock: 0,
      lastCompound: 0,
      lastCompoundUTC: new Date(0),
    };
    this.last = {
      syncBlock: 0,
      processBlock: 0,
    };
    this.lastUserTransaction = null;

    // extended data
    this.depositToken = this.vaultinator3000.findToken(
      this.depositTokenAddress
    );
    this.rewardToken = this.vaultinator3000.findToken(this.rewardTokenAddress);
    this.vaultinator3000.addDepositToken(this.depositToken);
  }

  /// /////////////////////////////////

  debugErrorString(_text) {
    return `Vault [${this.id}] failed at: ${_text}`;
  }

  getContract(_user) {
    const web3 = this.vaultinator3000.selectWeb3Connection(_user);
    const con = new web3.eth.Contract(ABI_Vault, this.address);
    return con;
  }

  async getStrategy() {
    if (this.strategy === null) {
      await this.reloadVaultInfo();
    }

    return this.strategy;
  }

  /// /////////////////////////////////

  static async batchInit(_vaults, vaultinator3000) {
    const batchObjects = [];
    const batchCalls = [];

    // get valid vaults
    _vaults.forEach((v) => {
      if (!v.initialized && v.address !== '') {
        batchObjects.push(v);
        batchCalls.push(v.makeRequest_init());
      }
    });
    if (batchObjects.length !== 0) {
      // make multicall
      const mc = vaultinator3000.makeMultiCall(false);
      const [ret] = await LWeb3.tryMultiCall(
        mc,
        batchCalls,
        '[Vault] batch init',
        'Vault: init'
      );

      // process calls
      for (let n = 0; n < batchObjects.length; n += 1) {
        const t = batchObjects[n];
        const r = ret[n];
        // eslint-disable-next-line no-await-in-loop
        await t.processRequest_init(r);
      }
    }

    return _vaults.filter((v) => v.initialized);
  }

  makeRequest_init() {
    const con = this.getContract();
    return {
      versionString: con.methods.VERSION(),
      depositToken: con.methods.depositToken(),
      rewardToken: con.methods.rewardToken(),
      depositFee: con.methods.poolDepositFee(),
      withdrawFee: con.methods.poolWithdrawFee(),
      allocPoints: con.methods.poolAllocPoints(),
      startBlock: con.methods.poolStartBlock(),
      endBlock: con.methods.poolEndBlock(),
      endTime: con.methods.poolEndTime(),
      isFarmable: con.methods.isPoolFarmable(),
      lastCompound: con.methods.lastCompound(),
      harvestLockUntil: con.methods.poolHarvestLockUntil(),
      strategyAddress: con.methods.strategy(),
    };
  }

  async processRequest_init(_data) {
    this.versionString = _data.versionString;
    this.depositFee =
      parseFloat(_data.depositFee) /
      this.vaultinator3000.vaultChef.percentFactor;
    this.withdrawFee =
      parseFloat(_data.withdrawFee) /
      this.vaultinator3000.vaultChef.percentFactor;
    this.allocPoints = parseInt(_data.allocPoints, 10);
    this.startBlock = parseInt(_data.startBlock, 10);
    this.endBlock = parseInt(_data.endBlock, 10);
    this.endTime =
      parseInt(_data.endTime, 10) === 0
        ? null
        : new Date(parseInt(_data.endTime, 10) * 1000);
    this.isFarmable = _data.isFarmable;
    this.lastCompound =
      parseInt(_data.lastCompound, 10) === 0
        ? null
        : new Date(parseInt(_data.lastCompound, 10) * 1000);
    this.harvestLockUntil =
      parseInt(_data.harvestLockUntil, 10) === 0
        ? null
        : new Date(parseInt(_data.harvestLockUntil, 10) * 1000);
    this.strategyAddress = _data.strategyAddress;

    // process
    this.version = LLib.getVersion(this.versionString);
    this.strategy = new VaultStrategy(this.strategyAddress);
    this.calculateFees();

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
      'Vault: init'
    );
    this.processRequest_init(ret[0]);
  }

  /// /////////////////////////////////

  static async batchLoadVaultInfo(_vaults, vaultinator3000) {
    const batchObjects = [];
    const batchCalls = [];

    // get valid vaults
    const initVaults = await Vault.batchInit(_vaults, vaultinator3000);
    initVaults.forEach((v) => {
      batchObjects.push(v);
      batchCalls.push(v.makeRequest_vaultInfo());
    });
    if (batchObjects.length === 0) {
      return;
    }

    // make multicall
    const mc = vaultinator3000.makeMultiCall(false);
    const [ret] = await LWeb3.tryMultiCall(
      mc,
      batchCalls,
      '[Vault] batch vaultInfo',
      'Vault: vaultInfo'
    );

    // process calls
    for (let n = 0; n < batchObjects.length; n += 1) {
      const t = batchObjects[n];
      const r = ret[n];
      // eslint-disable-next-line no-await-in-loop
      await t.processRequest_vaultInfo(r);
    }
  }

  makeRequest_vaultInfo() {
    const con = this.getContract();
    return {
      totalDeposit: con.methods.balance(),
      totalPending: con.methods.poolPending(),
      isFarmable: con.methods.isPoolFarmable(),
      lastCompound: con.methods.lastCompound(),
      harvestLockUntil: con.methods.poolHarvestLockUntil(),
      strategyCandidate: con.methods.strategyCandidate(),
    };
  }

  async processRequest_vaultInfo(_data) {
    this.totalDeposit = _data.totalDeposit;
    this.totalPending = _data.totalPending;
    this.isFarmable = _data.isFarmable;
    this.lastCompound =
      _data.lastCompound === 0
        ? null
        : new Date(parseInt(_data.lastCompound, 10) * 1000);
    this.harvestLockUntil =
      _data.lastCompound === 0
        ? null
        : new Date(parseInt(_data.harvestLockUntil, 10) * 1000);
    // eslint-disable-next-line prefer-destructuring
    this.proposedStrategy = _data.strategyCandidate[0];
    this.proposedTime = parseInt(_data.strategyCandidate[1], 10);

    // process
    this.totalDepositUSD = this.depositToken.getPriceUSDForAmount(
      this.totalDeposit
    );
    this.totalPendingUSD = this.depositToken.getPriceShare(
      this.rewardToken.getPriceUSDForAmount(this.totalPending),
      1 - this.vaultinator3000.vaultChef.totalProfitFee
    );
    this.compoundRewardUSD = this.depositToken.getPriceShare(
      this.rewardToken.getPriceUSDForAmount(this.totalPending),
      this.vaultinator3000.vaultChef.compoundRewardFee
    );

    // complete
    this.initializedInfo = true;

    // event
    document.dispatchEvent(
      new CustomEvent('vault_vaultInfo', {
        detail: {
          address: this.address,
        },
      })
    );
  }

  async reloadVaultInfo() {
    // lazy init
    await this.init();
    if (!this.initialized) {
      return;
    }

    // handle result
    const [ret] = await LWeb3.tryMultiCall(
      this.vaultinator3000.makeMultiCall(false),
      [this.makeRequest_vaultInfo()],
      this.debugErrorString('vaultInfo'),
      'Vault: vaultInfo'
    );
    this.processRequest_vaultInfo(ret[0]);
  }

  /// /////////////////////////////////

  static async batchLoadUserInfo(_vaults, vaultinator3000) {
    const batchObjects = [];
    const batchCalls = [];

    // get valid vaults
    const initVaults = await Vault.batchInit(_vaults, vaultinator3000);
    initVaults.forEach((v) => {
      batchObjects.push(v);
      batchCalls.push(v.makeRequest_userInfo());
    });
    if (batchObjects.length === 0) {
      return;
    }

    // make multicall
    const mc = vaultinator3000.makeMultiCall(true);
    const [ret] = await LWeb3.tryMultiCall(
      mc,
      batchCalls,
      '[Vault] batch userInfo',
      'Vault: userInfo'
    );

    // process calls
    for (let n = 0; n < batchObjects.length; n += 1) {
      const t = batchObjects[n];
      const r = ret[n];
      // eslint-disable-next-line no-await-in-loop
      await t.processRequest_userInfo(r);
    }
  }

  makeRequest_userInfo() {
    const con = this.getContract(true);
    return {
      userDeposit: con.methods.balanceOf(this.vaultinator3000.account),
      userPending: con.methods.userPending(this.vaultinator3000.account),
      isApproved: con.methods.checkApproved(this.vaultinator3000.account),
    };
  }

  async processRequest_userInfo(_data) {
    this.userDeposit = _data.userDeposit;
    this.userPending = _data.userPending;
    this.isApproved = _data.isApproved;

    // process
    this.userDepositUSD = this.depositToken.getPriceUSDForAmount(
      this.userDeposit
    );
    this.userPendingUSD = this.depositToken.getPriceShare(
      this.rewardToken.getPriceUSDForAmount(this.userPending),
      1 - this.vaultinator3000.vaultChef.totalProfitFee
    );
    this.userProfitLoss = await this.calcUserProfitLoss();
    this.calculateEarnings();

    // complete
    this.initializedUser = true;

    // event
    document.dispatchEvent(
      new CustomEvent('vault_userInfo', {
        detail: {
          address: this.address,
        },
      })
    );
  }

  async reloadUserInfo() {
    // lazy init
    await this.init();
    if (!this.initialized) {
      return;
    }

    // handle result
    const [ret] = await LWeb3.tryMultiCall(
      this.vaultinator3000.makeMultiCall(true),
      [this.makeRequest_userInfo()],
      this.debugErrorString('userInfo'),
      'Vault: userInfo'
    );
    this.processRequest_userInfo(ret[0]);
  }

  /// /////////////////////////////////

  static async batchReloadDBInfo(vaultinator3000) {
    let data = [];
    try {
      let apiURL = `${vaultinator3000.api_url}?module=vault&action=getVaultsInfo`;
      apiURL += `&chain=${vaultinator3000.currentChain.id}`;
      apiURL += `&wallet=${vaultinator3000.account || ''}`;
      data = await LLib.fetchJSON(apiURL);
    } catch (e) {
      // // console.log(e);
    }

    for (let n = 0; n < data.length; n += 1) {
      const d = data[n];
      const v = vaultinator3000.findVault(d.id);
      if (v === null) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // process
      if (d.dateTime !== null) {
        v.compounds24h = d.compounds24h || 1;
        v.dailyAPR = parseFloat(d.dailyAPR) / 100;
        v.dailyLPFeeAPR = parseFloat(d.dailyLPFeeAPR) / 100;

        v.calculateAPR();
        v.calculateEarnings();
      }
      v.lastUserTransaction = d;

      // complete
      v.initializedDB = true;

      // event
      document.dispatchEvent(
        new CustomEvent('vault_userInfo', {
          detail: {
            address: v.address,
          },
        })
      );
    }
  }

  async reloadDBInfo() {
    // daily APR
    await this.db_getDailyAPR();

    // account
    if (this.vaultinator3000.account !== null) {
      // profit loss
      this.userProfitLoss = await this.calcUserProfitLoss();
    }

    // complete
    this.initializedDB = true;

    // event
    document.dispatchEvent(
      new CustomEvent('vault_userInfo', {
        detail: {
          address: this.address,
        },
      })
    );
  }

  /// /////////////////////////////////

  async upgradeStrat() {
    const con = this.getContract(true);
    await this.vaultinator3000.trySend(
      con.methods.upgradeStrat(),
      this.vaultinator3000.account,
      this.debugErrorString('upgradeStrat'),
      undefined,
      `Upgrade Strategy ${this.id}`
    );
  }

  async checkApproved() {
    return this.vaultinator3000.vaultChef.checkVaultApproved(this.id);
  }

  async approve() {
    await this.depositToken.approve(this.address);
  }

  async compound() {
    await this.vaultinator3000.vaultChef.compound(
      this.id,
      `Compound Vault ${this.depositToken.getFullName()}`
    );
  }

  async deposit(_amount) {
    const amountStr = LWeb3.smartFormatTokens(
      this.vaultinator3000.toBN(_amount),
      this.depositToken,
      true
    );
    await this.vaultinator3000.vaultChef.deposit(
      this.id,
      _amount,
      `Deposit ${amountStr} ${this.depositToken.getFullName()}`
    );
  }

  async withdraw(_amount) {
    const amountStr = LWeb3.smartFormatTokens(
      this.vaultinator3000.toBN(_amount),
      this.depositToken,
      true
    );
    await this.vaultinator3000.vaultChef.withdraw(
      this.id,
      _amount,
      `Withdraw ${amountStr} ${this.depositToken.getFullName()}`
    );
  }

  async withdrawAll() {
    await this.vaultinator3000.vaultChef.withdrawAll(
      this.id,
      `Withdraw all ${this.depositToken.getFullName()}`
    );
  }

  /// /////////////////////////////////

  isFarm() {
    return this.depositToken.isLPToken();
  }

  hasStable() {
    return this.depositToken.isStable() || this.depositToken.hasStable();
  }

  userHasBalance() {
    return this.depositToken.userBalance !== '0';
  }

  userHasDeposit() {
    return this.userDeposit !== '0';
  }

  hasDepositAsset(_tokenAddress) {
    if (this.depositToken.isLPToken()) {
      return (
        LWeb3.checkEqualAddress(this.depositToken.token0, _tokenAddress) ||
        LWeb3.checkEqualAddress(this.depositToken.token1, _tokenAddress)
      );
    }

    return LWeb3.checkEqualAddress(this.depositToken.address, _tokenAddress);
  }

  /// /////////////////////////////////

  calculateFees() {
    this.totalDepositFeeTaxFactor =
      (1 - this.additionalDepositTax) * (1 - this.depositFee);
    this.totalWithdrawFeeTaxFactor =
      1 /
      (1 - this.additionalWithdrawTax) /
      (1 - this.withdrawFee) /
      (1 - this.vaultinator3000.vaultChef.withdrawFee);
  }

  calculateAPR() {
    if (this.compounds24h === 1) {
      this.compoundedDailyAPR = this.dailyAPR;
    } else {
      this.compoundedDailyAPR =
        // eslint-disable-next-line no-restricted-properties
        Math.pow(this.dailyAPR / this.compounds24h + 1, this.compounds24h) - 1;
    }
    this.apr = this.compoundedDailyAPR * 365;
    this.compoundedAPY =
      // eslint-disable-next-line no-restricted-properties
      Math.pow(this.dailyAPR / this.compounds24h + 1, 365 * this.compounds24h) -
      1;
    this.lpFeeAPR = this.dailyLPFeeAPR * 365;
    this.combinedAPY = this.compoundedAPY + this.lpFeeAPR;
    this.combinedDailyAPR = this.dailyAPR + this.dailyLPFeeAPR;
  }

  calculateEarnings() {
    const depositUSD = LWeb3.smartFormatFiat(
      this.userDepositUSD,
      this.vaultinator3000.stableToken
    );
    const dailyUSD = depositUSD * this.dailyAPR;

    // apr
    this.roiDailyAPR = dailyUSD;
    this.roiWeeklyAPR = dailyUSD * 7;
    this.roiMonthlyAPR = dailyUSD * 30;
    this.roiYearlyAPR = dailyUSD * 365;

    // apy
    this.roiDailyAPY = dailyUSD;
    this.roiWeeklyAPY = depositUSD * (1 + this.dailyAPR ** 7 - 1);
    this.roiMonthlyAPY = depositUSD * (1 + this.dailyAPR ** 30 - 1);
    this.roiYearlyAPY = depositUSD * (1 + this.dailyAPR ** 365 - 1);
  }

  async calcUserProfitLoss() {
    const lastTransaction = this.lastUserTransaction; // await this.db_getLastUserTransaction()
    if (lastTransaction === null) {
      return 0;
    }

    const profitLoss = this.calculateProfitLoss(
      this.vaultinator3000.toBN(this.userDeposit),
      this.vaultinator3000.toBN(`0x${lastTransaction.userDepositSum}`),
      this.vaultinator3000.toBN(`0x${lastTransaction.userWithdrawSum}`),
      this.vaultinator3000.toBN(`0x${lastTransaction.userReinvestedSum}`)
    );
    return profitLoss;
  }

  calculateProfitLoss(
    _currentDeposit,
    _depositSum,
    _withdrawSum,
    _reinvestedSum
  ) {
    if (_depositSum.cmp(this.vaultinator3000.toBN(0)) === 0) {
      return 0;
    }

    const pf = this.vaultinator3000.toBN(
      this.vaultinator3000.vaultChef.percentFactor
    );
    const pla = this.calcProfitLossAmount(
      _currentDeposit,
      _depositSum,
      _withdrawSum
    );
    const ri = this.calcRealInvestment(_depositSum, _reinvestedSum);
    const profitLoss = pla.mul(pf).div(ri);
    const percent =
      parseFloat(parseInt(profitLoss.toString(10), 10)) /
      this.vaultinator3000.vaultChef.percentFactor;

    return percent;
  }

  // eslint-disable-next-line class-methods-use-this
  calcProfitLossAmount(_currentDeposit, _depositSum, _withdrawSum) {
    return _currentDeposit.add(_withdrawSum).sub(_depositSum);
  }

  // eslint-disable-next-line class-methods-use-this
  calcRealInvestment(_depositSum, _reinvestedSum) {
    return _depositSum.sub(_reinvestedSum);
  }

  /// /////////////////////////////////

  async scanEvent(_name, _fromBlock, _toBlock) {
    return LWeb3.scanEvent(this.getContract(), _name, _fromBlock, _toBlock);
  }

  async scanEvent_Compound(_fromBlock, _toBlock) {
    return this.scanEvent('Compound', _fromBlock, _toBlock);
  }

  async scanEvent_Deposit(_fromBlock, _toBlock) {
    return this.scanEvent('Deposit', _fromBlock, _toBlock);
  }

  async scanEvent_Withdraw(_fromBlock, _toBlock) {
    return this.scanEvent('Withdraw', _fromBlock, _toBlock);
  }

  /// /////////////////////////////////

  async db_getHistoricCompounds(_filter, _forceReload) {
    // eslint-disable-next-line no-param-reassign
    _filter = _filter || {};

    if (_forceReload) {
      let data;
      try {
        let apiURL = `${this.api_url}?module=vaultCompound&action=getVaultCompoundsPast`;
        apiURL += `&chain=${this.vaultinator3000.currentChain.id}`;
        apiURL += `&vault=${this.id}`;
        apiURL += `&days=${_filter.days || 30}`;
        data = await LLib.fetchJSON(apiURL);
      } catch (e) {
        // console.log(e);
      }

      return data;
    }

    return this.cache_vaultCompoundHistory.getData(_filter);
  }

  async db_getDailyAPR() {
    // get daily apr
    try {
      let apiURL = `${this.api_url}?module=vault&action=getVaultAPR`;
      apiURL += `&chain=${this.vaultinator3000.currentChain.id}`;
      apiURL += `&vault=${this.id}`;
      const apiJson = await LLib.fetchJSON(apiURL);
      if (apiJson.block !== 0) {
        this.compounds24h = apiJson.compounds24h || 1;
        this.dailyAPR = parseFloat(apiJson.dailyAPR) / 100;
      }
    } catch (e) {
      // console.log(e);
    }

    this.calculateAPR();
    this.calculateEarnings();
  }

  async db_setSyncBlock(_block) {
    try {
      let apiURL = `${this.api_url}?module=vault&action=setVaultSyncBlock`;
      apiURL += `&chain=${this.vaultinator3000.currentChain.id}`;
      apiURL += `&vault=${this.id}`;
      apiURL += `&block=${_block}`;
      await LLib.fetch(apiURL);
    } catch (e) {
      // console.log(e);
    }
  }

  async db_setProcessBlock(_block) {
    try {
      let apiURL = `${this.api_url}?module=vault&action=setVaultProcessBlock`;
      apiURL += `&chain=${this.vaultinator3000.currentChain.id}`;
      apiURL += `&vault=${this.id}`;
      apiURL += `&block=${_block}`;
      await LLib.fetch(apiURL);
    } catch (e) {
      // console.log(e);
    }
  }

  async db_getLastCompound(_block, _transactionIndex, _logIndex) {
    try {
      let apiURL = `${this.api_url}?module=vaultCompound&action=getLastCompound`;
      apiURL += `&chain=${this.vaultinator3000.currentChain.id}`;
      apiURL += `&vault=${this.id}`;
      apiURL += `&block=${_block}`;
      apiURL += `&transactionIndex=${_transactionIndex}`;
      apiURL += `&logIndex=${_logIndex}`;
      const apiJson = await LLib.fetchJSON(apiURL);
      if (apiJson.block !== 0) {
        this.db.lastCompound = parseInt(apiJson.dateTime, 10);
        this.db.lastCompoundUTC = new Date(this.db.lastCompound * 1000);
      }
    } catch (e) {
      // console.log(e);
    }
    return this.db.lastCompound;
  }

  async db_getSyncBlock() {
    try {
      let apiURL = `${this.api_url}?module=vault&action=getVaultSyncBlock`;
      apiURL += `&chain=${this.vaultinator3000.currentChain.id}`;
      apiURL += `&vault=${this.id}`;
      const apiJson = await LLib.fetchJSON(apiURL);
      if (apiJson.result !== undefined) {
        this.last.syncBlock = this.db.syncBlock;
        this.db.syncBlock = parseInt(apiJson.result, 10);
      }
    } catch (e) {
      // console.log(e);
    }
    return this.db.syncBlock;
  }

  async db_getProcessBlock() {
    try {
      let apiURL = `${this.api_url}?module=vault&action=getVaultProcessBlock`;
      apiURL += `&chain=${this.vaultinator3000.currentChain.id}`;
      apiURL += `&vault=${this.id}`;
      const apiJson = await LLib.fetchJSON(apiURL);
      if (apiJson.result !== undefined) {
        this.last.processBlock = this.db.processBlock;
        this.db.processBlock = parseInt(apiJson.result, 10);
      }
    } catch (e) {
      // console.log(e);
    }
    return this.db.processBlock;
  }

  async db_getLastUserTransaction() {
    try {
      let apiURL = `${this.api_url}?module=vaultTransaction&action=getLastVaultUserTransaction`;
      apiURL += `&chain=${this.vaultinator3000.currentChain.id}`;
      apiURL += `&vault=${this.id}`;
      apiURL += `&wallet=${this.vaultinator3000.account}`;
      const apiJson = await LLib.fetchJSON(apiURL);
      if (apiJson.current !== undefined) {
        this.lastUserTransaction = apiJson.current;
        return apiJson.current;
      }
    } catch (e) {
      // console.log(e);
    }
    return null;
  }

  async db_addVaultWithdrawOrDeposit(_event, _isDeposit) {
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
    const c_realAmount = _event.returnValues[2];
    const c_depositBefore = _event.returnValues[3];
    const c_depositAfter = _event.returnValues[4];

    // write to db
    {
      let apiURL = `${this.api_url}?module=vaultTransaction&action=addVault${
        _isDeposit ? 'Deposit' : 'Withdraw'
      }`;
      apiURL += `&chain=${this.vaultinator3000.currentChain.id}`;
      apiURL += `&vault=${this.id}`;
      apiURL += `&block=${c_block}`;
      apiURL += `&transactionIndex=${c_transactionIndex}`;
      apiURL += `&logIndex=${c_logIndex}`;
      apiURL += `&timestamp=${c_timestamp}`;
      apiURL += `&wallet=${c_from}`;
      apiURL += `&amount=${LWeb3.abiEncodeUint256(c_amount)}`;
      apiURL += `&realAmount=${LWeb3.abiEncodeUint256(c_realAmount)}`;
      apiURL += `&depositBefore=${LWeb3.abiEncodeUint256(c_depositBefore)}`;
      apiURL += `&depositAfter=${LWeb3.abiEncodeUint256(c_depositAfter)}`;
      await LLib.fetch(apiURL);
    }

    return {
      timestamp: c_timestamp,
      datetime: c_datetime,
      block: c_block,
    };
  }

  async db_addVaultWithdraw(_withdraw) {
    return this.db_addVaultWithdrawOrDeposit(_withdraw, false);
  }

  async db_addVaultDeposit(_deposit) {
    return this.db_addVaultWithdrawOrDeposit(_deposit, true);
  }

  async db_addVaultCompound(_compound) {
    // get values
    const c_block = _compound.blockNumber;
    const c_transactionIndex = _compound.transactionIndex;
    const c_logIndex = _compound.logIndex;
    const c_timestamp = (
      await this.vaultinator3000
        .selectWeb3Connection(false)
        .eth.getBlock(c_block)
    ).timestamp;
    const c_datetime = new Date(c_timestamp * 1000);
    const c_from = _compound.returnValues[0];
    const c_tvlBefore = _compound.returnValues[1];
    const c_tvlAfter = _compound.returnValues[2];
    const c_reward = _compound.returnValues[3];
    const c_dust = _compound.returnValues[4];

    // write to db
    {
      let apiURL = `${this.api_url}?module=vaultCompound&action=addVaultCompound`;
      apiURL += `&chain=${this.vaultinator3000.currentChain.id}`;
      apiURL += `&vault=${this.id}`;
      apiURL += `&block=${c_block}`;
      apiURL += `&transactionIndex=${c_transactionIndex}`;
      apiURL += `&logIndex=${c_logIndex}`;
      apiURL += `&timestamp=${c_timestamp}`;
      apiURL += `&wallet=${c_from}`;
      apiURL += `&tvlBefore=${LWeb3.abiEncodeUint256(c_tvlBefore)}`;
      apiURL += `&tvlAfter=${LWeb3.abiEncodeUint256(c_tvlAfter)}`;
      apiURL += `&reward=${LWeb3.abiEncodeUint256(c_reward)}`;
      apiURL += `&dust=${LWeb3.abiEncodeUint256(c_dust)}`;
      await LLib.fetch(apiURL);
    }

    return {
      datetime: c_datetime,
      tvlBefore: c_tvlBefore,
      tvlAfter: c_tvlAfter,
      block: c_block,
    };
  }

  async db_processVaultCompound(_compoundId) {
    // get values
    let compound = null;
    try {
      let apiURL = `${this.api_url}?module=vaultCompound&action=getVaultCompound`;
      apiURL += `&id=${_compoundId}`;
      compound = await LLib.fetchJSON(apiURL);
    } catch (e) {
      return;
    }

    // get values
    const c_block = compound.current.block;
    const c_transactionIndex = compound.current.transactionIndex;
    const c_logIndex = compound.current.logIndex;
    const c_timestamp = parseInt(compound.current.datetime, 10);
    const c_datetime = new Date(c_timestamp * 1000);
    const c_tvlBefore = `0x${compound.current.tvlBefore}`;
    const c_tvlAfter = `0x${compound.current.tvlAfter}`;
    const tvlBefore = this.vaultinator3000.toBN(c_tvlBefore);
    const tvlAfter = this.vaultinator3000.toBN(c_tvlAfter);
    const c_reward = `0x${compound.current.reward}`;
    const c_dust = `0x${compound.current.dust}`;
    const reward = this.vaultinator3000.toBN(c_reward);
    const dust = this.vaultinator3000.toBN(c_dust);

    // calc values
    let cAPR = 0;
    let rAPR = 0;
    let dAPR = 0;
    let dustPercent = 0;
    if (c_tvlBefore !== c_tvlAfter) {
      const day = this.vaultinator3000.toBN(60 * 60 * 24);
      const pf = this.vaultinator3000.toBN(
        this.vaultinator3000.vaultChef.percentFactor
      );
      const lastCompound = await this.db_getLastCompound(
        c_block,
        c_transactionIndex,
        c_logIndex
      );

      // compound apr
      const earned = tvlAfter.sub(tvlBefore);
      const earnAPR = earned.mul(pf).div(tvlBefore);
      cAPR = parseFloat(
        (parseInt(earnAPR.toString(10), 10) * 100) /
          this.vaultinator3000.vaultChef.percentFactor
      );

      // dust % and reward %
      let dustP = this.vaultinator3000.toBN(0);
      const fullReward = reward.add(dust);
      if (fullReward.cmp(this.vaultinator3000.toBN(0)) !== 0) {
        dustP = dust.mul(pf).div(fullReward);
      }
      dustPercent = parseFloat(
        (parseInt(dustP.toString(10), 10) * 100) /
          this.vaultinator3000.vaultChef.percentFactor
      );

      // reward apr
      const earnedFromReward = earned.mul(reward).div(fullReward);
      const rewardAPR = earnedFromReward.mul(pf).div(tvlBefore);
      rAPR = parseFloat(
        (parseInt(rewardAPR.toString(10), 10) * 100) /
          this.vaultinator3000.vaultChef.percentFactor
      );

      // daily apr (reward only)
      const passed = this.vaultinator3000.toBN(c_timestamp - lastCompound);
      let earnedRewardDay = this.vaultinator3000.toBN(0);
      if (passed.cmp(this.vaultinator3000.toBN(0)) !== 0) {
        earnedRewardDay = earnedFromReward.mul(day).div(passed);
      }
      const earnedRewardDayAPR = earnedRewardDay.mul(pf).div(tvlBefore);
      dAPR = parseFloat(
        (parseInt(earnedRewardDayAPR.toString(10), 10) * 100) /
          this.vaultinator3000.vaultChef.percentFactor
      );
    }

    // write to db

    let apiURL = `${this.api_url}?module=vaultCompound&action=setVaultCompoundData`;
    apiURL += `&id=${compound.current.id}`;
    apiURL += `&cAPR=${cAPR.toFixed(4)}`;
    apiURL += `&rAPR=${rAPR.toFixed(4)}`;
    apiURL += `&dAPR=${dAPR.toFixed(4)}`;
    apiURL += `&dustPercent=${dustPercent.toFixed(4)}`;
    await LLib.fetch(apiURL);

    // eslint-disable-next-line consistent-return
    return {
      id: compound.current.id,
      datetime: c_datetime,
      block: c_block,
    };
  }

  async db_processVaultTransaction(_transactionID) {
    // get values
    let transaction = null;
    try {
      let apiURL = `${this.api_url}?module=vaultTransaction&action=getVaultTransaction`;
      apiURL += `&id=${_transactionID}`;
      transaction = await LLib.fetchJSON(apiURL);
    } catch (e) {
      return;
    }

    // calc values
    const c_block = transaction.current.block;
    const c_datetime = new Date(transaction.current.dateTime * 1000);
    const c_wallet = transaction.current.wallet;
    const { isDeposit } = transaction.current.isDeposit;
    const amount = this.vaultinator3000.toBN(`0x${transaction.current.amount}`);
    const realAmount = this.vaultinator3000.toBN(
      `0x${transaction.current.realAmount}`
    );
    const depositAfter = this.vaultinator3000.toBN(
      `0x${transaction.current.depositAfter}`
    );
    let last_userDepositSum = this.vaultinator3000.toBN(0);
    let last_userWithdrawSum = this.vaultinator3000.toBN(0);
    let last_userReinvestedSum = this.vaultinator3000.toBN(0);
    if (transaction.last !== null) {
      last_userDepositSum = this.vaultinator3000.toBN(
        `0x${transaction.last.userDepositSum}`
      );
      last_userWithdrawSum = this.vaultinator3000.toBN(
        `0x${transaction.last.userWithdrawSum}`
      );
      last_userReinvestedSum = this.vaultinator3000.toBN(
        `0x${transaction.last.userReinvestedSum}`
      );
    }
    let cur_userDepositSum = last_userDepositSum;
    let cur_userWithdrawSum = last_userWithdrawSum;
    let cur_userReinvestedSum = last_userReinvestedSum;
    if (isDeposit) {
      // deposit
      cur_userDepositSum = last_userDepositSum.add(amount);

      // reinvested
      const pla = this.calcProfitLossAmount(
        depositAfter,
        cur_userDepositSum,
        cur_userWithdrawSum
      );
      cur_userReinvestedSum = cur_userDepositSum.sub(depositAfter.sub(pla));
    } else {
      // realized loss
      cur_userWithdrawSum = last_userWithdrawSum.add(realAmount);
    }
    const profitLoss =
      this.calculateProfitLoss(
        depositAfter,
        cur_userDepositSum,
        cur_userWithdrawSum,
        cur_userReinvestedSum
      ) * 100;

    // write to db

    let apiURL = `${this.api_url}?module=vaultTransaction&action=setVaultTransactionData`;
    apiURL += `&id=${transaction.current.id}`;
    apiURL += `&userDepositSum=${LWeb3.abiEncodeUint256(cur_userDepositSum)}`;
    apiURL += `&userWithdrawSum=${LWeb3.abiEncodeUint256(cur_userWithdrawSum)}`;
    apiURL += `&userReinvestedSum=${LWeb3.abiEncodeUint256(
      cur_userReinvestedSum
    )}`;
    apiURL += `&profitLoss=${profitLoss.toFixed(4)}`;
    await LLib.fetch(apiURL);

    // eslint-disable-next-line consistent-return
    return {
      id: _transactionID,
      datetime: c_datetime,
      block: c_block,
      wallet: c_wallet,
    };
  }

  async syncToBlockchain(_step, _logEvent) {
    // get block sync
    const curBlock = this.vaultinator3000.currentBlock;
    const minBlock = parseInt(
      Math.max(
        await this.db_getSyncBlock(),
        this.vaultinator3000.currentChain.originBlock,
        this.originBlock
      ),
      10
    );
    const maxBlock = parseInt(Math.min(minBlock + _step, curBlock), 10);
    if (minBlock >= maxBlock) {
      return;
    }

    // get compound events
    const compounds = await this.scanEvent_Compound(minBlock, maxBlock);
    if (compounds === null) {
      return;
    }
    for (let n = 0; n < compounds.length; n += 1) {
      const compound = compounds[n];
      // eslint-disable-next-line no-await-in-loop
      const cRet = await this.db_addVaultCompound(compound);
      if (!!_logEvent && cRet !== undefined) {
        _logEvent(
          `[SYNC] Vault #${this.id} compound @ [${
            cRet.block
          }] ${cRet.datetime.toLocaleDateString()} ${cRet.datetime.toLocaleTimeString()}`
        );
      }
    }

    // get deposit events
    const deposits = await this.scanEvent_Deposit(minBlock, maxBlock);
    if (deposits === null) {
      return;
    }
    for (let n = 0; n < deposits.length; n += 1) {
      const deposit = deposits[n];
      // eslint-disable-next-line no-await-in-loop
      const cRet = await this.db_addVaultDeposit(deposit);
      if (!!_logEvent && cRet !== undefined) {
        _logEvent(
          `[SYNC] Vault #${this.id} deposit @ [${
            cRet.block
          }] ${cRet.datetime.toLocaleDateString()} ${cRet.datetime.toLocaleTimeString()}`
        );
      }
    }

    // get withdraw events
    const withdraws = await this.scanEvent_Withdraw(minBlock, maxBlock);
    if (withdraws === null) {
      return;
    }
    for (let n = 0; n < withdraws.length; n += 1) {
      const withdraw = withdraws[n];
      // eslint-disable-next-line no-await-in-loop
      const cRet = await this.db_addVaultWithdraw(withdraw);
      if (!!_logEvent && cRet !== undefined) {
        _logEvent(
          `[SYNC] Vault #${this.id} withdraw @ [${
            cRet.block
          }] ${cRet.datetime.toLocaleDateString()} ${cRet.datetime.toLocaleTimeString()}`
        );
      }
    }

    // set block sync
    await this.db_setSyncBlock(maxBlock);
  }

  async processData(_step, _logEvent) {
    // get block process
    const curBlock = this.vaultinator3000.currentBlock;
    const syncedTo = await this.db_getSyncBlock();
    const minBlock = parseInt(
      Math.max(
        await this.db_getProcessBlock(),
        this.vaultinator3000.currentChain.originBlock,
        this.originBlock
      ),
      10
    );
    const maxBlock = parseInt(
      Math.min(minBlock + _step, curBlock, syncedTo),
      10
    );
    if (minBlock >= maxBlock) {
      return;
    }

    // process compounds
    {
      // get all compounds in order
      let compounds = [];
      try {
        let apiURL = `${this.api_url}?module=vaultCompound&action=getVaultCompounds`;
        apiURL += `&chain=${this.vaultinator3000.currentChain.id}`;
        apiURL += `&vault=${this.id}`;
        apiURL += `&fromBlock=${minBlock}`;
        apiURL += `&toBlock=${maxBlock}`;
        compounds = await LLib.fetchJSON(apiURL);
      } catch (e) {
        return;
      }

      // iterate over them, get data, process&write
      for (let n = 0; n < compounds.length; n += 1) {
        const comp = compounds[n];
        // eslint-disable-next-line no-await-in-loop
        const cRet = await this.db_processVaultCompound(comp);
        if (_logEvent) {
          _logEvent(
            `[PROCESS] Vault #${this.id} compound @ [${
              cRet.block
            }] ${cRet.datetime.toLocaleDateString()} ${cRet.datetime.toLocaleTimeString()}`
          );
        }
      }
    }

    // process transactions
    {
      // get all transactions in order
      let transactions = [];
      try {
        let apiURL = `${this.api_url}?module=vaultTransaction&action=getVaultTransactions`;
        apiURL += `&chain=${this.vaultinator3000.currentChain.id}`;
        apiURL += `&vault=${this.id}`;
        apiURL += `&fromBlock=${minBlock}`;
        apiURL += `&toBlock=${maxBlock}`;
        transactions = await LLib.fetchJSON(apiURL);
      } catch (e) {
        return;
      }

      // iterate over them, get current&last data, process and write
      for (let n = 0; n < transactions.length; n += 1) {
        const trans = transactions[n];
        // eslint-disable-next-line no-await-in-loop
        const cRet = await this.db_processVaultTransaction(trans);
        if (_logEvent) {
          _logEvent(
            `[PROCESS] Vault #${this.id} transfer @ [${
              cRet.block
            }] ${cRet.datetime.toLocaleDateString()} ${cRet.datetime.toLocaleTimeString()}`
          );
        }
      }
    }

    // set block sync
    await this.db_setProcessBlock(maxBlock);
  }

  /// /////////////////////////////////
}

export default Vault;
