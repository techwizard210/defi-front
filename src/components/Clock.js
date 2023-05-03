import { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  icon: {
    color: 'white',
  },
  time: {
    fontFamily: 'Aldrich',
    fontWeight: 'bold',
    color: '#a2a3b7',
    padding: 0,
    width: 50,
    height: 50,
    fontSize: 20,
  },
  separate: {
    padding: 0,
    fontFamily: 'Aldrich',
    fontWeight: 'bold',
    animation: '$dotAnimation 1s infinite',
    color: '#a2a3b7',
    width: 50,
    height: 50,
    fontSize: 20,
  },
  '@keyframes dotAnimation': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
}));

const Clock = () => {
  const classes = useStyles();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      if (now.getHours() !== hours) {
        const newHours = now.getHours();
        if (newHours >= 10) {
          setHours(newHours);
        } else {
          setHours(`0${newHours}`);
        }
      }
      if (now.getMinutes() !== minutes) {
        const newMinutes = now.getMinutes();
        if (newMinutes >= 10) {
          setMinutes(newMinutes);
        } else {
          setMinutes(`0${newMinutes}`);
        }
      }
      if (now.getSeconds() !== seconds) {
        const newSeconds = now.getSeconds();
        if (newSeconds >= 10) {
          setSeconds(newSeconds);
        } else {
          setSeconds(`0${newSeconds}`);
        }
      }
      setTimeout(() => {
        updateTime();
      }, 1000);
    };
    updateTime();
  }, [hours, minutes, seconds]);

  return (
    <>
      <IconButton className={classes.time}>{hours}</IconButton>
      <IconButton className={classes.separate}>:</IconButton>
      <IconButton className={classes.time}>{minutes}</IconButton>
      <IconButton className={classes.separate}>:</IconButton>
      <IconButton className={classes.time}>{seconds}</IconButton>
    </>
  );
};

export default Clock;
