// libs
import { LLib } from './Libs/LLib';
import { LWeb3 } from './Libs/LWeb3';

// contracts
import { ABI_VaultStrategy } from './Contracts/ABI_VaultStrategy';

class VaultStrategy {
  /// /////////////////////////////////

  constructor(_address) {
    // init
    this.initialized = false;

    // base values
    this.address = _address;

    // values
    this.versionString = '0.0';
    this.version = LLib.getVersion(this.versionString);
    this.baseVersionString = '0.0';
    this.baseVersion = LLib.getVersion(this.baseVersionString);
    this.rewardTokenAddress = '';
    this.additionalRewardTokenAddress = '';

    // min swap amounts
    this.minAdditionalRewardToReward = '0';
    this.minRewardToDeposit = '0';
    this.minDustToken0 = '0';
    this.minDustToken1 = '0';

    // auto actions
    this.autoConvertDust = false;
    this.autoCompoundBeforeDeposit = false;
    this.autoCompoundBeforeWithdraw = false;
  }

  /// /////////////////////////////////

  debugErrorString = (_text) => {
    return `VaultStrategy failed at: ${_text}`;
  };

  getContract(_user) {
    const web3 = window.chef.selectWeb3Connection(_user);
    const con = new web3.eth.Contract(ABI_VaultStrategy, this.address);
    return con;
  }

  /// /////////////////////////////////

  async reloadData() {
    // make multicall
    const mc = window.chef.makeMultiCall(false);
    const con = this.getContract();
    const calls = [
      {
        versionString: con.methods.VERSION(),
        baseVersionString: con.methods.BASE_VERSION(),

        rewardToken: con.methods.rewardToken(),
        additionalRewardToken: con.methods.additionalRewardToken(),

        autoConvertDust: con.methods.autoConvertDust(),
        autoCompoundBeforeDeposit: con.methods.autoCompoundBeforeDeposit(),
        autoCompoundBeforeWithdraw: con.methods.autoCompoundBeforeWithdraw(),
        minRewardToDeposit: con.methods.minRewardToDeposit(),
        minAdditionalRewardToReward: con.methods.minAdditionalRewardToReward(),
        minDustToken0: con.methods.minDustToken0(),
        minDustToken1: con.methods.minDustToken0(),
      },
    ];

    // handle result
    const [ret] = await LWeb3.tryMultiCall(
      mc,
      calls,
      this.debugErrorString('reloadData'),
      'VaultStrategy: reloadData'
    );
    const res = ret[0];
    this.versionString = res.versionString;
    this.baseVersionString = res.baseVersionString;
    this.rewardTokenAddress = res.rewardTokenAddress;
    this.additionalRewardTokenAddress = res.additionalRewardTokenAddress;
    this.autoConvertDust = res.autoConvertDust;
    this.autoCompoundBeforeDeposit = res.autoCompoundBeforeDeposit;
    this.autoCompoundBeforeWithdraw = res.autoCompoundBeforeWithdraw;
    this.minRewardToDeposit = res.minRewardToDeposit;
    this.minAdditionalRewardToReward = res.minAdditionalRewardToReward;
    this.minDustToken0 = res.minDustToken0;
    this.minDustToken1 = res.minDustToken1;

    // process
    this.version = LLib.getVersion(this.versionString);
    this.baseVersion = LLib.getVersion(this.baseVersionString);

    // complete
    this.initialized = true;

    // event
    document.dispatchEvent(
      new CustomEvent('vaultStrategy_info', {
        detail: {
          address: this.address,
        },
      })
    );
  }

  /// /////////////////////////////////

  async convertDustToReward() {
    const con = this.getContract(true);
    await LWeb3.trySend(
      con.methods.convertDustToReward(),
      window.chef.account,
      this.debugErrorString('convertDustToReward')
    );
  }

  async setAutoActions(
    _autoConvertDust,
    _autoCompoundBeforeDeposit,
    _autoCompoundBeforeWithdraw
  ) {
    const con = this.getContract(true);
    await window.chef.trySend(
      con.methods.setAutoActions(
        _autoConvertDust,
        _autoCompoundBeforeDeposit,
        _autoCompoundBeforeWithdraw
      ),
      window.chef.account,
      this.debugErrorString('setAutoActions'),
      undefined,
      'setAutoActions'
    );
  }

  async setMinRewardAmount(_reward, _additionalReward) {
    const con = this.getContract(true);
    await window.chef.trySend(
      con.methods.setMinRewardAmount(_reward, _additionalReward),
      window.chef.account,
      this.debugErrorString('setMinRewardAmount'),
      undefined,
      'setMinRewardAmount'
    );
  }

  async setMinDustAmount(_dustToken0, _dustToken1) {
    const con = this.getContract(true);
    await window.chef.trySend(
      con.methods.setMinDustAmount(_dustToken0, _dustToken1),
      window.chef.account,
      this.debugErrorString('setMinDustAmount'),
      undefined,
      'setMinDustAmount'
    );
  }

  /// /////////////////////////////////
}

export default VaultStrategy;
