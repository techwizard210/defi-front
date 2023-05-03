import { useState, useEffect, Suspense } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import clsx from 'clsx';
import _ from 'lodash';
import moment from 'moment';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Spinner from '../../components/Spinner';

// ** Import Assets
import useStyles from '../../assets/styles';
import avatar from '../../assets/img/Logos/avatar-img-1.png';
import gold from '../../assets/img/Cup/goldcup.png';
import silver from '../../assets/img/Cup/silvercup.png';
import bronze from '../../assets/img/Cup/bronzecup.png';

import { ddhhmmss, shortenHex } from '../../helpers';

const ChampionList = (props) => {
  // ** Define Maintainers
  const { rewards, users, activities, logs, filterID, subClass } = props;
  const classes = useStyles.ranking();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    const detectFilterKey = (key) => {
      const rewardsFilters = {
        'Total Rewards': 'rewardedAmount',
      };
      const activitiesFilters = {
        'Play Time': 'playedTime',
        'Plays per day': 'playedPerDays',
      };
      const logsFilters = {
        'Daily Logins': 'dailyLogins',
        'Challenges Won': 'challenges',
      };
      const usersFilters = {
        Achievements: 'achievements',
        'Amount Staked': 'stakedAmount',
      };

      if (_.has(rewardsFilters, key)) {
        return { filterType: 'rewards', value: rewardsFilters[key] };
      }
      if (_.has(usersFilters, key)) {
        return { filterType: 'users', value: usersFilters[key] };
      }
      if (_.has(activitiesFilters, key)) {
        return { filterType: 'activities', value: activitiesFilters[key] };
      }
      if (_.has(logsFilters, key)) {
        return { filterType: 'logs', value: logsFilters[key] };
      }
      return null;
    };

    const orderData = (data, usersData, key) => {
      const decData = _.uniqBy(data, 'originAddress');
      let calcData = [];
      calcData = decData.map((deData) => {
        const temp = {};
        const selfUsers = _.filter(
          [...usersData],
          (userData) => userData.address === deData.originAddress
        );
        if (
          selfUsers.length > 0 &&
          selfUsers[0].avatar &&
          selfUsers[0].avatar.slice(0, 23) === 'https://firebasestorage'
        ) {
          temp.avatar = selfUsers[0].avatar;
        } else {
          temp.avatar = null;
        }
        temp.userAddress = `Player(${shortenHex(deData.originAddress, 3)})`;
        if (selfUsers.length > 0 && selfUsers[0].name) {
          temp.userAddress = selfUsers[0].name;
        }
        let amount = 0;
        let maxDate = 0;
        _.filter(data, { originAddress: deData.originAddress }).map((item) => {
          if (Number(item[key])) amount += Number(item[key]);
          if (filterID === 'Reputation' && item.date >= maxDate)
            maxDate = item.date;
          return false;
        });
        temp.amount = Number(amount) ? Number(amount).toFixed(2) : 0;
        if (filterID === 'Reputation') temp.date = maxDate;
        if (amount > 0) return temp;
        return null;
      });
      return _.orderBy(
        _.without(calcData, null),
        [(item) => Number(item.amount)],
        ['desc']
      );
    };

    async function init() {
      if (filterData.length < 1) {
        if (filterID === 'Reputation') {
          if (rewards.length > 0) {
            const resRewards = orderData(rewards, users, 'rewardedAmount');
            if (resRewards.length > 0) setFilterData(resRewards);
          }
        } else {
          const { filterType, value } = detectFilterKey(filterID);
          switch (filterType) {
            case 'rewards': {
              if (rewards.length > 0) {
                const resRewards = orderData(rewards, users, value);
                if (resRewards.length > 0) setFilterData(resRewards);
              }
              break;
            }
            case 'users': {
              const resUsersData = _.orderBy(
                _.uniqBy(users, 'address'),
                [(item) => Number(item[value])],
                ['desc']
              ).map((item) => {
                const temp = {};
                if (
                  item.avatar &&
                  item.avatar.slice(0, 23) === 'https://firebasestorage'
                ) {
                  temp.avatar = item.avatar;
                } else {
                  temp.avatar = null;
                }
                temp.userAddress = `Player(${shortenHex(item.address, 3)})`;
                if (item.name) {
                  temp.userAddress = item.name;
                }
                temp.amount = Number(item[value])
                  ? Number(item[value]).toFixed(2)
                  : 0;
                if (temp.amount > 0) return temp;
                return null;
              });
              const data = _.without(resUsersData, null);
              if (data.length > 0) setFilterData(data);
              break;
            }
            case 'activities': {
              if (activities.length > 0) {
                const resActivitiesData = _(activities)
                  .groupBy((item) => item.userAddress)
                  .values()
                  .map((item) => {
                    let amount = 0;
                    if (value === 'playedPerDays') {
                      if (item.length > 0) {
                        amount =
                          item.length / _.uniqBy(item, 'shortDate').length;
                        amount = Math.round(amount);
                      }
                    } else {
                      item.map((e) => {
                        if (!Number.isNaN(Number(e[value]))) {
                          amount += Number(e[value]);
                        }
                        return false;
                      });
                    }
                    const temp = {};
                    const selfUsers = _.filter(users, (data) => {
                      return data.address === item[0].userAddress;
                    });
                    if (
                      selfUsers.length > 0 &&
                      selfUsers[0].avatar &&
                      selfUsers[0].avatar.slice(0, 23) ===
                        'https://firebasestorage'
                    ) {
                      temp.avatar = selfUsers[0].avatar;
                    } else {
                      temp.avatar = null;
                    }
                    temp.userAddress = `Player(${shortenHex(
                      item[0].userAddress,
                      3
                    )})`;
                    if (selfUsers.length > 0 && selfUsers[0].name) {
                      temp.userAddress = selfUsers[0].name;
                    }
                    temp.amount = amount;
                    if (amount > 0) return temp;
                    return null;
                  })
                  .value();
                const data = _.without(resActivitiesData, null);
                if (data.length > 0) {
                  const tempData = _.orderBy(
                    data,
                    [(item) => Number(item.amount)],
                    ['desc']
                  );
                  setFilterData(
                    tempData.map((item) => {
                      const temp = { ...item };
                      if (value === 'playedTime') {
                        temp.amount = ddhhmmss(temp.amount);
                      }
                      return temp;
                    })
                  );
                }
              }
              break;
            }
            case 'logs': {
              const resLogsData = _.uniqBy(users, 'address').map((userData) => {
                const temp = {};
                if (
                  userData.avatar &&
                  userData.avatar.slice(0, 23) === 'https://firebasestorage'
                ) {
                  temp.avatar = userData.avatar;
                } else {
                  temp.avatar = null;
                }
                temp.userAddress = userData.name
                  ? userData.name
                  : `Player(${shortenHex(userData.address, 3)})`;
                const logsDat = _.filter(
                  logs,
                  (logData) => logData.address === userData.address
                );
                if (logsDat.length > 0) {
                  if (value === 'dailyLogins') {
                    temp.amount =
                      logsDat.length / _.uniqBy(logsDat, 'shortDate').length;
                    temp.amount = Math.round(temp.amount);
                  } else if (value === 'challenges') {
                    temp.amount = _.uniqBy(logsDat, 'shortDate').length;
                  }
                } else {
                  temp.amount = 0;
                }
                if (temp.amount > 0) return temp;
                return null;
              });
              const data = _.without(resLogsData, null);
              if (data.length > 0) {
                setFilterData(
                  _.orderBy(data, [(item) => Number(item.amount)], ['desc'])
                );
              }
              break;
            }
            default:
              break;
          }
        }
      }
    }
    init();
  }, [rewards, users, activities, logs, filterID, filterData]);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Grid container justifyContent="center">
      <Grid item className={clsx(classes[subClass], classes.marginBottom5)}>
        {filterID}
      </Grid>
      <Grid item lg={11} md={11} sm={12} xs={12}>
        <List dense className={classes.rankList}>
          {filterData.length < 1 && <Suspense fallback={<Spinner />} />}
          {filterData.length > 0 &&
            filterData.map((data, index) => {
              return (
                <List
                  key={uuid_v4()}
                  component="nav"
                  aria-label="main mailbox folders"
                >
                  <ListItem
                    button
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(event, index)}
                  >
                    {index === 0 && (
                      <ListItemIcon className={classes.ListCupItem}>
                        <img src={gold} alt="gold" />
                      </ListItemIcon>
                    )}
                    {index === 1 && (
                      <ListItemIcon className={classes.ListCupItem}>
                        <img src={silver} alt="silver" />
                      </ListItemIcon>
                    )}
                    {index === 2 && (
                      <ListItemIcon className={classes.ListCupItem}>
                        <img src={bronze} alt="bronze" />
                      </ListItemIcon>
                    )}
                    {index > 2 && (
                      <ListItemText
                        primary={index + 1}
                        className={classes.ListRankItem}
                      />
                    )}
                    {_.keys(data).map((item) => {
                      if (item === 'avatar') {
                        return (
                          <ListItemIcon
                            key={uuid_v4()}
                            className={classes.ListAvatarItem}
                          >
                            {data.avatar ? (
                              <img
                                src={`${data.avatar}`}
                                alt="avatar"
                                className={classes.avatarWidth}
                              />
                            ) : (
                              <img src={avatar} alt="avatar" />
                            )}
                          </ListItemIcon>
                        );
                      }
                      if (item === 'date') {
                        return (
                          <ListItemText
                            key={uuid_v4()}
                            primary={moment(data.date.second).format(
                              'MMMM DD, YYYY'
                            )}
                            className={classes.ListTimeItem}
                          />
                        );
                      }
                      return (
                        <ListItemText
                          key={uuid_v4()}
                          primary={data[item]}
                          className={classes[item]}
                        />
                      );
                    })}
                  </ListItem>
                </List>
              );
            })}
        </List>
      </Grid>
    </Grid>
  );
};

export default ChampionList;
