import { useState, useEffect, Suspense, useCallback } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import clsx from 'clsx';
import { useWeb3React } from '@web3-react/core';
import _ from 'lodash';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import { BrowserView, MobileView } from 'react-device-detect';

import Spinner from '../../components/Spinner';

import { walletAuthFetchWithSigPrompt } from '../../helpers/apiFetchWrappers';
import { getCookie } from '../../helpers/index';

// ** Import Assets
import useStyles from '../../assets/styles';
import gold from '../../assets/img/Cup/goldcup.png';
import silver from '../../assets/img/Cup/silvercup.png';
import bronze from '../../assets/img/Cup/bronzecup.png';
import avatar from '../../assets/img/Profile2.jpg';
import Podium from '../../assets/img/hifiPodium.png';

const getElapsedTime = (timeInSeconds) => {
  if (!timeInSeconds) return '';
  let manipulatedTime = timeInSeconds;
  // Extract integer seconds that dont form a minute using %
  const seconds = Math.floor(manipulatedTime % 60); // ignoring uncomplete seconds (floor)
  // Pad seconds with a zero if neccessary
  const secondsAsString = seconds < 10 ? `0${seconds}` : `${seconds}`;
  // Convert time difference from seconds to minutes using %
  manipulatedTime = Math.floor(manipulatedTime / 60);
  // Extract integer minutes that don't form an hour using %
  const minutes = manipulatedTime % 60; // no need to floor possible incomplete minutes, becase they've been handled as seconds
  // Pad minutes with a zero if neccessary
  const minutesAsString = minutes < 10 ? `0${minutes}` : `${minutes}`;
  // Convert time difference from minutes to hours
  manipulatedTime = Math.floor(manipulatedTime / 60);
  // Extract integer hours that don't form a day using %
  const hours = manipulatedTime % 24; // no need to floor possible incomplete hours, becase they've been handled as seconds
  // Convert time difference from hours to days
  manipulatedTime = Math.floor(manipulatedTime / 24);
  // The rest of timeDiff is number of days
  const days = manipulatedTime;

  const totalHours = hours + days * 24; // add days to hours
  const totalHoursAsString =
    totalHours < 10 ? `0${totalHours}` : `${totalHours}`;

  return totalHoursAsString === '00'
    ? `${minutesAsString}:${secondsAsString}`
    : `${totalHoursAsString}:${minutesAsString}:${secondsAsString}`;
};

const LeaderBoard = (props) => {
  const { currentGame, wipeSignatureAndReRequest } = props;

  const classes = useStyles.ranking();
  const playGameSpecificClasses = useStyles.playGameSpecific();

  const playClasses = useStyles.playGameSpecific();
  const [highScoreData, setHighScoreData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playerStats, setPlayerStats] = useState(null);

  const [bronzePlayer, setBronzePlayer] = useState(null);
  const [silverPlayer, setSilverPlayer] = useState(null);
  const [goldPlayer, setGoldPlayer] = useState(null);

  const { chainId, account } = useWeb3React();

  const setLeaderboardStats = useCallback(
    (leaderboardData) => {
      const highscores = leaderboardData.leaderboard;
      const loggedIn = getCookie(`authHeader-${account}`);
      const playerStatsResponse = {
        HighScore: loggedIn ? leaderboardData.highScore : '',
        CurrentPosition: loggedIn
          ? leaderboardData.currentPosition
          : 'Please sign in to get user stats',
        TotalPlays: loggedIn ? leaderboardData.totalPlays : '',
        TotalPlayTime: loggedIn ? leaderboardData.totalPlayTime : null,
      };
      setPlayerStats(playerStatsResponse);

      const orderedScores = _.orderBy(highscores, ['score'], ['desc']);

      const oneDay = 24 * 60 * 60 * 1000;
      const today = new Date();

      for (let index = 0; index < orderedScores.length; index += 1) {
        orderedScores[index].daysAgo = Math.round(
          Math.abs((today - new Date(orderedScores[index].date)) / oneDay)
        );
      }
      setHighScoreData(orderedScores);

      if (orderedScores.length > 2) {
        const bronzePlayerLocal = {
          name: orderedScores[2].playerName,
          highScore: orderedScores[2].highScore,
          // team: 'ApeSwap',
          // flag: belgiumFlag,
          profile: orderedScores[2].avatar ? orderedScores[2].avatar : null,
        };
        setBronzePlayer(bronzePlayerLocal);
      }

      if (orderedScores.length > 1) {
        const silverPlayerLocal = {
          name: orderedScores[1].playerName,
          highScore: orderedScores[1].highScore,
          // team: 'MoonVault',
          // flag: ukFlag,
          profile: orderedScores[1].avatar ? orderedScores[1].avatar : null,
        };
        setSilverPlayer(silverPlayerLocal);
      }

      if (orderedScores.length > 0) {
        const goldPlayerLocal = {
          name: orderedScores[0].playerName,
          highScore: orderedScores[0].highScore,
          // team: 'HiFivers',
          // flag: ukFlag,
          profile: orderedScores[0].avatar ? orderedScores[0].avatar : null,
        };
        setGoldPlayer(goldPlayerLocal);
      }
    },
    [account]
  );

  useEffect(() => {
    const fetchLeaderboardStats = async () => {
      const response = await walletAuthFetchWithSigPrompt(
        `GameStats/GetLeaderboardStats?gameId=${currentGame.id}`,
        'GET',
        wipeSignatureAndReRequest,
        account,
        null,
        true,
        null
      );

      const leaderboardData = await response;
      if (leaderboardData) {
        setLeaderboardStats(leaderboardData);
      }
    };

    fetchLeaderboardStats();
  }, [
    chainId,
    currentGame,
    account,
    wipeSignatureAndReRequest,
    setLeaderboardStats,
  ]);

  const handleListItemClick = (event, index) => setSelectedIndex(index);

  const MobileHighScoreInfoRow = (title, info) => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={6} sm={6} lg={6}>
          <span className={playGameSpecificClasses.playInfoRow}>{title}</span>
        </Grid>
        <Grid item xs={6} sm={6} lg={6}>
          <span className={playGameSpecificClasses.playInfoRow}>{info}</span>
        </Grid>
      </Grid>
    );
  };

  const HighScoreInfoRow = (title, info) => {
    return (
      <Grid container spacing={5}>
        <Grid item xs={12} sm={5} lg={5}>
          <span className={playGameSpecificClasses.playInfoRow}>{title}</span>
        </Grid>
        <Grid item xs={12} sm={7} lg={7}>
          <span className={playGameSpecificClasses.playInfoRow}>{info}</span>
        </Grid>
      </Grid>
    );
  };

  const PodiumPlayer = (player, className) => {
    const localPlayer = player;
    return (
      <div className={className}>
        <div className={playGameSpecificClasses.podiumAvatarWrapper}>
          {localPlayer.profile ? (
            <img
              src={localPlayer.profile}
              alt="avatar"
              className={playGameSpecificClasses.podiumAvatar}
            />
          ) : (
            <Avatar
              src={avatar}
              className={playGameSpecificClasses.podiumAvatar}
            />
          )}
        </div>
        <div className="UserName">{localPlayer.name}</div>
        <div>{localPlayer.highScore}</div>
        <div style={{ height: '16px' }} />
        <div className="podiumFlag">
          {/* <img src={localPlayer.flag} alt="Country Flag" /> */}
        </div>
      </div>
    );
  };

  return (
    <>
      <BrowserView>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} lg={6}>
            <Grid container spacing={2}>
              {highScoreData.length < 1 && (
                <Grid item xs={12} sm={12} lg={12}>
                  <Suspense fallback={<Spinner />} />
                </Grid>
              )}
              {playerStats && (
                <Grid item xs={12} sm={12} lg={12}>
                  {HighScoreInfoRow(
                    'Current Position',
                    playerStats.CurrentPosition
                  )}
                  {HighScoreInfoRow('High Score', playerStats.HighScore)}
                  {HighScoreInfoRow(
                    'Total Play Sessions',
                    playerStats.TotalPlays
                  )}
                  {HighScoreInfoRow(
                    'Total Play Time',
                    getElapsedTime(playerStats.TotalPlayTime)
                  )}
                </Grid>
              )}
              <Grid item container xs={3} sm={3} lg={3} />

              <Grid
                item
                container
                xs={9}
                sm={9}
                lg={9}
                className={playGameSpecificClasses.leaderboardPodiumWrapper}
              >
                <Grid
                  container
                  spacing={2}
                  className={playGameSpecificClasses.leaderboardPodium}
                  style={{ backgroundImage: `url(${Podium})` }}
                >
                  <Grid item xs={4} sm={4} lg={4}>
                    {silverPlayer && (
                      <>
                        {PodiumPlayer(
                          silverPlayer,
                          playGameSpecificClasses.podiumSilver
                        )}
                      </>
                    )}
                  </Grid>
                  <Grid item xs={4} sm={4} lg={4}>
                    {goldPlayer && (
                      <>
                        {PodiumPlayer(
                          goldPlayer,
                          playGameSpecificClasses.podiumGold
                        )}
                      </>
                    )}
                  </Grid>
                  <Grid item xs={4} sm={4} lg={4}>
                    {bronzePlayer && (
                      <>
                        {PodiumPlayer(
                          bronzePlayer,
                          playGameSpecificClasses.podiumBronze
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} lg={6} className={classes.parentVideo}>
            <Grid container justifyContent="center">
              <Grid item className={clsx(classes.marginBottom5)} />
              <div style={{ width: '100%' }}>
                <List
                  dense
                  className={classes.rankList}
                  style={{ height: '632px' }}
                >
                  {highScoreData.length < 1 && (
                    <Suspense fallback={<Spinner />} />
                  )}
                  {highScoreData.length > 0 &&
                    highScoreData.map((data, index) => {
                      return (
                        <List
                          key={uuid_v4()}
                          component="nav"
                          aria-label="main mailbox folders"
                        >
                          <ListItem
                            button
                            selected={selectedIndex === index}
                            onClick={(event) =>
                              handleListItemClick(event, index)
                            }
                          >
                            {index <= 2 && (
                              <ListItemIcon
                                className={playClasses.leaderboardCupItem}
                              >
                                {index === 0 && <img src={gold} alt="gold" />}
                                {index === 1 && (
                                  <img src={silver} alt="silver" />
                                )}
                                {index === 2 && (
                                  <img src={bronze} alt="bronze" />
                                )}
                              </ListItemIcon>
                            )}
                            {index > 2 && (
                              <ListItemText
                                primary={index + 1}
                                className={playClasses.leaderboardRankItem}
                              />
                            )}
                            <ListItemIcon
                              key={uuid_v4()}
                              className={classes.ListAvatarItem}
                            >
                              <img
                                src={data.avatar ? `${data.avatar}` : avatar}
                                alt="avatar"
                                className={classes.avatarWidth}
                              />
                            </ListItemIcon>
                            <ListItemText
                              key={uuid_v4()}
                              className={playClasses.leaderboardUserAddress}
                            >
                              {data.playerName}
                            </ListItemText>
                            <ListItemText
                              key={uuid_v4()}
                              className={playClasses.leaderboardScore}
                            >
                              {data.highScore}
                            </ListItemText>
                            <ListItemText
                              key={uuid_v4()}
                              className={playClasses.leaderboardTimeItem}
                            >
                              {data.daysAgo < 1
                                ? `Today`
                                : `${data.daysAgo} days ago`}
                            </ListItemText>
                          </ListItem>
                        </List>
                      );
                    })}
                </List>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </BrowserView>
      <MobileView>
        <Grid item style={{ padding: '5px' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={12}
            style={{ marginBottom: '10px', fontSize: '20px' }}
          >
            <span className={playGameSpecificClasses.playInfoRow}>
              High Scores
            </span>
          </Grid>
          <hr />
          {highScoreData.length < 1 && (
            <Grid item xs={12} sm={12} lg={12}>
              <Suspense fallback={<Spinner />} />
            </Grid>
          )}
          {playerStats && (
            <>
              {MobileHighScoreInfoRow('Ranking', playerStats.CurrentPosition)}
              {MobileHighScoreInfoRow('High Score', playerStats.HighScore)}
              {MobileHighScoreInfoRow('Total Sessions', playerStats.TotalPlays)}
              {MobileHighScoreInfoRow(
                'Play Time',
                getElapsedTime(playerStats.TotalPlayTime)
              )}
            </>
          )}
          <Grid
            item
            xs={12}
            sm={6}
            lg={6}
            className={classes.parentVideo}
            style={{ marginTop: '20px' }}
          >
            <Grid container justifyContent="center">
              <Grid item className={clsx(classes.marginBottom5)} />
              <div style={{ width: '100%' }}>
                <List
                  dense
                  className={classes.rankList}
                  style={{ height: '632px' }}
                >
                  {highScoreData.length < 1 && (
                    <Suspense fallback={<Spinner />} />
                  )}
                  {highScoreData.length > 0 &&
                    highScoreData.map((data, index) => {
                      return (
                        <List
                          key={uuid_v4()}
                          component="nav"
                          aria-label="main mailbox folders"
                        >
                          <ListItem
                            button
                            selected={selectedIndex === index}
                            onClick={(event) =>
                              handleListItemClick(event, index)
                            }
                          >
                            <ListItemText
                              key={uuid_v4()}
                              className={playClasses.leaderboardUserAddress}
                            >
                              {data.playerName}
                            </ListItemText>
                            <ListItemText
                              key={uuid_v4()}
                              className={playClasses.leaderboardScore}
                            >
                              {data.highScore}
                            </ListItemText>
                            <ListItemText
                              key={uuid_v4()}
                              className={playClasses.leaderboardTimeItem}
                            >
                              {data.daysAgo < 1
                                ? `Today`
                                : `${data.daysAgo} days ago`}
                            </ListItemText>
                          </ListItem>
                        </List>
                      );
                    })}
                </List>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </MobileView>
    </>
  );
};

export default LeaderBoard;
