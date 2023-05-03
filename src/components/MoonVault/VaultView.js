import React from 'react';

// libs
import { LLib } from './Libs/LLib';
import { LWeb3 } from './Libs/LWeb3';
import { LSymbols } from './Libs/LSymbols';

// components
import Button from './Controls/Button';
import Group from './Controls/Group';
import { Text } from './Controls/Text';
import HelpIcon from './Controls/HelpIcon';
import VaultHeader from './VaultHeader';

// css
// import './VaultView.css';

class VaultView extends React.Component {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      updateRevision: 0,
    };
    // init
    this.id = props.id;
    this.refVaultModalManager = props.refVaultModalManager;

    this.vault = props.vault;
    this.stableToken = window.chefstableToken;
    this.refVaultView = React.createRef();

    this.checkUpdate_token = this.checkUpdate_token.bind(this);
    this.checkUpdate_vault = this.checkUpdate_vault.bind(this);
  }

  componentDidMount() {
    document.addEventListener('token_userInfo', this.checkUpdate_token);
    document.addEventListener('vault_vaultInfo', this.checkUpdate_vault);
    document.addEventListener('vault_userInfo', this.checkUpdate_vault);

    if (
      this.refVaultView &&
      window.location.href.includes(`vault_${this.vault.id}`)
    ) {
      this.refVaultView.current.scrollIntoView({
        // behavior: 'smooth',
        block: 'end',
        inline: 'center',
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('token_userInfo', this.checkUpdate_token);
    document.removeEventListener('vault_vaultInfo', this.checkUpdate_vault);
    document.removeEventListener('vault_userInfo', this.checkUpdate_vault);
  }

  onClick_showCalculator() {
    this.refVaultModalManager.current.showVaultDialog('calculator', this.vault);
  }

  async onClick_compound() {
    await this.vault.compound();
  }

  async onClick_deposit() {
    if (!this.vault.initializedUser || !this.vault.isApproved) {
      this.refVaultModalManager.current.showVaultDialog('approve', this.vault);
      return;
    }

    this.refVaultModalManager.current.showVaultDialog('deposit', this.vault);
  }

  async onClick_withdraw() {
    this.refVaultModalManager.current.showVaultDialog('withdraw', this.vault);
  }

  checkUpdate_vault(_data) {
    if (LWeb3.checkEqualAddress(this.vault.address, _data.detail.address)) {
      this.updateView();
    }
  }

  updateView() {
    const { updateRevision } = { ...this.state };
    this.setState({ updateRevision: updateRevision + 1 });
  }

  checkUpdate_token(_data) {
    if (
      LWeb3.checkEqualAddress(
        this.vault.depositToken.address,
        _data.detail.address
      )
    ) {
      this.updateView();
    }
  }

  renderNameValueGroup(
    _id,
    _name,
    _value,
    _disabledColor,
    _value2,
    _icon,
    _helpText
  ) {
    const content = (
      <Text color={_disabledColor ? '0' : '2'}>
        {_value}
        {_helpText && _helpText.props.children && (
          <HelpIcon mobilePlacement="bottom-end">{_helpText}</HelpIcon>
        )}
      </Text>
    );

    return this.renderNameContentGroup(_id, _name, content, _value2, _icon);
  }

  renderNameContentGroup = (_id, _name, _content, _content2, _icon) => {
    // content 2
    let c2 = null;
    if (_content2 !== undefined) {
      c2 = <Group className="groupValue2">{_content2}</Group>;
    }

    // content group
    return (
      <Group className={`VaultInfoGroup ${_id}`}>
        <Group className="groupName">
          <Text color="1">
            {_name}
            {_icon ?? <></>}
          </Text>
        </Group>
        <Group className="groupValue">{_content}</Group>
        {c2}
      </Group>
    );
  };

  renderDepositWithdraw() {
    // get token balance
    const depositTokenBalance = this.vault.depositToken?.userBalance || '0';
    const userDeposit = this.vault.userDeposit || '0';

    // deposit
    const deposit = (
      <Button
        buttonStyle={depositTokenBalance === '0' ? '0' : '1'}
        onClick={() => this.onClick_deposit()}
        className={`VaultDepositButton ${
          depositTokenBalance === '0' ? 'VaultButtonDisabled' : ''
        }`}
      >
        Deposit
      </Button>
    );

    // withdraw
    const withdraw = (
      <Button
        buttonStyle={userDeposit === '0' ? '0' : '1'}
        onClick={() => this.onClick_withdraw()}
        className={`VaultWithdrawButton ${
          userDeposit === '0' ? 'VaultButtonDisabled' : ''
        }`}
      >
        Withdraw
      </Button>
    );

    return (
      <Group className="depositWithdraw">
        {deposit}
        {withdraw}
      </Group>
    );
  }

  renderCompound() {
    return (
      <Group className="compound">
        <Button
          buttonStyle="1"
          onClick={() => this.onClick_compound()}
          className="VaultCompoundButton"
        >
          Compound
          <br />~{' '}
          {LWeb3.formatFiatDisplay(
            this.vault.compoundRewardUSD,
            this.stableToken
          )}
          {/* {this.renderCompoundInfo()} */}
        </Button>
      </Group>
    );
  }

  renderTotalDeposit() {
    return this.renderNameValueGroup(
      'ttl',
      'TTL',
      LLib.renderLoading(
        this.vault.initializedInfo,
        LWeb3.smartFormatTokens(
          this.vault.totalDeposit,
          this.vault.depositToken,
          true
        )
      ),
      this.vault.initializedInfo && this.vault.totalDeposit === '0'
    );
  }

  renderTotalDepositUSD() {
    return this.renderNameValueGroup(
      'tvl',
      'TVL',
      LLib.renderLoading(
        this.vault.initializedInfo && this.vault.depositToken.initializedPrice,
        LWeb3.formatFiatDisplay(this.vault.totalDepositUSD, this.stableToken)
      ),
      this.vault.initializedInfo && this.vault.totalDeposit === '0'
    );
  }

  renderUserDeposit() {
    // profit/loss
    let profitLoss;
    if (this.userDeposit !== '0' || this.vault.userProfitLoss !== 0) {
      let profitLossColor = '';
      let profitLossSign = '';
      if (this.vault.userProfitLoss > 0) {
        profitLossColor = 'profit';
        profitLossSign = '+';
      } else if (this.vault.userProfitLoss < 0) {
        profitLossColor = 'loss';
      }
      profitLoss = LLib.renderLoading(
        this.vault.initializedDB && this.vault.initializedUser,
        <Text size="-1" color="0" className={profitLossColor}>
          {profitLossSign}
          {LLib.smartFormatPercent(this.vault.userProfitLoss * 100, true)}
        </Text>
      );
    }

    // user deposit
    return this.renderNameValueGroup(
      'userDeposit',
      'deposit',
      LLib.renderLoading(
        this.vault.initializedUser,
        LWeb3.smartFormatTokensDisplay(
          this.vault.userDeposit,
          this.vault.depositToken,
          true
        )
      ),
      this.vault.initializedUser && this.vault.userDeposit === '0',
      profitLoss
    );
  }

  renderVaultInfo() {
    return (
      <VaultHeader vault={this.vault} showContract={false} {...this.props} />
    );
  }

  renderDailyROI() {
    const hasLpFees =
      !!this.vault.dailyLPFeeAPR && this.vault.dailyLPFeeAPR > 0;

    return this.renderNameValueGroup(
      'dailyROI',
      'daily ROI',
      LLib.renderLoading(
        this.vault.initializedDB,
        LLib.smartFormatPercent(this.vault.combinedDailyAPR * 100, true)
      ),

      this.vault.initializedDB && this.vault.dailyAPR === 0,
      LLib.renderLoading(
        this.vault.initializedDB,
        <Text size="-1" color="0">
          {LLib.smartFormatPercent(this.vault.combinedAPY * 100, true)} APY
          {hasLpFees && (
            <HelpIcon>
              <Group className="AprBreakdown">
                <Group className="breakdownGroup">
                  <Group>Vault APY</Group>
                  <Group>
                    {LLib.smartFormatPercent(
                      this.vault.compoundedAPY * 100,
                      true,
                      3
                    )}
                  </Group>
                </Group>
                <Group className="breakdownGroup">
                  <Group>Trading APR</Group>
                  <Group>
                    {LLib.smartFormatPercent(
                      this.vault.lpFeeAPR * 100,
                      true,
                      3
                    )}
                  </Group>
                </Group>
                <Group className="TotalApr breakdownGroup">
                  <Group>Total APY</Group>
                  <Group>
                    {LLib.smartFormatPercent(
                      this.vault.combinedAPY * 100,
                      true,
                      3
                    )}
                  </Group>
                </Group>
              </Group>
            </HelpIcon>
          )}
        </Text>
      ),
      <>
        {LSymbols.calculator('svgLink', () =>
          this.onClick_showCalculator(this.vault)
        )}
      </>,
      <>
        {hasLpFees && (
          <Group className="AprBreakdown">
            <Group className="breakdownGroup">
              <Group>Vault Daily APR</Group>
              <Group>
                {LLib.smartFormatPercent(this.vault.dailyAPR * 100, true, 3)}
              </Group>
            </Group>
            <Group className="breakdownGroup">
              <Group>Trading Daily APR</Group>
              <Group>
                {LLib.smartFormatPercent(
                  this.vault.dailyLPFeeAPR * 100,
                  true,
                  3
                )}
              </Group>
            </Group>
            <Group className="TotalApr breakdownGroup">
              <Group>Total Daily APR</Group>
              <Group>
                {LLib.smartFormatPercent(
                  this.vault.combinedDailyAPR * 100,
                  true,
                  3
                )}
              </Group>
            </Group>
          </Group>
        )}
      </>
    );
  }

  renderCompoundInfo() {
    let color = 'red';
    let diff = 0;
    if (this.vault.lastCompound !== null) {
      const now = new Date().getTime() / 1000;
      const lc = this.vault.lastCompound.getTime() / 1000;
      diff = now - lc;

      if (diff >= 24 * 60 * 60) {
        color = 'red';
      } else if (diff >= 12 * 60 * 60) {
        color = 'yellow';
      } else if (diff < 12 * 60 * 60) {
        color = 'green';
      }
    }

    return (
      <>
        <br />
        <Group
          className={`compoundInfo ${color}`}
          title={LLib.getHMS(diff, true)}
        />
      </>
    );
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    const cn = `VaultView ${this.props.className || ''}`;

    return (
      <Group
        id={`vault_${this.vault.id}`}
        ref={this.refVaultView}
        className={cn}
      >
        {this.renderVaultInfo()}

        {this.renderDailyROI()}

        {this.renderTotalDepositUSD()}

        {this.renderUserDeposit()}

        {this.renderDepositWithdraw()}
        {this.renderCompound()}
      </Group>
    );
  }
}

export default VaultView;
