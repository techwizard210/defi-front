/* eslint-disable no-param-reassign */
import React from 'react';

// libs
import { LWeb3 } from '../Libs/LWeb3';
import { LLib } from '../Libs/LLib';

// components
import { Panel } from '../Controls/Panel';
import { Text } from '../Controls/Text';
import Group from '../Controls/Group';
import HelpIcon from '../Controls/HelpIcon';
import VaultHeader from '../VaultHeader';
import ProfitCalculator from '../Controls/ProfitCalculator';
import ChartLPBreakdown from '../Controls/ChartLPBreakdown';
import ChartVaultApr from '../Controls/ChartVaultApr';
import ChartVaultGrowthTokenPrice from '../Controls/ChartVaultGrowthTokenPrice';
import TokenIcon from '../Controls/TokenIcon';

// modals
import { Modal } from './Modal';

class ModalVaultDetails extends React.Component {
  constructor(props) {
    super(props);

    const { vault, vaultinator3000 } = props;
    // init state
    this.state = {
      id: vault.id,
      updateRevision: 0,
      onClose: props.onClose || null,
    };

    this.vault = vault;
    this.vaultinator3000 = vaultinator3000;
    this.updateView = this.updateView.bind(this);
    this.checkUpdate_token = this.checkUpdate_token.bind(this);
    this.checkUpdate_vault = this.checkUpdate_vault.bind(this);
  }

  componentDidMount() {
    document.addEventListener('app_reload', this.updateView);
    document.addEventListener('token_userInfo', this.checkUpdate_token);
    document.addEventListener('vault_vaultInfo', this.checkUpdate_vault);
    document.addEventListener('vault_userInfo', this.checkUpdate_vault);
  }

  componentWillUnmount() {
    document.removeEventListener('app_reload', this.updateView);
    document.removeEventListener('token_userInfo', this.checkUpdate_token);
    document.removeEventListener('vault_vaultInfo', this.checkUpdate_vault);
    document.removeEventListener('vault_userInfo', this.checkUpdate_vault);
  }

  close() {
    const { onClose } = this.state;
    if (onClose) {
      onClose();
    }
  }

  updateView() {
    const { id, updateRevision } = this.state;
    if (this.vault === null) {
      this.vault = this.vaultinator3000.findVault(id);
    }
    this.setState({ updateRevision: updateRevision + 1 });
  }

  checkUpdate_token(_data) {
    if (
      this.vault &&
      (LWeb3.checkEqualAddress(
        this.vault.depositToken.address,
        _data.detail.address
      ) ||
        LWeb3.checkEqualAddress(
          this.vault.rewardToken.address,
          _data.detail.address
        ))
    ) {
      this.updateView();
    }
  }

  checkUpdate_vault(_data) {
    if (
      this.vault &&
      LWeb3.checkEqualAddress(this.vault.address, _data.detail.address)
    ) {
      this.updateView();
    }
  }

  renderDetailRow = (_label, _value, _init, _helpIcon) => {
    if (_init === undefined) {
      _init = true;
    }

    return (
      <Group className="row detail-row">
        <Group className="col-6">
          <Text color="2">{_label}</Text>
          {_helpIcon}
        </Group>
        <Group className="col-6">
          <Text color="2">{LLib.renderLoading(_init, _value)}</Text>
        </Group>
      </Group>
    );
  };

  renderVaultHeader() {
    return (
      <Group className="header col-12">
        <Group className="VaultHeader">
          <TokenIcon token={this.vault.depositToken} {...this.props} />
          <Group className="VaultHeaderGroup">
            <Text className="name" color="1">
              {this.vault.name}
            </Text>
          </Group>
        </Group>

        <VaultHeader
          vault={this.vault}
          showDetailsLink={false}
          showSettings={
            this.vaultinator3000.user !== null ||
            this.vaultinator3000.vaultChef.checkRole_Manager()
          }
        />
      </Group>
    );
  }

  renderDetails() {
    const init = this.vault.initialized;
    const initUser = init && this.vault.initializedUser;
    const initDB = init && this.vault.initializedDB;
    const initDeposit = init && this.vault.depositToken.initializedPrice;
    const initReward = init && this.vault.rewardToken.initializedPrice;

    // date
    let dtStr = '???';
    if (this.vault.lastCompound !== null) {
      dtStr = LLib.formatDate(this.vault.lastCompound, true, true);
    }

    // LP
    let lpBreakdown = <></>;
    let tokenOrLp = 'Token';
    if (this.vault.depositToken?.isLPToken()) {
      tokenOrLp = 'LP';

      // make series
      const token0 = this.vaultinator3000.findToken(
        this.vault.depositToken.token0
      );
      const token1 = this.vaultinator3000.findToken(
        this.vault.depositToken.token1
      );
      const totalSupply = this.vaultinator3000.toBN(
        `0x${this.vault.depositToken.totalSupply}`
      );
      const token0Res = this.vaultinator3000.toBN(
        `0x${this.vault.depositToken.token0Reserve}`
      );
      const token0ResOne = token0Res.mul(token0.one).div(totalSupply);
      const token0ResF = parseFloat(
        LWeb3.smartFormatTokens(token0ResOne, this.token0)
      );
      const token1Res = this.vaultinator3000.toBN(
        `0x${this.vault.depositToken.token1Reserve}`
      );
      const token1ResOne = token1Res.mul(token1.one).div(totalSupply);
      const token1ResF = parseFloat(
        LWeb3.smartFormatTokens(token1ResOne, this.token1)
      );

      const token0Price = LWeb3.formatFiatDisplay(token0.unitPriceUSD, token0);
      const token1Price = LWeb3.formatFiatDisplay(token1.unitPriceUSD, token1);

      lpBreakdown = (
        <>
          {this.renderDetailRow(
            `LP Breakdown (${token0.symbol})`,
            token0ResF,
            initDeposit
          )}
          {this.renderDetailRow(
            `${token0.symbol} Price`,
            token0Price,
            initDeposit
          )}
          {this.renderDetailRow(
            `LP Breakdown (${token1.symbol})`,
            token1ResF,
            initDeposit
          )}
          {this.renderDetailRow(
            `${token1.symbol} Price`,
            token1Price,
            initDeposit
          )}
          <ChartLPBreakdown
            token={this.vault.depositToken}
            useColor={[2, 0]}
            width="100%"
            height="150"
            vaultinator3000={this.vaultinator3000}
          />
        </>
      );
    }

    // end time/block
    let endTimeBlock = <></>;
    if (this.vault.endBlock !== 0) {
      endTimeBlock = this.renderDetailRow(
        'Ends in blocks:',
        this.vault.endBlock - this.vaultinator3000.currentBlock,
        init
      );
    } else if (this.vault.endTime !== null) {
      endTimeBlock = this.renderDetailRow(
        'Ends at:',
        LLib.formatDate(this.vault.endTime, true),
        init
      );
    }

    return (
      <Group className="col-12 details">
        <Group className="col-12 chart">
          <Text size="1" className="heading">
            Token Price
          </Text>
          <ChartVaultGrowthTokenPrice
            vaultID={this.vault.id}
            useColor={[4, 1, 2]}
            width="100%"
            height="150"
            vaultinator3000={this.vaultinator3000}
          />
        </Group>

        <Group className="col-12">
          <Text size="1" className="heading">
            Vault Details
          </Text>
          {this.renderDetailRow(
            'Utilized Token',
            this.vault.rewardToken.symbol
          )}
          {this.renderDetailRow(
            'Total Tokens Deposit',
            LWeb3.smartFormatTokensDisplay(
              this.vault.totalDeposit,
              this.vault.depositToken,
              true
            ),
            initDeposit
          )}
          {this.renderDetailRow(
            'Total Value Locked',
            LWeb3.formatFiatDisplay(this.vault.totalDepositUSD),
            initDeposit
          )}
          {this.renderDetailRow(
            'Total Pending Rewards',
            LWeb3.formatFiatDisplay(this.vault.totalPendingUSD),
            initReward
          )}
          {this.renderDetailRow('Last Compound', dtStr, init)}
          {endTimeBlock}
        </Group>

        <Group className="col-12">
          <Text size="1" className="heading">
            User Details
          </Text>
          {this.renderDetailRow(
            'User Deposit $',
            LWeb3.formatFiatDisplay(this.vault.userDepositUSD),
            initUser && initDeposit
          )}
          {this.renderDetailRow(
            'User Deposit Tokens',
            LWeb3.smartFormatTokensDisplay(
              this.vault.userDeposit,
              this.vault.depositToken,
              true
            ),
            initUser
          )}
          {this.renderDetailRow(
            'User Pending Rewards',
            LWeb3.formatFiatDisplay(this.vault.userPendingUSD),
            initUser && initReward
          )}
          {this.renderDetailRow(
            'Daily APR',
            <>
              {LLib.smartFormatPercent(this.vault.combinedDailyAPR * 100)}
              {this.vault.depositToken?.isLPToken() && (
                <HelpIcon className="DailyApr">
                  <Group className="AprBreakdown">
                    <Group>
                      <Group>Vault Daily APR</Group>
                      <Group>
                        {LLib.smartFormatPercent(
                          this.vault.dailyAPR * 100,
                          true,
                          3
                        )}
                      </Group>
                    </Group>
                    <Group>
                      <Group>Trading Daily APR</Group>
                      <Group>
                        {LLib.smartFormatPercent(
                          this.vault.dailyLPFeeAPR * 100,
                          true,
                          3
                        )}
                      </Group>
                    </Group>
                    <Group className="TotalApr">
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
                </HelpIcon>
              )}
            </>,
            initDB
          )}
        </Group>

        <Group className="col-md-12 chart">
          <Text size="1" className="heading">
            Daily ROI
          </Text>
          <ChartVaultApr
            vaultID={this.vault.id}
            useColor={1}
            width="100%"
            height="150"
            vaultinator3000={this.vaultinator3000}
          />
        </Group>

        <Group className="col-12">
          <Text size="1" className="heading">
            {tokenOrLp} Details
          </Text>
          {this.renderDetailRow(
            `${tokenOrLp} Price`,
            `${LWeb3.formatFiatDisplay(
              this.vault.depositToken.unitPriceUSD
            )} per ${
              this.vault.depositToken?.isLPToken()
                ? 'LP'
                : this.vault.depositToken.symbol
            }`,
            initDeposit
          )}
          {lpBreakdown}
        </Group>
      </Group>
    );
  }

  renderProfitCalculator() {
    return (
      <Group className="row details">
        <ProfitCalculator version="1" vault={this.vault} />
      </Group>
    );
  }

  renderHeader() {
    return (
      <div className="row">
        <div className="col-md-2 tokenHeader">
          <TokenIcon token={this.vault.depositToken} {...this.props} />
        </div>
        <div className="col-md-8 vaultTitle">
          <Group className="VaultHeaderGroup">
            <Text className="name" color="1" size="1">
              {this.vault.name}
            </Text>
            <Text className="platform" color="0">
              Uses: {this.vault.platform.name}
            </Text>
          </Group>
        </div>
      </div>
    );
  }

  render() {
    if (!this.vault) {
      return (
        <Group className="Page_VaultDetails">
          <Panel className="Panel_Wait">
            <Text color="2">Please wait a moment...</Text>
          </Panel>
        </Group>
      );
    }

    const { show } = this.props;

    return (
      <Modal
        show={show}
        className="ModalVaultDetails"
        onClose={() => this.close()}
        header={this.renderHeader()}
      >
        <Group className="Page_VaultDetails">{this.renderDetails()}</Group>
      </Modal>
    );
  }
}

export default ModalVaultDetails;
