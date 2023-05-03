/* eslint-disable no-empty */
/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
// libs
import { LLib } from './Libs/LLib';
import { LWeb3 } from './Libs/LWeb3';

// contracts
import { ABI_VaultChef } from './Contracts/ABI_VaultChef';

class VaultChef {
  constructor(_address, vaultinator3000) {
    // init
    this.address = _address;
    this.initialized = false;

    // values
    this.versionString = '0.0';
    this.version = LLib.getVersion(this.versionString);
    this.percentFactor = 100000;

    // data
    this.compoundRewardFee = 0;
    this.nativeLiquidityFee = 0;
    this.nativePoolFee = 0;
    this.totalProfitFee = 0;
    this.depositFee = 0;
    this.withdrawFee = 0;
    this.referredBy = '';
    this.referrals = 0;

    // roles
    this.role_superAdmin =
      '0x0d6cceaa37e5e7618474d8eb3448c6d3f2360829c16d7bd3a0564a84b4ba3d58';
    this.role_admin =
      '0x2172861495e7b85edac73e3cd5fbb42dd675baadf627720e687bcfdaca025096';
    this.role_manager =
      '0xf206625bad3d9112d5609b8d356e6fbd514cd1f69980d4ce2b3e6e68e1789ace';
    this.hasRole_superAdmin = false;
    this.hasRole_admin = false;
    this.hasRole_manager = false;

    // db
    this.dailyAPR = 0;
    this.db = {
      syncBlock: 0,
    };
    this.last = {
      syncBlock: 0,
    };

    this.vaultinator3000 = vaultinator3000;
  }

  debugErrorString(_text) {
    return `VaultChef failed at: ${_text}`;
  }

  getContract(_user) {
    const web3 = this.vaultinator3000.selectWeb3Connection(_user);
    const con = new web3.eth.Contract(ABI_VaultChef, this.address);
    return con;
  }

  async init() {
    if (this.initialized) {
      return;
    }

    // make multicall
    const mc = this.vaultinator3000.makeMultiCall(false);
    const con = this.getContract();
    const calls = [
      {
        versionString: con.methods.VERSION(),
        percentFactor: con.methods.PERCENT_FACTOR(),
        compoundRewardFee: con.methods.compoundRewardFee(),
        nativeLiquidityFee: con.methods.nativeLiquidityFee(),
        nativePoolFee: con.methods.nativePoolFee(),
        withdrawFee: con.methods.withdrawalFee(),
      },
    ];

    // handle result
    const [ret] = await LWeb3.tryMultiCall(
      mc,
      calls,
      this.debugErrorString('init'),
      'VaultChef: init'
    );
    const res = ret[0];
    this.versionString = res.versionString;
    this.percentFactor = parseInt(res.percentFactor, 10);
    this.compoundRewardFee =
      parseFloat(res.compoundRewardFee) / this.percentFactor;
    this.nativeLiquidityFee =
      parseFloat(res.nativeLiquidityFee) / this.percentFactor;
    this.nativePoolFee = parseFloat(res.nativePoolFee) / this.percentFactor;
    this.withdrawFee = parseFloat(res.withdrawFee) / this.percentFactor;

    // process
    this.version = LLib.getVersion(this.versionString);
    this.totalProfitFee =
      this.compoundRewardFee + this.nativeLiquidityFee + this.nativePoolFee;

    // complete
    this.initialized = true;
  }

  async reloadUserData() {
    await this.init();
    if (!this.initialized || this.vaultinator3000.account === null) {
      return;
    }

    // make multicall
    const mc = this.vaultinator3000.makeMultiCall(true);
    const con = this.getContract(true);
    const calls = [
      {
        referralInfo: con.methods.getReferralInfo(this.vaultinator3000.account),

        hasRole_superAdmin: con.methods.hasRole(
          this.role_superAdmin,
          this.vaultinator3000.account
        ),
        hasRole_admin: con.methods.hasRole(
          this.role_admin,
          this.vaultinator3000.account
        ),
        hasRole_manager: con.methods.hasRole(
          this.role_manager,
          this.vaultinator3000.account
        ),
      },
    ];

    // handle result
    const [ret] = await LWeb3.tryMultiCall(
      mc,
      calls,
      this.debugErrorString('userData'),
      'VaultChef: userData'
    );
    const res = ret[0];
    this.referredBy = res.referralInfo[0];
    this.referrals = parseInt(res.referralInfo[1], 10);
    this.hasRole_superAdmin = res.hasRole_superAdmin;
    this.hasRole_admin = res.hasRole_admin;
    this.hasRole_manager = res.hasRole_manager;
  }

  /// /////////////////////////////////

  checkRole_SuperAdmin() {
    return this.hasRole_superAdmin;
  }

  checkRole_Admin() {
    return this.checkRole_SuperAdmin() || this.hasRole_admin;
  }

  checkRole_Manager() {
    return this.checkRole_Admin() || this.hasRole_manager;
  }

  check_isTeam() {
    return this.checkRole_Manager();
  }

  /// /////////////////////////////////

  async checkVaultApproved(_id) {
    const con = this.getContract(true);
    return (
      (await LWeb3.tryCall(
        con.methods.checkVaultApproved(_id, this.vaultinator3000.account),
        this.debugErrorString('checkApproved'),
        false
      )) !== false
    );
  }

  async compound(_id, _description) {
    const con = this.getContract(true);
    await this.vaultinator3000.trySend(
      con.methods.compound(_id),
      this.vaultinator3000.account,
      this.debugErrorString('compound'),
      undefined,
      _description
    );
  }

  async withdrawAll(_id, _description) {
    await this.withdraw(
      _id,
      this.vaultinator3000.web3_data.eth.abi.encodeParameter('int256', '-1'),
      _description
    );
  }

  async withdraw(_id, _amount, _description) {
    const con = this.getContract(true);
    await this.vaultinator3000.trySend(
      con.methods.withdraw(_id, _amount),
      this.vaultinator3000.account,
      this.debugErrorString('withdraw'),
      undefined,
      _description
    );
  }

  async deposit(_id, _amount, _description) {
    const con = this.getContract(true);
    await this.vaultinator3000.trySend(
      con.methods.deposit(_id, _amount),
      this.vaultinator3000.account,
      this.debugErrorString('deposit'),
      undefined,
      _description
    );
  }

  async setReferrer(_referrer) {
    const con = this.getContract(true);
    await this.vaultinator3000.trySend(
      con.methods.setReferrer(_referrer),
      this.vaultinator3000.account,
      this.debugErrorString('setReferrer'),
      undefined,
      `Set ${_referrer} as referrer`
    );
  }

  /// /////////////////////////////////

  async scanEvent(_name, _fromBlock, _toBlock) {
    return LWeb3.scanEvent(this.getContract(), _name, _fromBlock, _toBlock);
  }

  async scanEvent_SetReferrer(_fromBlock, _toBlock) {
    return this.scanEvent('SetReferrer', _fromBlock, _toBlock);
  }

  /// /////////////////////////////////

  async db_setSyncBlock(_block) {
    try {
      let apiURL = `${this.vaultinator3000.api_url}?module=protocol&action=setSyncBlock`;
      apiURL += `&chain=${this.vaultinator3000.currentChain.id}`;
      apiURL += `&block=${_block}`;
      await LLib.fetch(apiURL);
    } catch (e) {}
  }

  async db_getSyncBlock() {
    try {
      let apiURL = `${this.vaultinator3000.api_url}?module=protocol&action=getSyncBlock`;
      apiURL += `&chain=${this.vaultinator3000.currentChain.id}`;
      const apiJson = await LLib.fetchJSON(apiURL);
      if (apiJson.result !== undefined) {
        this.last.syncBlock = this.db.syncBlock;
        this.db.syncBlock = parseInt(apiJson.result, 10);
      }
    } catch (e) {}
    return this.db.syncBlock;
  }

  async db_addReferral(_referral) {
    // get values
    const c_block = _referral.blockNumber;
    const c_timestamp = (
      await this.vaultinator3000
        .selectWeb3Connection(false)
        .eth.getBlock(c_block)
    ).timestamp;
    const c_datetime = new Date(c_timestamp * 1000);
    const c_user = _referral.returnValues[0];
    const c_referrer = _referral.returnValues[1];

    // write to db
    {
      let apiURL = `${this.vaultinator3000.api_url}?module=wallet&action=setReferrer`;
      apiURL += `&wallet=${c_user}`;
      apiURL += `&referrer=${c_referrer}`;
      apiURL += `&timestamp=${c_timestamp}`;
      await LLib.fetch(apiURL);
    }

    return {
      datetime: c_datetime,
      block: c_block,
    };
  }

  async syncToBlockchain(_step, _logEvent) {
    // get block sync
    const curBlock = this.vaultinator3000.currentBlock;
    const minBlock = parseInt(
      Math.max(
        await this.db_getSyncBlock(),
        this.vaultinator3000.currentChain.originBlock
      ),
      10
    );
    const maxBlock = parseInt(Math.min(minBlock + _step, curBlock), 10);
    if (minBlock >= maxBlock) {
      return;
    }

    // get compound events
    const referrals = await this.scanEvent_SetReferrer(minBlock, maxBlock);
    if (referrals === null) {
      return; // error
    }
    for (let n = 0; n < referrals.length; n += 1) {
      const referral = referrals[n];
      // eslint-disable-next-line no-await-in-loop
      const cRet = await this.db_addReferral(referral);
      if (!!_logEvent && cRet !== undefined) {
        _logEvent(
          `[REFERRER] @ [${
            cRet.block
          }] ${cRet.datetime.toLocaleDateString()} ${cRet.datetime.toLocaleTimeString()}`
        );
      }
    }

    // set block sync
    await this.db_setSyncBlock(maxBlock);
  }

  /// /////////////////////////////////
}

export default VaultChef;
