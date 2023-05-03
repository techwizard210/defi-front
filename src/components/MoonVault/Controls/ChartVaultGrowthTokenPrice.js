/* eslint-disable no-param-reassign */
// libs
import { LLib } from '../Libs/LLib';

// components
import Chart from './Chart';

class ChartVaultGrowthTokenPrice extends Chart {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      ...this.state,
      vaultID: props.vaultID,
      days: props.days || 180,
      mode: 'price',
      ignoreLPFees: false,
    };
    this.vaultinator3000 = props.vaultinator3000;
  }

  componentDidMount() {
    this.reloadData();
    this.interval = setInterval(() => this.reloadData(), 60000);
    this.setState({ options: this.initChart() });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async reloadData() {
    const vault = this.vaultinator3000.findVault(this.state.vaultID);

    // compounds
    const compounds = await vault.db_getHistoricCompounds({
      days: this.state.days,
    });

    // price
    const prices = await vault.depositToken.db_getHistoricPrice({
      days: this.state.days,
    });

    // lp fees
    const lpFees = await vault.depositToken.db_getHistoricLPFee({
      days: this.state.days,
    });

    // fill data
    this.processData(compounds, prices, lpFees);
  }

  initChart(_compounds, _hasLPFee) {
    // init
    let colors = this.makeColorList();
    if (!_hasLPFee) {
      colors = [colors[0], colors[colors.length - 1]];
    }
    const rangeStart = new Date();
    rangeStart.setDate(rangeStart.getDate() - this.state.days);

    // set options
    const opts = this.makeOptions();
    this.setLabels();
    this.setType(opts, 'area');
    this.setColors(opts, colors);
    opts.chart = {
      ...opts.chart,
      sparkline: {
        enabled: !this.showLabels,
      },
      zoom: {
        type: 'x',
      },
    };
    opts.grid = {
      ...opts.grid,
      borderColor: '#111',
    };
    opts.xaxis = {
      ...opts.xaxis,
      type: 'datetime',
      labels: {
        ...opts.xaxis.labels,
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    };
    opts.yaxis = {
      ...opts.yaxis,
      show: this.showLabels,
      tickAmount: 4,
      lines: {
        show: true,
      },
      labels: {
        formatter: (_val) => {
          return LLib.formatFiat(_val, true, true);
        },
      },
    };
    opts.tooltip = {
      ...opts.tooltip,
      x: {
        ...opts.tooltip.x,
        show: true,
        formatter(value) {
          return LLib.formatDate(value, false, true);
        },
      },
    };
    opts.stroke = {
      ...opts.stroke,
      curve: 'straight',
    };
    opts.legend = {
      ...opts.legend,
      show: false,
      position: 'top',
    };
    opts.fill = {
      ...opts.fill,
      type: 'gradient',
      gradient: {
        type: 'vertical',
        opacityFrom: 0.8,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    };
    return opts;
  }

  getMatchingPrice = (_date, _prices) => {
    for (let n = _prices.length - 1; n >= 0; n -= 1) {
      const priceDate = LLib.getDateTimeFromDB(_prices[n].date);
      if (priceDate.getTime() <= _date.getTime()) {
        return _prices[n].price;
      }
    }

    return 0;
  };

  getMatchingGrowth = (_date, _compounds) => {
    for (let n = _compounds.length - 1; n >= 0; n -= 1) {
      const compoundDate = LLib.getDateTimeFromDB(_compounds[n].dateTime);
      if (compoundDate.getTime() <= _date.getTime()) {
        return _compounds[n].growth;
      }
    }

    return 0;
  };

  getMatchingLPFee = (_date, _lpFees) => {
    for (let n = _lpFees.length - 1; n >= 0; n -= 1) {
      const feeDate = LLib.getDateTimeFromDB(_lpFees[n].date);
      if (feeDate.getTime() <= _date.getTime()) {
        return _lpFees[n].growth;
      }
    }

    return 0;
  };

  getCompoundGrowth = (_compounds) => {
    let cBase = 1;
    for (let n = 0; n < _compounds.length; n += 1) {
      cBase *= 1 + _compounds[n].compoundAPR / 100;
      const growth = cBase - 1;

      _compounds[n].growth = growth;
    }

    return _compounds;
  };

  getLPFeeGrowth = (_lpFees) => {
    let growth = 0;
    for (let n = 0; n < _lpFees.length; n += 1) {
      growth += _lpFees[n].dailyLPFeeAPR / 100;
      _lpFees[n].growth = growth;
    }

    return _lpFees;
  };

  removeBeforeDate = (_date, _datas) => {
    while (_datas.length > 0) {
      const curDate = LLib.getDateTimeFromDB(_datas[0].date);
      if (curDate.getTime() >= _date.getTime()) {
        break;
      }
      _datas = _datas.slice(1);
    }

    return _datas;
  };

  removeBeforeDateTime = (_date, _datas) => {
    while (_datas.length > 0) {
      const curDate = LLib.getDateTimeFromDB(_datas[0].dateTime);
      if (curDate.getTime() >= _date.getTime()) {
        break;
      }
      _datas = _datas.slice(1);
    }

    return _datas;
  };

  async processData(_compounds, _prices, _lpFees) {
    if (!_compounds?.data || !_prices?.data || !_lpFees?.data) {
      return;
    }

    // get start date
    const startDate = LLib.getDateTimeFromDB(_prices.data[0].date);

    // shorten data to range
    _compounds.data = this.removeBeforeDateTime(startDate, _compounds.data);
    _lpFees.data = this.removeBeforeDate(startDate, _lpFees.data);

    // generate growth
    _compounds.data = this.getCompoundGrowth(_compounds.data);
    _lpFees.data = this.getLPFeeGrowth(_lpFees.data);

    const series = [];
    let categories = [];
    const data = [];
    const dataGain = [];
    const dataPriceGainFee = [];
    const cats = [];
    let hasLPFee = false;

    if (this.state.mode === 'growth') {
      // over compound range
      for (let n = 0; n < _compounds.data.length; n += 1) {
        const comp = _compounds.data[n];
        const dt = LLib.getDateTimeFromDB(comp.dateTime);
        const dtVal = dt.getTime();
        const price = this.getMatchingPrice(dt, _prices.data);
        const gain = price * comp.growth;

        if (price !== 0) {
          cats.push(dtVal);
          data.push([dtVal, parseFloat(price.toFixed(8))]);
          dataGain.push([dtVal, parseFloat((price + gain).toFixed(8))]);
        }
      }
    } else if (this.state.mode === 'price') {
      // over price range
      for (let n = 0; n < _prices.data.length; n += 1) {
        const { price } = _prices.data[n];
        const dt = LLib.getDateTimeFromDB(_prices.data[n].date);
        const dtVal = dt.getTime();
        const growth = this.getMatchingGrowth(dt, _compounds.data);
        const fee = this.state.ignoreLPFees
          ? 0
          : this.getMatchingLPFee(dt, _lpFees.data);
        const priceWithFee = price * Math.max(1, 1 + fee);
        const priceWithFeeAndGrowth = priceWithFee * Math.max(1, 1 + growth);

        if (price !== 0) {
          cats.push(dtVal);
          data.push([dtVal, parseFloat(price.toFixed(8))]);
          dataGain.push([dtVal, parseFloat(priceWithFeeAndGrowth.toFixed(8))]);
          dataPriceGainFee.push([dtVal, parseFloat(priceWithFee.toFixed(8))]);
          hasLPFee = hasLPFee || fee > 0;
        }
      }
    }
    series.push({
      name: 'Growth',
      data: dataGain,
    });
    if (hasLPFee) {
      series.push({
        name: 'LP Fees',
        data: dataPriceGainFee,
      });
    }
    series.push({
      name: 'Token Price',
      data,
    });
    categories = cats;

    const opts = this.initChart(_compounds, hasLPFee);
    this.setSeries(opts, series, categories);
  }
}

export default ChartVaultGrowthTokenPrice;
