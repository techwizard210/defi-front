/* eslint-disable no-param-reassign */
import React from 'react';
import { cloneDeep } from 'lodash';

// libs
import { LWeb3 } from '../Libs/LWeb3';
import { LLib } from '../Libs/LLib';
import { LSymbols } from '../Libs/LSymbols';

// components
import { Text } from './Text';
import Group from './Group';
import Link from './Link';
import Toggle from './Toggle';
import Input from './Input';
import ChartForecast from './ChartForecast';

// css
// import './ProfitCalculator.css';

const utilizeFocus = () => {
  const ref = React.createRef();
  const setFocus = () => {
    ref.current?.focus();
  };

  return { setFocus, ref };
};

class ProfitCalculator extends React.Component {
  constructor(props) {
    super(props);
    const { vault, vaultinator3000 } = this.props;
    const tokenPrice =
      LWeb3.smartFormatFiat(
        vault.depositToken.unitPriceUSD,
        vaultinator3000.stableToken,
        false
      ) ?? 0;
    const apr = (vault.dailyAPR * 100 * 365).toFixed(2);
    const profitLossOrUserDeposit = vault.profitLoss ?? vault.userDeposit;
    let uvl =
      (
        tokenPrice *
        LWeb3.smartFormatFiat(
          profitLossOrUserDeposit,
          vault.depositToken,
          false
        )
      ).toFixed(4) ?? 100;

    if (uvl === 0) {
      uvl = 100;
    }

    let uvlUpper = uvl < 10 ? 1000 : uvl * 1000;
    let aprUpper = apr < 100 ? 200 : 999;

    if (aprUpper < 50) {
      aprUpper = 100;
    }

    aprUpper = aprUpper.toFixed();
    uvlUpper = uvlUpper.toFixed();

    const initial = {
      apr,
      tokenPrice,
      uvl,
      split: 50,
      aprUpper,
      uvlUpper,
    };

    // init state
    this.state = {
      initial,
      estimate: cloneDeep(initial),
      showUSD: true,
    };

    this.vault = props.vault;
    this.version = props.version ?? 1;
    if (typeof this.version === 'string') {
      this.version = parseInt(this.version, 10);
    }

    this.resetEstimate = this.resetEstimate.bind(this);

    this.inputFocus = {
      Amount: utilizeFocus(),
      APR: utilizeFocus(),
      'BUSD Percent': utilizeFocus(),
    };
  }

  componentDidMount() {
    const { reset } = this.props;
    if (reset) {
      reset(this.resetEstimate);
    }
  }

  generateSeries = (
    numOfCompounds,
    estimateApr,
    estimateTokenPrice,
    estimateTokenUvl,
    estimateSplit,
    isBusd
  ) => {
    if (typeof estimateApr === 'string') {
      estimateApr = parseFloat(estimateApr);
    }
    if (typeof estimateTokenPrice === 'string') {
      estimateTokenPrice = parseFloat(estimateTokenPrice);
    }
    if (typeof estimateTokenUvl === 'string') {
      estimateTokenUvl = parseFloat(estimateTokenUvl);
    }
    if (typeof estimateSplit === 'string') {
      estimateSplit = parseInt(estimateSplit, 10);
    }

    let counter = numOfCompounds;
    let amount = estimateTokenUvl;
    let busd = 0;
    let date = new Date().getTime();
    const series = [];

    while (counter >= 0) {
      const dailyInterest = (estimateApr / 365 / 100) * amount;
      const split = dailyInterest * (estimateSplit / 100);

      amount += dailyInterest - split;
      busd += split;

      if (isBusd) series.push([date, busd.toFixed(2)]);
      else series.push([date, amount.toFixed(2)]);

      date += 86400000;

      counter -= 1;
    }

    return series;
  };

  calculateBusdEarnings = (
    numOfCompounds,
    estimateApr,
    estimateTokenPrice,
    estimateTokenUvl,
    estimateSplit
  ) => {
    if (typeof estimateApr === 'string') {
      estimateApr = parseFloat(estimateApr);
    }
    if (typeof estimateTokenPrice === 'string') {
      estimateTokenPrice = parseInt(estimateTokenPrice, 10);
    }
    if (typeof estimateTokenUvl === 'string') {
      estimateTokenUvl = parseInt(estimateTokenUvl, 10);
    }
    if (typeof estimateSplit === 'string') {
      estimateSplit = parseInt(estimateSplit, 10);
    }

    let counter = numOfCompounds;
    let amount = estimateTokenUvl;
    let busd = 0;

    while (counter >= 0) {
      const dailyInterest = (estimateApr / 365 / 100) * amount;
      const split = dailyInterest * (estimateSplit / 100);

      amount += dailyInterest - split;
      busd += split;

      counter -= 1;
    }

    return busd.toFixed(2);
  };

  calculateEarnings = (
    numOfCompounds,
    estimateApr,
    estimateTokenPrice,
    estimateTokenUvl,
    estimateSplit
  ) => {
    if (typeof estimateApr === 'string') {
      estimateApr = parseFloat(estimateApr);
    }
    if (typeof estimateTokenPrice === 'string') {
      estimateTokenPrice = parseFloat(estimateTokenPrice);
    }
    if (typeof estimateTokenUvl === 'string') {
      estimateTokenUvl = parseFloat(estimateTokenUvl);
    }
    if (typeof estimateSplit === 'string') {
      estimateSplit = parseInt(estimateSplit, 10);
    }

    let counter = numOfCompounds;
    let amount = estimateTokenUvl;

    while (counter >= 0) {
      const dailyInterest = (estimateApr / 365 / 100) * amount;
      const split = dailyInterest * (estimateSplit / 100);

      amount += dailyInterest - split;

      counter -= 1;
    }

    return amount.toFixed(2);
  };

  recalibrateSliderRange = (_estimate) => {
    const { estimate } = { ...this.state };
    const newEstimate = _estimate?.estimate ?? estimate;

    newEstimate.uvlUpper = newEstimate.uvl < 10 ? 1000 : newEstimate.uvl * 2;

    const newState = _estimate ?? {};
    newState.estimate = newEstimate;

    return newState;
  };

  change_uvl(uvl) {
    const { estimate } = { ...this.state };
    estimate.uvl = uvl;
    this.setState({ estimate });
  }

  change_split(split) {
    const { estimate } = { ...this.state };
    estimate.split = split;
    this.setState({ estimate });
  }

  resetEstimate(_event) {
    const { initial } = this.state;
    this.setState({ estimate: initial });

    _event?.stopPropagation();
    _event?.preventDefault();
    return false;
  }

  fiatFormatter(_value) {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.showUSD) {
      return LLib.formatFiat(_value);
    }

    return LLib.smartFormatFloatDisplay(_value, true);
  }

  sliderInputBlur() {
    this.setState(this.recalibrateSliderRange({ editingSlider: null }));
  }

  change_tokenPrice(tokenPrice) {
    const { estimate } = { ...this.state };
    estimate.tokenPrice = tokenPrice;
    this.setState({ estimate });
  }

  change_apr(apr) {
    const { estimate } = { ...this.state };
    estimate.apr = apr;
    this.setState({ estimate });
  }

  changeUsdTokenView() {
    const { showUSD, initial } = this.state;
    const { estimate } = { ...this.state };
    const { tokenPrice } = initial;

    // Convert UVL to new format
    if (showUSD) {
      // Swapping to token view
      estimate.uvl /= tokenPrice;
    } else {
      // Swapping to token view
      estimate.uvl *= tokenPrice;
    }

    this.setState(
      this.recalibrateSliderRange({
        showUSD: !showUSD,
        estimate,
      })
    );
  }

  renderSlider(label, min, max, value, handler, visible, valueFormatter) {
    if (visible === false) {
      return <></>;
    }

    const id = label.replace(' ', '_');
    // eslint-disable-next-line react/destructuring-assignment
    const editing = this.state.editingSlider === label;

    let formattedValue = value;
    if (typeof valueFormatter === 'function') {
      formattedValue = valueFormatter(formattedValue);
    }

    const blur = this.sliderInputBlur.bind(this);

    return (
      <Group>
        <Group style={{ display: editing ? 'initial' : 'none' }}>
          <Group className="row detail-row">
            <Group
              className="col-md-3 col-sm-12 col-xs-12"
              style={{ marginTop: '7px', display: 'inline-block' }}
            >
              <label htmlFor={id}>{label}</label>
            </Group>
            <Group
              className="col-md-9 col-sm-12 col-xs-12"
              style={{ margin: '5px 0' }}
            >
              <Input
                type="text"
                ref={this.inputFocus[label].ref}
                id={`${id}txt2`}
                name={`${id}txt2`}
                title={formattedValue}
                value={value}
                onBlur={(e) => blur(e)}
                onChange={(e) => handler(e.target.value)}
              />
            </Group>
          </Group>
        </Group>
        <Group style={{ display: !editing ? 'initial' : 'none' }}>
          <Group className="row detail-row">
            <Group className="col-md-3 col-sm-12 col-xs-12 d-none d-md-block">
              <label
                htmlFor={id}
                style={{ marginTop: '7px', display: 'inline-block' }}
              >
                {label}
              </label>
            </Group>
            <Group className="col-md-6 col-sm-12 col-xs-12 d-none d-md-block">
              <Input
                type="range"
                min={min}
                max={max}
                value={value}
                step="1"
                id={id}
                name={id}
                title={formattedValue}
                onChange={(e) => handler(e.target.value)}
              />
            </Group>
            <Group
              className="col-md-3 col-sm-12 col-xs-12 d-none d-md-block clickable"
              style={{ paddingTop: '7px' }}
              onClick={() => {
                this.setState({ editingSlider: label });
                window.setTimeout(() => this.inputFocus[label].setFocus(), 0);
              }}
            >
              {formattedValue}
            </Group>
            <Group className="col-md-3 col-sm-12 col-xs-12 d-md-none">
              <label
                htmlFor={`${id}txt`}
                style={{ marginTop: '7px', display: 'inline-block' }}
              >
                {label}
              </label>
            </Group>
            <Group
              className="col-md-9 col-sm-12 col-xs-12 d-md-none"
              style={{ margin: '5px 0' }}
            >
              <Input
                type="number"
                min="0"
                inputmode="numeric"
                pattern="[0-9]*"
                id={`${id}txt`}
                name={`${id}txt`}
                title={formattedValue}
                value={value}
                onChange={(e) => handler(e.target.value)}
              />
            </Group>
          </Group>
        </Group>
      </Group>
    );
  }

  renderTable(
    estimateApr,
    estimateTokenPrice,
    estimateTokenUvl,
    estimateSplit
  ) {
    let daily = 0;
    let weekly = 0;
    let monthly = 0;
    let yearly = 0;

    let busdDaily = 0;
    let busdWeekly = 0;
    let busdMonthly = 0;
    let busdYearly = 0;

    if (this.version === 1) {
      daily = this.calculateEarnings(
        1,
        estimateApr,
        estimateTokenPrice,
        estimateTokenUvl,
        0
      );
      weekly = this.calculateEarnings(
        7,
        estimateApr,
        estimateTokenPrice,
        estimateTokenUvl,
        0
      );
      monthly = this.calculateEarnings(
        30,
        estimateApr,
        estimateTokenPrice,
        estimateTokenUvl,
        0
      );
      yearly = this.calculateEarnings(
        365,
        estimateApr,
        estimateTokenPrice,
        estimateTokenUvl,
        0
      );
    } else {
      daily = this.calculateEarnings(
        1,
        estimateApr,
        estimateTokenPrice,
        estimateTokenUvl,
        estimateSplit
      );
      weekly = this.calculateEarnings(
        7,
        estimateApr,
        estimateTokenPrice,
        estimateTokenUvl,
        estimateSplit
      );
      monthly = this.calculateEarnings(
        30,
        estimateApr,
        estimateTokenPrice,
        estimateTokenUvl,
        estimateSplit
      );
      yearly = this.calculateEarnings(
        365,
        estimateApr,
        estimateTokenPrice,
        estimateTokenUvl,
        estimateSplit
      );

      busdDaily = this.calculateBusdEarnings(
        1,
        estimateApr,
        estimateTokenPrice,
        estimateTokenUvl,
        estimateSplit
      );
      busdWeekly = this.calculateBusdEarnings(
        7,
        estimateApr,
        estimateTokenPrice,
        estimateTokenUvl,
        estimateSplit
      );
      busdMonthly = this.calculateBusdEarnings(
        30,
        estimateApr,
        estimateTokenPrice,
        estimateTokenUvl,
        estimateSplit
      );
      busdYearly = this.calculateBusdEarnings(
        365,
        estimateApr,
        estimateTokenPrice,
        estimateTokenUvl,
        estimateSplit
      );
    }

    const profitDaily = (
      daily -
      estimateTokenUvl +
      parseFloat(busdDaily)
    ).toFixed(2);
    const profitWeekly = (
      weekly -
      estimateTokenUvl +
      parseFloat(busdWeekly)
    ).toFixed(2);
    const profitMonthly = (
      monthly -
      estimateTokenUvl +
      parseFloat(busdMonthly)
    ).toFixed(2);
    const profitYearly = (
      yearly -
      estimateTokenUvl +
      parseFloat(busdYearly)
    ).toFixed(2);

    const fiatFormatter = (v) => {
      return this.fiatFormatter(v);
    };

    if (this.version === 1) {
      return (
        <Group>
          <Group className="row detail-row header">
            <Group className="col-4" />
            <Group className="col-4">Compound</Group>
            <Group className="col-4">Profit</Group>
          </Group>
          <Group className="row detail-row">
            <Group className="col-4">1 Day</Group>
            <Group className="col-4">{fiatFormatter(daily)}</Group>
            <Group className="col-4">{fiatFormatter(profitDaily)}</Group>
          </Group>
          <Group className="row detail-row">
            <Group className="col-4">1 Week</Group>
            <Group className="col-4">{fiatFormatter(weekly)}</Group>
            <Group className="col-4">{fiatFormatter(profitWeekly)}</Group>
          </Group>
          <Group className="row detail-row">
            <Group className="col-4">1 Month</Group>
            <Group className="col-4">{fiatFormatter(monthly)}</Group>
            <Group className="col-4">{fiatFormatter(profitMonthly)}</Group>
          </Group>
          <Group className="row detail-row">
            <Group className="col-4">1 Year</Group>
            <Group className="col-4">{fiatFormatter(yearly)}</Group>
            <Group className="col-4">{fiatFormatter(profitYearly)}</Group>
          </Group>
        </Group>
      );
    }
    return (
      <Group>
        <Group className="row detail-row header">
          <Group className="col-3" />
          <Group className="col-3">Compound</Group>
          <Group className="col-3">BUSD</Group>
          <Group className="col-3">Profit</Group>
        </Group>
        <Group className="row detail-row">
          <Group className="col-3">1 Day</Group>
          <Group className="col-3">{fiatFormatter(daily)}</Group>
          <Group className="col-3">{fiatFormatter(busdDaily)}</Group>
          <Group className="col-3">{fiatFormatter(profitDaily)}</Group>
        </Group>
        <Group className="row detail-row">
          <Group className="col-3">1 Week</Group>
          <Group className="col-3">{fiatFormatter(weekly)}</Group>
          <Group className="col-3">{fiatFormatter(busdWeekly)}</Group>
          <Group className="col-3">{fiatFormatter(profitWeekly)}</Group>
        </Group>
        <Group className="row detail-row">
          <Group className="col-3">1 Month</Group>
          <Group className="col-3">{fiatFormatter(monthly)}</Group>
          <Group className="col-3">{fiatFormatter(busdMonthly)}</Group>
          <Group className="col-3">{fiatFormatter(profitMonthly)}</Group>
        </Group>
        <Group className="row detail-row">
          <Group className="col-3">1 Year</Group>
          <Group className="col-3">{fiatFormatter(yearly)}</Group>
          <Group className="col-3">{fiatFormatter(busdYearly)}</Group>
          <Group className="col-3">{fiatFormatter(profitYearly)}</Group>
        </Group>
      </Group>
    );
  }

  render() {
    const { vault } = this;

    if (!vault || !vault.depositToken || !vault.depositToken.symbol)
      return <></>;

    const { showUSD, estimate, initial } = this.state;
    const { apr, tokenPrice, uvl, split, uvlUpper, aprUpper } = estimate;

    const { showReset } = this.props;

    const series = [];

    if (this.version === 1) {
      series.push({
        name: 'Compounding',
        data: this.generateSeries(365, apr, tokenPrice, uvl, 0, false),
      });
    } else {
      series.push({
        name: 'Compounding',
        data: this.generateSeries(365, apr, tokenPrice, uvl, split, false),
      });

      series.push({
        name: 'BUSD',
        data: this.generateSeries(365, apr, tokenPrice, uvl, split, true),
      });
    }

    const fiatFormatter = (v) => {
      return this.fiatFormatter(v);
    };
    const percentFormatter = (v) => LLib.smartFormatPercent(v);

    let reset = <></>;
    if (typeof showReset !== 'boolean' || showReset) {
      reset = (
        <div className="row">
          <Link href target="blank" title="Reset Calculator">
            {LSymbols.refresh('svgLink', (e) => this.resetEstimate(e))}
          </Link>
        </div>
      );
    }

    return (
      <Group className="row details">
        <Group className="row">
          <Group className="col-12">
            <Group>
              <Text size="1" className="heading">
                Earnings
              </Text>
            </Group>
            {this.renderTable(apr, tokenPrice, uvl, split)}
          </Group>
          <Group className="col-12">
            <ChartForecast
              key={showUSD}
              series={series}
              showUSD={showUSD}
              tokenPrice={initial.tokenPrice}
            />
          </Group>
        </Group>

        <Text className="underlined estimationCalcRow">
          <div className="row">
            <div className="col-md-7 col-sm-12">Estimation Calculator</div>
            <div className="col-md-5 col-sm-12">
              <Toggle
                labelOn="USD"
                labelOff="Tokens"
                checked={showUSD}
                onChange={() => this.changeUsdTokenView()}
              />
            </div>
          </div>
        </Text>

        <div className="row">
          {this.renderSlider(
            'Amount',
            0,
            uvlUpper,
            uvl,
            this.change_uvl.bind(this),
            null,
            fiatFormatter
          )}
          {this.renderSlider(
            'APR',
            0,
            aprUpper,
            apr,
            this.change_apr.bind(this),
            null,
            percentFormatter
          )}
          {this.renderSlider(
            'BUSD Percent',
            0,
            100,
            split,
            this.change_split.bind(this),
            this.version >= 2,
            percentFormatter
          )}
        </div>

        {reset}
      </Group>
    );
  }
}

export default ProfitCalculator;
