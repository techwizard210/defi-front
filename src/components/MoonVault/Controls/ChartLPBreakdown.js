/* eslint-disable no-empty */
// libs
import { LLib } from '../Libs/LLib';

// components
import Chart from './Chart';
import { LWeb3 } from '../Libs/LWeb3';

class ChartLPBreakdown extends Chart {
  constructor(props) {
    super(props);

    const { vaultinator3000 } = props;
    // init state
    this.state = {
      ...this.state,
      token: props.token,
      days: props.days || 30,
      relative: props.relative === true,
      onlyCurrent: true,
    };
    this.token0 = vaultinator3000.findToken(this.state.token.token0);
    this.token1 = vaultinator3000.findToken(this.state.token.token1);
    this.token0Max = null;
    this.token1Max = null;

    this.reloadData = this.reloadData.bind(this);
    this.formatLPTokenDataPoint = this.formatLPTokenDataPoint.bind(this);

    this.vaultinator3000 = vaultinator3000;
  }

  componentDidMount() {
    this.reloadData();
    this.interval = setInterval(this.reloadData, 60000);
    this.setState({ options: this.initChart() });
    document.addEventListener('chef_dataLoaded', this.reloadData);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    document.removeEventListener('chef_dataLoaded', this.reloadData);
  }

  async reloadData() {
    // data
    let data = [];
    try {
      let apiURL = `${this.vaultinator3000.api_url}?module=token&action=getTokenPriceHistory`;
      apiURL += `&chain=${this.vaultinator3000.currentChain.id}`;
      apiURL += `&token=${this.state.token.address}`;
      apiURL += `&days=${this.state.days}`;
      data = await LLib.fetchJSON(apiURL);
    } catch (e) {}

    // fill data
    this.processData(data);
  }

  formatLPTokenDataPoint(_val, _dataPoint) {
    if (!_dataPoint) {
      return '';
    }

    if (this.state.relative && !this.state.onlyCurrent) {
      return (
        _val * (_dataPoint.seriesIndex === 0 ? this.token0Max : this.token1Max)
      );
    }
    return _val;
  }

  initChart() {
    // init
    const colors = ['#1969ff', '#fea430'];
    const rangeStart = new Date();
    rangeStart.setDate(rangeStart.getDate() - this.state.days);

    // set options
    const opts = this.makeOptions();
    this.setType(opts, this.state.onlyCurrent ? 'pie' : 'line');
    this.setColors(opts, colors);
    opts.chart = {
      ...opts.chart,
      sparkline: {
        enabled: !this.onlyCurrent,
      },
      zoom: {
        type: 'x',
      },
    };
    opts.xaxis = {
      ...opts.xaxis,
      type: 'datetime',
      // min: rangeStart.getTime(),
      labels: {
        ...opts.xaxis.labels,
        show: true,
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
      show: false,
      labels: {
        formatter: this.formatLPTokenDataPoint,
      },
    };
    opts.tooltip = {
      ...opts.tooltip,
      x: {
        ...opts.tooltip.x,
        show: true,
        formatter(value) {
          return LLib.formatDate(value, true, true);
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
    if (this.state.onlyCurrent) {
      opts.chartOptions = {
        ...opts.chartOptions,
        labels: [this.token0.symbol, this.token1.symbol],
      };
    }
    return opts;
  }

  async processData(_priceInfos) {
    if (_priceInfos === undefined || this.vaultinator3000.web3_data === null) {
      return;
    }

    this.token0Max = null;
    this.token1Max = null;

    let series = [];
    let categories = [];
    const data = [];
    const data2 = [];

    if (this.state.onlyCurrent) {
      // make series
      const totalSupply = this.vaultinator3000.toBN(
        `0x${this.state.token.totalSupply}`
      );
      const token0Res = this.vaultinator3000.toBN(
        `0x${this.state.token.token0Reserve}`
      );
      const token0ResOne = token0Res.mul(this.token0.one).div(totalSupply);
      const token0ResF = parseFloat(
        LWeb3.smartFormatTokens(token0ResOne, this.token0)
      );
      const token1Res = this.vaultinator3000.toBN(
        `0x${this.state.token.token1Reserve}`
      );
      const token1ResOne = token1Res.mul(this.token1.one).div(totalSupply);
      const token1ResF = parseFloat(
        LWeb3.smartFormatTokens(token1ResOne, this.token1)
      );
      data.push(token0ResF, token1ResF);
    } else {
      for (let n = 0; n < _priceInfos.data.length; n += 1) {
        const priceInfos = _priceInfos.data[n];
        const dt = LLib.getDateTimeFromDB(priceInfos.date);
        const dtVal = dt.getTime();

        // make series
        const totalSupply = this.vaultinator3000.toBN(
          `0x${priceInfos.totalSupply}`
        );
        const token0Res = this.vaultinator3000.toBN(
          `0x${priceInfos.token0Reserve}`
        );
        const token0ResOne = token0Res.mul(this.token0.one).div(totalSupply);
        const token0ResF = parseFloat(
          LWeb3.smartFormatTokens(token0ResOne, this.token0)
        );
        const token1Res = this.vaultinator3000.toBN(
          `0x${priceInfos.token1Reserve}`
        );
        const token1ResOne = token1Res.mul(this.token1.one).div(totalSupply);
        const token1ResF = parseFloat(
          LWeb3.smartFormatTokens(token1ResOne, this.token1)
        );

        // max
        if (this.token0Max === null || this.token0Max < token0ResF) {
          this.token0Max = token0ResF;
        }
        if (this.token1Max === null || this.token1Max < token1ResF) {
          this.token1Max = token1ResF;
        }

        // values
        data.push([dtVal, token0ResF]);
        data2.push([dtVal, token1ResF]);
      }
    }

    // scale series
    if (this.state.relative && !this.state.onlyCurrent) {
      for (let n = 0; n < data.length; n += 1) {
        if (this.token0Max !== 0) {
          data[n][1] /= this.token0Max;
        }
        if (this.token1Max !== 0) {
          data2[n][1] /= this.token1Max;
        }
      }
    }

    // add series
    series.push({
      name: this.token0.symbol,
      data,
    });
    if (this.state.onlyCurrent) {
      series = data;
    } else {
      series.push({
        name: this.token0.symbol,
        data,
      });
      series.push({
        name: this.token1.symbol,
        data: data2,
      });

      categories = data.map((item) => item[0]);
    }
    const opts = this.initChart(_priceInfos);
    this.setSeries(opts, series, categories);
  }
}

export default ChartLPBreakdown;
