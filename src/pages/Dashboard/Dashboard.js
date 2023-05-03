import React from 'react';
import Typography from '@material-ui/core/Typography';

import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalBarSeries,
  Hint,
} from 'react-vis';

const challenges = [];
const plays = [];
const rep = [];
const userLevel = [];

function getRandomData() {
  return Math.round((Math.random() * 1.25 + Number.EPSILON) * 100) / 100;
}

// eslint-disable-next-line no-plusplus
for (let index = 0; index < 30; index++) {
  const day = index + 1;
  challenges.push({ x: `${day}/10/21`, y: getRandomData() });
  plays.push({ x: `${day}/10/21`, y: getRandomData() });
  rep.push({ x: `${day}/10/21`, y: getRandomData() });
  userLevel.push({ x: `${day}/10/21`, y: getRandomData() });
}

export default class DailyRewards extends React.Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    challengesData: challenges,
    playsData: plays,
    repData: rep,
    userLevelData: userLevel,
    value: false,
    popupDate: null,
    challengeValue: null,
    playValue: null,
    repValue: null,
    userLevelValue: null,
  };

  render() {
    const {
      challengesData,
      challengeValue,
      playsData,
      playValue,
      popupDate,
      repData,
      repValue,
      userLevelData,
      userLevelValue,
      value,
    } = this.state;

    const BarSeries = VerticalBarSeries;

    const challengesProps = {
      data: challengesData,
      onNearestXY: (e) =>
        this.setState({ value: e, challengeValue: e, popupDate: e.x }),
    };

    const playsProps = {
      data: playsData,
      onNearestXY: (e) => this.setState({ playValue: e }),
    };

    const repProps = {
      data: repData,
      onNearestXY: (e) => this.setState({ repValue: e }),
    };

    const userLevelProps = {
      data: userLevelData,
      onNearestXY: (e) => this.setState({ userLevelValue: e }),
    };

    return (
      <div className="headlineFigures">
        <Typography gutterBottom variant="h4" align="left">
          Earnings Breakdown (Last 30 days)
        </Typography>

        <hr className="headlineRule" align="left" />

        <XYPlot
          width={1150}
          height={350}
          stackBy="y"
          xType="ordinal"
          margin={{ bottom: 70 }}
          onMouseLeave={() => this.setState({ value: false })}
        >
          <HorizontalGridLines />
          <XAxis tickLabelAngle={290} />
          <YAxis />
          <BarSeries {...challengesProps} />
          <BarSeries {...playsProps} />
          <BarSeries {...repProps} />
          <BarSeries {...userLevelProps} />
          {value && (
            <Hint value={value}>
              <div className="barChartPopup">
                <div className="barChartPopUpHeading">
                  {popupDate} - Earnings{' '}
                  {`+${(
                    challengeValue.y +
                    playValue.y +
                    repValue.y +
                    userLevelValue.y
                  ).toFixed(2)}`}
                </div>
                <div className="barCharLabelCol">
                  <div> Challenges:</div>
                  <div> Play per Day:</div>
                  <div> Reputation:</div>
                  <div> User Level:</div>
                </div>
                <div className="barCharValueCol">
                  <div>{+challengeValue.y.toFixed(2)}</div>
                  <div>{+playValue.y.toFixed(2)}</div>
                  <div>{+repValue.y.toFixed(2)}</div>
                  <div>{+userLevelValue.y.toFixed(2)}</div>
                </div>
              </div>
            </Hint>
          )}
        </XYPlot>
      </div>
    );
  }
}
