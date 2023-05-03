import { useState, useEffect } from 'react';
import clsx from 'clsx';
import moment from 'moment';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

import { useWeb3React } from '@web3-react/core';

import { toast } from 'react-toastify';

import {
  getGameFactoryContractInstance,
  displayFormatTime,
  _isValidChainId,
  getThawingPeriod,
  getUserReward,
  getUserThawing,
  getGameStatisticData,
} from '../../helpers';

import { db } from '../../firebase';
import useStyles from '../../assets/styles';

const Mining = (props) => {
  const classes = useStyles.mining();

  const [availableRewardStatus, setAvailableRewardStatus] = useState(false);
  const [userReward, setUserReward] = useState([]);
  const [userThawing, setUserThawing] = useState([]);
  const [thawingPeriod, setThawingPeriod] = useState(null);
  const [displayTimer, setTimerDisplay] = useState('Unavailable');

  const { state } = props;

  const { account, chainId } = useWeb3React();

  const [statisticData, setStatisticData] = useState({
    totalApproved: 0,
    totalRewarded: 0,
    totalFrozen: 0,
    totalWithdrawn: 0,
  });

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

      // Output the result in an element with id="demo"
      setTimerDisplay(`${days}d : ${hours}h : ${minutes}m : ${seconds}s `);

      // If the count down is over, write some text
      if (distance < 0) {
        clearInterval(x);
        localStorage.setItem(`${state.userAddress}_thawingStatus`, false);
        localStorage.setItem(`${state.userAddress}_thawingEndTime`, 0);
        setAvailableRewardStatus(true);
      }
    }, 1000);
  };

  useEffect(() => {
    async function init() {
      const validChain = await _isValidChainId();
      if (!validChain) {
        toast.error('Unsupported network');
      } else {
        const thawingLockingPeriod = await getThawingPeriod();
        setThawingPeriod(thawingLockingPeriod);

        const userRewards = await getUserReward();
        setUserReward(userRewards);

        const userThawings = await getUserThawing();
        setUserThawing(userThawings);

        const gameStatisticData = await getGameStatisticData();
        setStatisticData(gameStatisticData);
        if (userThawings.approvedAmount > 0) setAvailableRewardStatus(true);
        const now = new Date().getTime() / 1000;

        if (now < Number(userThawings.endTime)) {
          setAvailableRewardStatus(false);
          countDownTimer(Number(userThawings.endTime) * 1000);
        } else {
          localStorage.setItem(`${state.userAddress}_thawingStatus`, false);
          localStorage.setItem(`${state.userAddress}_thawingEndTime`, 0);
        }
      }
    }
    if (account) {
      init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const withdraw = async () => {
    if (userThawing.startTime === '0') {
      toast.error(`Not Available reward`);
      return;
    }

    if (!account || !chainId || !(await _isValidChainId())) {
      toast.error(`Unsupported network. Please Change Network`);
      return;
    }
    try {
      const factoryContract = getGameFactoryContractInstance();
      await factoryContract.methods
        .claimReward()
        .send({ from: state.userAddress });

      const res = await db
        .collection('users')
        .where('address', '==', state.userAddress)
        .get();
      const userID = res.docs.map((doc) => doc.id);
      const userData = res.docs.map((doc) => doc.data());
      const currentAchievements = Number(userData[0].achievements)
        ? Number(userData[0].achievements)
        : 0;
      await db
        .collection('users')
        .doc(userID[0])
        .update({
          achievements:
            currentAchievements + Number(userThawing.approvedAmount),
        });

      toast.success(`Reward withdrawn successfully`);

      window.location.reload();
    } catch (err) {
      toast.error(
        err.message
          ? err.message
          : `Transaction Failed. The amount is still locked`
      );

      // console.log(err);
    }
  };

  const compound = async () => {
    if (userThawing.startTime === '0') {
      toast.error(`Compound unavailable`);
      return;
    }
    if (!account || !chainId || !(await _isValidChainId())) {
      toast.error(`Unsupported network. Please Change Network`);
      return;
    }
    try {
      const factoryContract = getGameFactoryContractInstance();
      await factoryContract.methods.freeze().send({ from: state.userAddress });

      const res = await db
        .collection('users')
        .where('address', '==', state.userAddress)
        .get();

      const userID = res.docs.map((doc) => doc.id);
      const userData = res.docs.map((doc) => doc.data());
      const currentStakedAmount = Number(userData[0].stakedAmount)
        ? Number(userData[0].stakedAmount)
        : 0;

      await db
        .collection('users')
        .doc(userID[0])
        .update({
          stakedAmount:
            currentStakedAmount + Number(userThawing.approvedAmount),
        });

      const currentAchievements = Number(userData[0].achievements)
        ? Number(userData[0].achievements)
        : 0;
      await db
        .collection('users')
        .doc(userID[0])
        .update({
          achievements:
            currentAchievements + Number(userThawing.approvedAmount),
        });

      const data = {
        address: state.userAddress,
        amount: Number(userThawing.approvedAmount),
        datetime: moment()
          .zone(-6)
          .format('MMMM DD, YYYY [at] hh:mm:ss A [UTC-6]'),
        level: 2,
        transactionHash: '',
        type: 'in',
      };
      await db.collection('stakeHistory').add(data);

      toast.success(`Earnings compounded successfully`);
      window.location.reload();
    } catch (err) {
      toast.error(
        err.message
          ? err.message
          : `Transaction Failed. The amount is still locked`
      );
    }
  };

  const unfreeze = async () => {
    if (!account || !chainId || !(await _isValidChainId())) {
      toast.error(`Unsupported network. Please Change Network`);
      return;
    }
    try {
      const factoryContract = getGameFactoryContractInstance();
      await factoryContract.methods
        .unfreeze()
        .send({ from: state.userAddress });
      localStorage.setItem(`${state.userAddress}_thawingStatus`, true);
      toast.error('Reward unfreezed successfully.');

      window.location.reload();
    } catch (err) {
      toast.error(
        err.message
          ? err.message
          : `Transaction Failed. The amount is still locked`
      );
    }
  };

  return (
    <>
      <Grid className="mining">MINING</Grid>
      <Grid container spacing={1} className={classes.mingingrewards}>
        <Grid item>
          <Typography className={classes.TextCenter}>
            Available HIFI Rewards
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            className={clsx(
              classes.TextCenter,
              classes.TextColor,
              classes.itemtitle
            )}
          >
            {userThawing.approvedAmount} HIFI
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.TextCenter}>
            <Box component="span" className={classes.TextColorGrey}>
              {'You will receive '}
            </Box>
            <Box component="span" className={classes.TextColor}>
              {userReward.approvedAmount}
            </Box>
            <Box component="span" className={classes.TextColorGrey}>
              {' HIFI'}
            </Box>
          </Typography>
        </Grid>
        <Grid className="rewards">REWARDS</Grid>
        <Grid item container className={classes.middleTextGroup}>
          <Typography
            className={clsx(classes.TextCenter, classes.TextColorGrey)}
          >
            {`Mined: ${statisticData.totalApproved} / 300, 000, 000`}
          </Typography>
        </Grid>
        <Grid item className={classes.ColorStyle}>
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={Number(statisticData.totalApproved)}
          />
        </Grid>
        <Grid item>
          <Typography className={classes.TextCenter}>
            {'A total of '}
            <Box component="span" className={classes.TextColor}>
              {`${statisticData.totalFrozen}  HIFI `}
            </Box>
            {' is frozen across the network'}
          </Typography>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className={classes.tokenstatus}>
              <Typography
                paragraph
                className={clsx(classes.fixedHeight, classes.TextColorGrey)}
              >
                Reward
              </Typography>
              <Typography paragraph>
                {userReward.approvedAmount}{' '}
                <Box component="span" className={classes.TextColor}>
                  HiFi
                </Box>
              </Typography>
              {userReward.approvedAmount > 0 ? (
                <Button
                  variant="contained"
                  className={classes.miningBtns}
                  onClick={unfreeze}
                  disabled={!account}
                >
                  Unfreeze
                </Button>
              ) : (
                <Button
                  variant="contained"
                  className={classes.miningBtns}
                  disabled={!account}
                >
                  Unavailable
                </Button>
              )}
            </Paper>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Paper className={classes.tokenstatus}>
              <Typography
                paragraph
                className={clsx(classes.fixedHeight, classes.TextColorGrey)}
              >
                {availableRewardStatus ? 'Available' : 'Thawing'}
              </Typography>
              <Typography paragraph>
                {userThawing.approvedAmount}{' '}
                <Box component="span" className={classes.TextColor}>
                  HiFi
                </Box>
              </Typography>
              {availableRewardStatus ? (
                <>
                  <Button
                    variant="contained"
                    className={`${classes.miningBtns} ${classes.compoundButton}`}
                    onClick={compound}
                    disabled={!account}
                  >
                    Compound
                  </Button>
                  <Button
                    variant="contained"
                    className={classes.miningBtns}
                    onClick={withdraw}
                    disabled={!account}
                  >
                    Withdraw
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  className={classes.miningBtns}
                  disabled={!account}
                >
                  {displayTimer}
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
        <Grid item>
          <Box className={classes.TextCenter}>
            {'HIFI will be frozen for '}
            <Box component="span" className={classes.TextColor}>
              {displayFormatTime(thawingPeriod)}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Mining;
