import React from 'react';
import Chart from 'react-apexcharts';

// libs
import { LLib } from '../Libs/LLib';

function getDays(value) {
  const today = new Date();
  const date_to_reply = new Date(value);
  const timeinmilisec = date_to_reply.getTime() - today.getTime();
  const days = Math.ceil(timeinmilisec / (1000 * 60 * 60 * 24));

  return days;
}

function formattedDayText(value) {
  const days = getDays(value);
  return `${days} Day${days > 1 ? 's' : ''}`;
}

class ChartForecast extends React.Component {
  constructor(props) {
    super(props);

    const generateDayWiseTimeSeries = (baseval, count, yrange) => {
      let i = 0;
      const series = [];
      while (i < count) {
        const y =
          Math.floor(Math.random() * (yrange.max - yrange.min + 1)) +
          yrange.min;

        series.push([baseval, y]);
        // eslint-disable-next-line no-param-reassign
        baseval += 86400000;
        i += 1;
      }
      return series;
    };

    const { showUSD } = props;
    // const tokenPrice = props.tokenPrice;

    // init state
    this.state = {
      series: props.series ?? [
        {
          name: 'Compounding',
          data: generateDayWiseTimeSeries(
            new Date('11 Feb 2017 GMT').getTime(),
            20,
            {
              min: 10,
              max: 60,
            }
          ),
        },
        {
          name: 'BUSD',
          data: generateDayWiseTimeSeries(
            new Date('11 Feb 2017 GMT').getTime(),
            20,
            {
              min: 10,
              max: 20,
            }
          ),
        },
      ],
      options: {
        chart: {
          type: 'area',
          height: 150,
          stacked: true,
          background: 'transparent',
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
          events: {
            selection: () => {}, // console.log(new Date(e.xaxis.min)),
          },
        },
        colors: ['#fea430', '#6236ff', '#1969ff', '#00aee9', '#00c301'],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 3,
          curve: 'smooth',
        },
        title: {
          text: '',
          align: 'left',
        },
        theme: {
          mode: 'dark',
        },
        tooltip: {
          enabled: true,
          theme: 'dark',
          marker: {
            show: true,
          },
          x: {
            formatter(value) {
              return formattedDayText(value);
              // return LLib.formatDate(value, true, true);
            },
          },
          y: {
            formatter(value) {
              if (showUSD) {
                return LLib.formatFiat(value, true, { shorten: true });
              }

              return LLib.smartFormatFloatDisplay(value, true);
            },
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
          },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
        },
        xaxis: {
          type: 'datetime',
          tooltip: { enabled: false },
          overwriteCategories: [0, 90, 180, 270, 365],
          labels: {
            formatter(value) {
              const label = new Date().getTime() + value * 24 * 60 * 60 * 1000;
              return getDays(label);
            },
          },
        },
        yaxis: {
          labels: {
            formatter(value) {
              if (showUSD) {
                return LLib.formatFiat(value, true, { shorten: true });
              }

              return LLib.smartFormatFloatDisplay(value, true);
            },
          },
        },
      },
    };
  }

  static getDerivedStateFromProps(props, state) {
    // eslint-disable-next-line no-param-reassign
    state.series = props.series;
    return state;
  }

  render() {
    const { options, series } = this.state;
    return <Chart options={options} series={series} type="area" height={200} />;
  }
}

export default ChartForecast;
