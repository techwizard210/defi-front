/* eslint-disable no-unused-vars */
import React from 'react';

// libs
import { LLib } from '../Libs/LLib';

// components
import Group from './Group';
import { Text } from './Text';

// css
// import './ProgressBarVaultBreakEven.css';

class ProgressBarVaultBreakEven extends React.Component {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      vault: props.vault,
      withdraw: props.withdraw || false,
      showLabels: props.showLabels || false,
      hideIfBreakEven: false,
    };
  }

  makeGradient = (_depositFee, _withdrawFee, _min, _max) => {
    const range = _max - _min;
    const p1 = (((1 - _min) / range) * 100).toFixed(0);
    const p2 = (((_withdrawFee - _min) / range) * 100).toFixed(0);

    const gradient = `linear-gradient(
            90deg,
            var(--progressBar_breakEven_red) 0%,
            var(--progressBar_breakEven_red) ${p1}%,
            var(--progressBar_breakEven_yellow) ${p1}%,
            var(--progressBar_breakEven_yellow) ${p2}%,
            var(--progressBar_breakEven_green) ${p2}%,
            var(--progressBar_breakEven_green) 100%)`;

    return gradient;
  };

  renderFeeTax(_label, _fee, _tax, _color) {
    const fee = (
      <Text size="-1" color={`var(--progressBar_breakEven_${_color})`}>
        {LLib.smartFormatPercent(_fee * 100, true)} fee
      </Text>
    );
    const tax = (
      <Text size="-1" color={`var(--progressBar_breakEven_${_color})`}>
        {LLib.smartFormatPercent(_tax * 100, true)} tax
      </Text>
    );

    return this.renderLegendContainer(_label, fee, tax, _color);
  }

  renderLegendContainer = (_label, _text1, _text2, _color) => {
    return (
      <Group
        className="legendContainer"
        style={{ borderColor: `var(--progressBar_breakEven_${_color})` }}
      >
        <Text size="-1" color={`var(--progressBar_breakEven_${_color})`}>
          {_label}:
        </Text>
        {_text1}
        {_text2}
      </Group>
    );
  };

  render() {
    const { className } = this.props;
    const { withdraw, hideIfBreakEven, showLabels, vault } = this.state;
    const cn = `ProgressBarVaultBreakEven ${className || ''}`;

    // get stats
    const depositFeeLimit = vault.totalDepositFeeTaxFactor;
    const withdrawFeeLimit = vault.totalWithdrawFeeTaxFactor;
    const current = withdraw ? 1 + vault.userProfitLoss : depositFeeLimit;

    // get min/max/current
    const min = withdraw ? Math.min(current, depositFeeLimit) : depositFeeLimit;
    const value = withdraw ? current : depositFeeLimit;
    const max = withdraw ? Math.max(current, 1.1) : 1.1;
    const style = {
      background: this.makeGradient(
        depositFeeLimit,
        withdrawFeeLimit,
        min,
        max
      ),
      height: '5px',
    };

    // check if display required
    if (value >= withdrawFeeLimit && hideIfBreakEven) {
      return null;
    }

    let labelLegend = <></>;
    const labelInfo = <></>;
    if (showLabels) {
      let labelProfit = <></>;
      if (current < withdrawFeeLimit) {
        // not full break even yet
        const days = Math.ceil((withdrawFeeLimit - current) / vault.dailyAPR);
        labelProfit = this.renderLegendContainer(
          'break even',
          <Text size="-1" color="var(--progressBar_breakEven_green)">
            in ~{Number.isFinite(days) ? days : '???'} days
          </Text>,
          <Text size="-1" color="var(--progressBar_breakEven_green)">
            at {LLib.smartFormatPercent(vault.dailyAPR * 100, true)} daily
          </Text>,
          'green'
        );
      }

      // legend
      let labelDepositFee = <></>;
      if (depositFeeLimit !== 1 && !withdraw) {
        labelDepositFee = this.renderFeeTax(
          'deposit',
          vault.depositFee,
          vault.additionalDepositTax,
          'red'
        );
      }
      let labelWithdrawFee = <></>;
      if (vault.withdrawFee !== 0 || vault.additionalWithdrawTax !== 0) {
        labelWithdrawFee = this.renderFeeTax(
          'withdraw',
          vault.withdrawFee,
          vault.additionalWithdrawTax,
          'yellow'
        );
      }

      labelLegend = (
        <>
          {labelDepositFee}
          {labelWithdrawFee}
          {labelProfit}
        </>
      );
    }

    // fee disclaimer
    let disclaimer = <></>;
    if (window.chef.vaultChef.withdrawFee > 0) {
      disclaimer = (
        <Text size="-2" color="2" italic="true">
          (*){' '}
          {LLib.smartFormatPercent(
            window.chef.vaultChef.withdrawFee * 100,
            true
          )}{' '}
          withdraw fee from Moon Vault
        </Text>
      );
    }

    return (
      <Group className={cn}>
        <Group className="legend">{labelLegend}</Group>
        <Group className="info">{labelInfo}</Group>
        <input
          type="range"
          style={style}
          readOnly
          step={0.01}
          min={min}
          max={max}
          value={value}
        />
        {disclaimer}
      </Group>
    );
  }
}

export default ProgressBarVaultBreakEven;
