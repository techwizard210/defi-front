import { useState, useEffect } from 'react';

const CountdownTimer = (props) => {
  const { expiryDateProp, callBackFunc } = props;
  const [countdownTimer, setCountdownTimer] = useState('Loading..');

  useEffect(() => {
    const countDownTimer = (countDownDate) => {
      // Update the count down every 1 second
      const x = setInterval(async () => {
        // Get today's date and time
        const now = new Date().getTime();

        // Find the distance between now and the count down date
        const distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));

        let hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        if (hours < 10) hours = `0${hours}`;

        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        if (minutes < 10) minutes = `0${minutes}`;

        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (seconds < 10) seconds = `0${seconds}`;

        setCountdownTimer(`${days}d : ${hours}h : ${minutes}m : ${seconds}s `);

        // If the count down is over, write some text
        if (distance < 0) {
          clearInterval(x);
          if (callBackFunc) {
            callBackFunc([false, false, false]);
          }
        }
      }, 1000);
    };
    countDownTimer(expiryDateProp);
  }, [expiryDateProp, callBackFunc]);

  return <>{countdownTimer}</>;
};

export default CountdownTimer;
