import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';

import useInterval from './UseInterval.ts';

import useStyles from '../assets/styles';

const Stopwatch = () => {
  const classes = useStyles.playGame();

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [delay, setDelay] = useState(null);

  const getMilliseconds = () => {
    return `0${secondsElapsed * 100}`.slice(-2);
  };

  const getSeconds = () => {
    return `0${parseInt(secondsElapsed % 60, 10)}`.slice(-2);
  };

  const getMinutes = () => {
    return `0${Math.floor(secondsElapsed / 60)}`.slice(-2);
  };

  const startTimer = () => {
    setDelay(10);
  };

  const resetTimer = () => {
    setSecondsElapsed(0);
    setDelay(null);
  };

  // const stopTimer = () => {
  //     setDelay(null)
  // }

  useInterval(() => {
    setSecondsElapsed(secondsElapsed + 0.01);
  }, delay);

  useEffect(() => {
    resetTimer();
    startTimer();
  }, []);

  return (
    <Box className={clsx(classes.headearTimer, 'customTitle')}>
      {getMinutes()}:{getSeconds()}:{getMilliseconds()}
    </Box>
  );
};

export default Stopwatch;
