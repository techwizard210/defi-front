import { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import _ from 'lodash';

// ** Import Material-Ui Components
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import { db } from '../../firebase';
import useStyles from '../../assets/styles';
import { shortenHex } from '../../helpers';

import ChampionList from './ChampionList';

const filters = ['Play Time', 'Plays per day', 'Amount Staked'];
const logFilters = ['Daily Logins', 'Challenges Won'];

const Ranking = () => {
  // ** Define Maintainers
  const _isMounted = useRef(true); // Initial value _isMounted = true
  const classes = useStyles.ranking();
  const [rewards, setRewards] = useState([]);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [logs, setLogs] = useState([]);

  const fetchRewards = async () => {
    const response = await db.collection('rewards').get();
    const rewardsData = _.orderBy(
      response.docs.map((doc) => doc.data()),
      [(item) => parseInt(item.rewardedAmount, 10)],
      ['desc']
    );
    const temp = rewardsData.map((e) => ({
      ...e,
      originAddress: e.userAddress,
      userAddress: shortenHex(e.userAddress, 5),
    }));

    if (_isMounted.current) {
      setTimeout(() => {
        setRewards(temp);
      }, 500);
    }
  };

  const fetchUsers = async () => {
    const response = await db.collection('users').get();
    const usersData = response.docs.map((doc) => doc.data());

    if (_isMounted.current) {
      setTimeout(() => {
        setUsers(usersData);
      }, 500);
    }
  };

  const fetchActivities = async () => {
    const response = await db.collection('activities').get();
    const activitiesData = response.docs.map((doc) => doc.data());
    const shortActivitiesData = activitiesData.map((e) => {
      const temp = { ...e };
      temp.shortDate = e.date.slice(0, 10);
      return temp;
    });

    if (_isMounted.current) {
      setTimeout(() => {
        setActivities(shortActivitiesData);
      }, 500);
    }
  };

  const fetchLogs = async () => {
    const resLogs = await db.collection('logs').get();
    const logsData = resLogs.docs.map((doc) => ({
      ...doc.data(),
      shortDate: doc.data().date.slice(0, 10),
    }));

    if (_isMounted.current) {
      setTimeout(() => {
        setLogs(logsData);
      }, 500);
    }
  };

  useEffect(() => {
    fetchRewards();
    fetchUsers();
    fetchActivities();
    fetchLogs();
    return () => {
      _isMounted.current = false;
    };
  }, []);

  return (
    <Grid container className={classes.ComWholeRaning}>
      <Box
        component={Grid}
        container
        alignItems="center"
        className={classes.marginBottom15}
      >
        <Box
          component={Grid}
          item
          md={12}
          sm={12}
          className={classes.highScore}
          display={{ sm: 'block', md: 'block', lg: 'none', xl: 'none' }}
        >
          High Score
        </Box>
        <Box
          component={Grid}
          item
          lg={2}
          className={clsx(classes.highScore, classes.flexend)}
          display={{ xs: 'none !important', lg: 'flex !important' }}
        >
          High
        </Box>
        <Grid item lg={8} md={12} sm={12} xs={12}>
          {users.length > 0 && (
            <ChampionList
              filterID="Reputation"
              rewards={rewards}
              users={users}
              subClass="reputation"
            />
          )}
        </Grid>
        <Box
          component={Grid}
          item
          lg={2}
          className={classes.highScore}
          display={{ xs: 'none !important', lg: 'block !important' }}
        >
          Score
        </Box>
      </Box>
      <Grid container justifyContent="center">
        {users.length > 0 && (
          <Grid
            item
            xl={4}
            lg={6}
            md={12}
            sm={12}
            xs={12}
            className={classes.marginBottom10}
          >
            <ChampionList
              filterID="Total Rewards"
              rewards={rewards}
              users={users}
              subClass="childFilter"
            />
          </Grid>
        )}
        {users.length > 0 &&
          filters.map((item) => (
            <Grid
              key={item}
              item
              xl={4}
              lg={6}
              md={12}
              sm={12}
              xs={12}
              className={classes.marginBottom10}
            >
              <ChampionList
                filterID={item}
                users={users}
                activities={activities}
                subClass="childFilter"
              />
            </Grid>
          ))}
        {users.length > 0 &&
          logs.length > 0 &&
          logFilters.map((item) => (
            <Grid
              key={item}
              item
              xl={4}
              lg={6}
              md={12}
              sm={12}
              xs={12}
              className={classes.marginBottom10}
            >
              <ChampionList
                filterID={item}
                users={users}
                logs={logs}
                subClass="childFilter"
              />
            </Grid>
          ))}
        {users.length > 0 && (
          <Grid
            item
            xl={4}
            lg={6}
            md={12}
            sm={12}
            xs={12}
            className={classes.marginBottom10}
          >
            <ChampionList
              filterID="Achievements"
              users={users}
              subClass="childFilter"
            />
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default Ranking;
