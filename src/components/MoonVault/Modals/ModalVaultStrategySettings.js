import React from 'react';
// libs
import { LSymbols } from '../Libs/LSymbols';
import { LLib } from '../Libs/LLib';
import { LWeb3 } from '../Libs/LWeb3';

// components
import { Modal } from './Modal';
import { Text } from '../Controls/Text';
import Button from '../Controls/Button';
import Group from '../Controls/Group';
import Link from '../Controls/Link';
import InputTokenAmountConverted from '../Controls/InputTokenAmountConverted';
import CheckBox from '../Controls/CheckBox';

// css
// import './ModalVaultStrategySettings.css';

// vars
let modal_vaultStratSet = null;

class ModalVaultStrategySettings extends React.Component {
  static showModal(_vault) {
    modal_vaultStratSet.vault = _vault;
    modal_vaultStratSet.load();
    modal_vaultStratSet.setShow(true);
  }

  constructor(props) {
    super(props);

    this.vaultinator3000 = props.vaultinator3000;
    // init state
    this.state = {
      show: props.show || false,
      autoConvertDust: false,
      autoCompoundBeforeDeposit: false,
      autoCompoundBeforeWithdraw: false,
      minRewardToDeposit: '0',
      minAdditionalRewardToReward: '0',
      minDustToken0: '0',
      minDustToken1: '0',
    };
    this.vault = null;
    this.strategy = null;
    this.rewardToken = null;
    this.depositToken = null;
    this.additionalRewardToken = null;

    // refs
    this.refCheckBoxAutoDust = React.createRef();
    this.refCheckBoxAutoCompound_deposit = React.createRef();
    this.refCheckBoxAutoCompound_withdraw = React.createRef();
    this.refInputMinReward = React.createRef();
    this.refInputMinAdditionalReward = React.createRef();
    this.refInputMinDust0 = React.createRef();
    this.refInputMinDust1 = React.createRef();

    // vars
    modal_vaultStratSet = this;
    this.checkUpdate_vaultStrategy = this.checkUpdate_vaultStrategy.bind(this);
  }

  componentDidMount() {
    document.addEventListener(
      'vaultStrategy_info',
      this.checkUpdate_vaultStrategy
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      'vaultStrategy_info',
      this.checkUpdate_vaultStrategy
    );
  }

  async onClick_refresh() {
    await this.load();
  }

  async onClick_save() {
    this.setShow(false);
    if (this.vault.strategy === null) {
      return;
    }
    const {
      autoConvertDust,
      autoCompoundBeforeDeposit,
      autoCompoundBeforeWithdraw,
      minRewardToDeposit,
      minAdditionalRewardToReward,
      minDustToken0,
      minDustToken1,
    } = this.state;
    // auto actions
    if (
      autoConvertDust !== this.strategy.autoConvertDust ||
      autoCompoundBeforeDeposit !== this.strategy.autoCompoundBeforeDeposit ||
      autoCompoundBeforeWithdraw !== this.strategy.autoCompoundBeforeWithdraw
    ) {
      await this.vault.strategy.setAutoActions(
        autoConvertDust,
        autoCompoundBeforeDeposit,
        autoCompoundBeforeWithdraw
      );
    }

    // min reward
    if (
      minRewardToDeposit !== this.strategy.minRewardToDeposit ||
      minAdditionalRewardToReward !== this.strategy.minAdditionalRewardToReward
    ) {
      await this.vault.strategy.setMinRewardAmount(
        minRewardToDeposit,
        minAdditionalRewardToReward
      );
    }

    // min dust
    if (
      minDustToken0 !== this.strategy.minDustToken0 ||
      minDustToken1 !== this.strategy.minDustToken1
    ) {
      await this.vault.strategy.setMinDustAmount(minDustToken0, minDustToken1);
    }
  }

  onClick_upgrade() {
    this.vault.upgradeStrat();
  }

  onChange_value() {
    // dust
    if (this.refCheckBoxAutoDust.current !== null) {
      this.setState({
        autoConvertDust: this.refCheckBoxAutoDust.current.isChecked(),
        minDustToken0: this.vaultinator3000
          .toBN(this.refInputMinDust0.current.getAsUint256())
          .toString(10),
        minDustToken1: this.vaultinator3000
          .toBN(this.refInputMinDust1.current.getAsUint256())
          .toString(10),
      });
    }

    // reward
    this.setState({
      autoCompoundBeforeDeposit:
        this.refCheckBoxAutoCompound_deposit.current.isChecked(),
      autoCompoundBeforeWithdraw:
        this.refCheckBoxAutoCompound_withdraw.current.isChecked(),
      minRewardToDeposit: this.vaultinator3000
        .toBN(this.refInputMinReward.current.getAsUint256())
        .toString(10),
    });

    // additionalreward
    if (this.refInputMinAdditionalReward.current !== null) {
      this.setState({
        minAdditionalRewardToReward: this.vaultinator3000
          .toBN(this.refInputMinAdditionalReward.current.getAsUint256())
          .toString(10),
      });
    }
  }

  setShow(_show) {
    this.setState({
      show: _show,
    });
  }

  checkUpdate_vaultStrategy(_data) {
    if (
      LWeb3.checkEqualAddress(
        this.vault.strategy?.address,
        _data.detail.address
      )
    ) {
      this.refresh();
    }
  }

  async load() {
    const vaultStrat = await this.vault.getStrategy();
    if (vaultStrat) {
      vaultStrat.reloadData().then(() => this.refresh());
    }
  }

  refresh() {
    if (this.vault.strategy === null) {
      return;
    }

    // get data
    this.strategy = this.vault?.strategy;
    this.rewardToken = this.vaultinator3000.findToken(
      this.vault?.rewardTokenAddress
    );
    this.depositToken = this.vaultinator3000.findToken(
      this.vault?.depositTokenAddress
    );
    this.additionalRewardToken = this.vaultinator3000.findToken(
      this.strategy?.rewardTokenAddress
    );
    this.setState({
      autoConvertDust: this.strategy.autoConvertDust,
      autoCompoundBeforeDeposit: this.strategy.autoCompoundBeforeDeposit,
      autoCompoundBeforeWithdraw: this.strategy.autoCompoundBeforeWithdraw,
      minRewardToDeposit: this.strategy.minRewardToDeposit,
      minAdditionalRewardToReward: this.strategy.minAdditionalRewardToReward,
      minDustToken0: this.strategy.minDustToken0,
      minDustToken1: this.strategy.minDustToken1,
    });
  }

  renderSettingsCol = (_text, _content, _className) => {
    return (
      <Group className={`settingsCol ${_className || ''}`}>
        <Text color="2">{_text}</Text>
        {_content}
      </Group>
    );
  };

  renderSettingsRow = (_text, _content, _className) => {
    return (
      <Group className={`settingsRow ${_className || ''}`}>
        <Text color="2">{_text}</Text>
        {_content}
      </Group>
    );
  };

  renderDust = () => {
    if (this.depositToken === null || !this.depositToken.isLPToken()) {
      return null;
    }

    const token0 = this.vaultinator3000.findToken(this.depositToken.token0);
    const token1 = this.vaultinator3000.findToken(this.depositToken.token1);

    const { autoConvertDust, minDustToken0, minDustToken1 } = this.state;
    return (
      <Group>
        {this.renderSettingsRow(
          'Auto Convert Dust',
          <CheckBox
            ref={this.refCheckBoxAutoDust}
            checked={autoConvertDust}
            onChange={() => this.onChange_value()}
          />
        )}

        <Group className="row">
          {this.renderSettingsCol(
            'Min Dust Token0',
            <InputTokenAmountConverted
              ref={this.refInputMinDust0}
              token={token0}
              value={minDustToken0}
              onChange={() => this.onChange_value()}
            />,
            'col-6'
          )}
          {this.renderSettingsCol(
            'Min Dust Token1',
            <InputTokenAmountConverted
              ref={this.refInputMinDust1}
              token={token1}
              value={minDustToken1}
              onChange={() => this.onChange_value()}
            />,
            'col-6'
          )}
        </Group>
      </Group>
    );
  };

  renderMinReward = () => {
    if (this.rewardToken === null) {
      return null;
    }

    const {
      minAdditionalRewardToReward,
      autoCompoundBeforeDeposit,
      autoCompoundBeforeWithdraw,
      minRewardToDeposit,
    } = this.state;
    // additional reward
    let additionalRewardInput = <></>;
    if (this.additionalRewardToken !== null) {
      additionalRewardInput = (
        <>
          {this.renderSettingsCol(
            'Min Additional Reward',
            <InputTokenAmountConverted
              ref={this.refInputMinAdditionalReward}
              token={this.additionalRewardToken}
              value={minAdditionalRewardToReward}
              onChange={() => this.onChange_value()}
            />
          )}
        </>
      );
    }

    return (
      <Group>
        <Group className="row">
          {this.renderSettingsRow(
            'Auto Compound (deposit)',
            <CheckBox
              ref={this.refCheckBoxAutoCompound_deposit}
              checked={autoCompoundBeforeDeposit}
              onChange={() => this.onChange_value()}
            />,
            'col-6'
          )}
          {this.renderSettingsRow(
            'Auto Compound (withdraw)',
            <CheckBox
              ref={this.refCheckBoxAutoCompound_withdraw}
              checked={autoCompoundBeforeWithdraw}
              onChange={() => this.onChange_value()}
            />,
            'col-6'
          )}
        </Group>

        {this.renderSettingsCol(
          'Min Reward',
          <InputTokenAmountConverted
            ref={this.refInputMinReward}
            token={this.rewardToken}
            value={minRewardToDeposit}
            onChange={() => this.onChange_value()}
          />
        )}
        {additionalRewardInput}
      </Group>
    );
  };

  renderButtonUpgradeStrategy() {
    const when = new Date(parseInt(this.vault.proposedTime, 10) * 1000);
    let countdown = <></>;
    const diff = when.getTime() / 1000 - new Date().getTime() / 1000;
    if (diff > 0) {
      countdown = <> in {LLib.getHMS(diff)}</>;
    }

    return (
      <Button onClick={() => this.onClick_upgrade()}>
        upgrade {countdown}
      </Button>
    );
  }

  render() {
    // upgrade
    let upgrade = <></>;
    if (
      this.vault !== null &&
      this.vaultinator3000.toBN(this.vault.proposedStrategy) !==
        this.vaultinator3000.toBN(0)
    ) {
      upgrade = this.renderButtonUpgradeStrategy();
    }

    const header = <Text size="1">Settings:</Text>;
    const footer = (
      <>
        <Button
          buttonStyle="1"
          className="ModalButton"
          onClick={() => this.onClick_save()}
        >
          save
        </Button>
        <Button
          buttonStyle="1"
          className="ModalButton"
          onClick={() => this.onClick_refresh()}
        >
          refresh
        </Button>
        {upgrade}
      </>
    );

    let linkContract = <></>;
    if (this.vaultinator3000.currentChain !== null) {
      linkContract = (
        <Group className="settingsRow">
          <Text color="2">Strategy:</Text>
          <Link
            href={this.vaultinator3000.currentChain.linkExplorerContract.replace(
              '{address}',
              this.strategy?.address
            )}
            target="blank"
          >
            {LSymbols.link('svgLink contract', null, 'View Contract')}
          </Link>
        </Group>
      );
    }

    return (
      <Modal
        // eslint-disable-next-line react/destructuring-assignment
        show={this.state.show}
        className="ModalVaultStrategySettings sizeLarge"
        onClose={() => this.setShow(false)}
        header={header}
        footer={footer}
      >
        <Group className="settings">
          {linkContract}
          {this.renderMinReward()}
          {this.renderDust()}
        </Group>
      </Modal>
    );
  }
}

export default ModalVaultStrategySettings;
