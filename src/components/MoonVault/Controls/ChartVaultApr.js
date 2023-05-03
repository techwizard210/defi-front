// libs
import { LLib } from '../Libs/LLib';

// components
import Chart from './Chart';

class ChartVaultApr extends Chart {
  constructor(props) {
    super(props);

    // init state
    this.state = {
      ...this.state,
      vaultID: props.vaultID,
      days: props.days || 180,
    };
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
    const vault = this.props.vaultinator3000.findVault(this.state.vaultID);

    // compounds
    const compounds = await vault.db_getHistoricCompounds({
      days: this.state.days,
    });

    // fill data
    this.processData(compounds);
  }

  initChart() {
    // init
    const colors = this.makeColorList();
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
    opts.xaxis = {
      ...opts.xaxis,
      type: 'datetime',
      // min: rangeStart.getTime(),
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
      labels: {
        formatter: (_val) => {
          return LLib.smartFormatPercent(_val, true, 4, 4);
        },
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
    opts.legend = {
      ...opts.legend,
      show: true,
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

  async processData(_compounds) {
    if (_compounds === undefined) {
      return;
    }

    const series = [];
    let categories = [];
    const data = [];
    const cats = [];
    for (let n = 0; n < _compounds.data.length; n += 1) {
      const comp = _compounds.data[n];
      const dt = LLib.getDateTimeFromDB(comp.dateTime);
      const dtVal = dt.getTime();
      cats.push(dtVal);

      const val = parseFloat(comp.dailyAPR).toFixed(4);
      data.push([dtVal, val]);
    }
    series.push({
      name: 'Daily ROI',
      data,
    });
    categories = cats;

    const opts = this.initChart(_compounds);
    this.setSeries(opts, series, categories);
  }
}

export default ChartVaultApr;
