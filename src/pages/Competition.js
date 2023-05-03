import { useState, useEffect, Suspense } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { useWeb3React } from '@web3-react/core';
import clsx from 'clsx';
import _ from 'lodash';

import { BrowserView, MobileView } from 'react-device-detect';

import { useParams } from 'react-router-dom';
import moment from 'moment';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

import Spinner from '../components/Spinner';
import GameItem from '../components/GameItem';

import { History } from '../theme';

// ** Import Assets
import useStyles from '../assets/styles';
import gold from '../assets/img/Cup/goldcup.png';
import silver from '../assets/img/Cup/silvercup.png';
import bronze from '../assets/img/Cup/bronzecup.png';
import avatar from '../assets/img/Profile2.jpg';

import { walletAuthFetchWithSigPrompt } from '../helpers/apiFetchWrappers';

const Competition = (props) => {
  const { wipeSignatureAndReRequest } = props;
  const { id } = useParams();

  const { chainId, account } = useWeb3React();

  const classes = useStyles.ranking();
  const playClasses = useStyles.playGameSpecific();
  const compClasses = useStyles.competitions();

  const [compLeaderboardData, setCompLeaderboardData] = useState([]);
  const [compData, setCompData] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [enrolled, setEnrolled] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [playerRank, setPlayerRank] = useState(null);

  const prizeClassMapping = ['first', 'second', 'third'];

  useEffect(() => {
    const fetchCompetitionData = async () => {
      const url = `Competition/${id}`;
      try {
        const resp = await walletAuthFetchWithSigPrompt(
          url,
          'GET',
          wipeSignatureAndReRequest,
          account,
          null,
          true,
          null
        );
        const competitionData = resp;

        if (competitionData) {
          const oneDay = 24 * 60 * 60 * 1000;
          const today = new Date();

          competitionData.daysUntilStart = Math.round(
            today - new Date(competitionData.startDate) / oneDay
          );
          competitionData.daysUntilEnd = Math.round(
            today - new Date(competitionData.endDate) / oneDay
          );
          competitionData.formattedStart = moment(
            competitionData.startDate
          ).format('HH:mm Do MMM');
          competitionData.formattedEnd = moment(competitionData.endDate).format(
            'HH:mm Do MMM (UTC)'
          );
          setCompData(competitionData);

          const standingsData = competitionData.stats;
          const leaderboard = standingsData.standings;
          setEnrolled(standingsData.enrolled);
          setParticipantCount(standingsData.participantCount);
          setPlayerRank(standingsData.playerRank);
          const orderedScores = _.orderBy(
            leaderboard,
            ['competitionRank'],
            ['asc']
          );
          setCompLeaderboardData(orderedScores);
        }
      } catch (error) {
        console.log('Failed to load competitions');
      }
    };
    fetchCompetitionData();
  }, [account, chainId, id, wipeSignatureAndReRequest]);

  const handleListItemClick = (event, index) => setSelectedIndex(index);

  const ActivateGame = (item) => {
    History.push(`/play-game/${item.id}`);
  };

  const compSignUp = async (compId) => {
    const url = `CompetitionParticipation/${compId}/Enrol`;
    try {
      const enrollment = await walletAuthFetchWithSigPrompt(
        url,
        'POST',
        wipeSignatureAndReRequest,
        account,
        {
          mode: 'cors',
        },
        false,
        null
      );

      if (enrollment) {
        setEnrolled(true);
      }
    } catch (error) {
      console.log('Failed to enrol into competition');
    }
  };

  const infoRow = (label, value) => (
    <Grid
      container
      direction="row"
      justifyContent="center"
      key={uuid_v4()}
      className={compClasses.CompInfoRow}
      style={{ marginBottom: '10px' }}
    >
      <Grid item lg={5} md={5} sm={5} xs={5}>
        <span>{label}</span>
      </Grid>
      <Grid item lg={7} md={7} sm={7} xs={7}>
        <span>{value}</span>
      </Grid>
    </Grid>
  );

  const CompetitionList = () => (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Grid item lg={12} md={12} sm={12} xs={12}>
        {!compData && <Suspense fallback={<Spinner />} />}
        {compData && (
          <Card
            key={uuid_v4()}
            className={compClasses.CompWrapper}
            style={{
              backgroundImage: `url(${compData.bannerImageUrl}`,
            }}
          >
            <CardContent
              className={compClasses.CompContent}
              style={{
                background: 'transparent',
              }}
            >
              {/* Heading */}
              <Grid
                container
                direction="row"
                justifyContent="center"
                style={{ marginBottom: '10px' }}
              >
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <div>
                    <span className={compClasses.CompTitle}>
                      {compData.name}
                    </span>
                  </div>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12}>
                  <div>
                    <div className={compClasses.CompActiveDates}>
                      {compData.formattedStart} - {compData.formattedEnd}
                    </div>
                  </div>
                </Grid>
              </Grid>

              <Grid container direction="row" justifyContent="center">
                {/* Logo */}
                <Grid item lg={2} md={2} sm={2} xs={2}>
                  <div>
                    <img
                      className={compClasses.CompLogo}
                      src={compData.competitionLogoUrl}
                      alt="compLogo"
                    />
                  </div>
                </Grid>

                {/* Prizes */}
                <Grid
                  item
                  lg={4}
                  md={4}
                  sm={4}
                  xs={12}
                  style={{ textAlign: 'center' }}
                >
                  <div className={compClasses.PrizePoolHeading}>
                    <span>Prize Pool</span>
                  </div>

                  {compData?.prizes?.length > 0 &&
                    compData.prizes
                      .sort((a, b) => (a.order > b.order ? 1 : 0))
                      .map((prize, prizeIndex) => (
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          key={uuid_v4()}
                          className={compClasses.PrizeRow}
                          style={{ marginBottom: '10px' }}
                        >
                          <Grid item lg={5} md={5} sm={5} xs={5}>
                            <span
                              className={`${
                                prizeIndex < 3
                                  ? prizeClassMapping[prizeIndex]
                                  : ''
                              }`}
                            >
                              {prize.position}
                            </span>
                          </Grid>
                          <Grid item lg={7} md={7} sm={7} xs={7}>
                            <span
                              className={`${
                                prizeIndex < 3
                                  ? prizeClassMapping[prizeIndex]
                                  : ''
                              }`}
                            >
                              {prize.reward}
                            </span>
                          </Grid>
                        </Grid>
                      ))}
                </Grid>

                {/* Info */}
                <Grid
                  item
                  lg={3}
                  md={3}
                  sm={3}
                  xs={3}
                  style={{ textAlign: 'center' }}
                >
                  <div className={compClasses.CompInfoHeading}>
                    <span>Stats</span>
                  </div>
                  <div>
                    {participantCount > 0 &&
                      infoRow('Participants', participantCount)}
                    {playerRank && infoRow('Your Position', playerRank)}
                    {participantCount === 0 && (
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        key={uuid_v4()}
                        className={compClasses.CompInfoRow}
                        style={{ marginBottom: '10px' }}
                      >
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <span>No Participants</span>
                        </Grid>
                      </Grid>
                    )}
                  </div>
                </Grid>

                {/* GAMES */}
                <Grid item lg={3} md={3} sm={3} xs={3}>
                  <div>
                    <div className={compClasses.CompActiveDates}>
                      Competition Games
                    </div>
                    <div className={compClasses.CompGamesWrapper}>
                      <Grid container spacing={2} justifyContent="flex-end">
                        {compData.includedGames?.length > 0 &&
                          compData.includedGames.map((item) => (
                            <Grid
                              item
                              lg={6}
                              sm={6}
                              xs={6}
                              key={uuid_v4()}
                              className={compClasses.perGameContainer}
                            >
                              <GameItem item={item} ActiveGame={ActivateGame} />
                            </Grid>
                          ))}
                      </Grid>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
            {/* Sponsor row */}
            {compData.sponsors.length > 0 && (
              <CardActions
                className={compClasses.CompActions}
                style={{
                  background: 'transparent',
                }}
              >
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid item lg={3} sm={3} xs={3} />
                  <Grid item lg={3} sm={3} xs={3} />
                  <Grid item lg={3} sm={3} xs={3} />
                  <Grid item lg={3} sm={3} xs={3} />
                </Grid>
              </CardActions>
            )}

            <CardActions
              className={compClasses.CompActions}
              style={{
                background: 'transparent',
              }}
            >
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item lg={2} sm={2} xs={2} />
                <Grid item lg={3} sm={3} xs={3} />
                <Grid
                  item
                  lg={4}
                  sm={4}
                  xs={4}
                  key={uuid_v4()}
                  className={compClasses.perGameContainer}
                >
                  {compData.ended && enrolled && (
                    <span className={compClasses.EnrolledText}>
                      Participated
                    </span>
                  )}{' '}
                  {!compData.ended && enrolled && (
                    <span className={compClasses.EnrolledText}>
                      Participating
                    </span>
                  )}
                  {!compData.ended && !enrolled && (
                    <Button
                      size="small"
                      className={compClasses.CompSignUpButton}
                      onClick={() => compSignUp(compData.id)}
                    >
                      Sign up!
                    </Button>
                  )}
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        )}
      </Grid>
    </Grid>
  );

  const MobileCompetitionList = () => (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Grid item lg={12} md={12} sm={12} xs={12}>
        {!compData && <Suspense fallback={<Spinner />} />}
        {compData && (
          <Card
            className={compClasses.CompWrapper}
            style={{
              backgroundImage: `url(${compData.bannerImageUrl}`,
            }}
          >
            <CardContent
              className={compClasses.CompContent}
              style={{
                background: 'transparent',
              }}
            >
              {/* Heading */}
              <Grid
                container
                direction="row"
                justifyContent="center"
                style={{ marginBottom: '10px' }}
              >
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <div>
                    <span className={compClasses.CompTitle}>
                      {compData.name}
                    </span>
                  </div>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <div>
                    <div className={compClasses.CompActiveDates}>
                      {compData.formattedStart} - {compData.formattedEnd}
                    </div>
                  </div>
                </Grid>
              </Grid>

              <Grid container direction="row" justifyContent="center">
                {/* Logo */}
                <Grid item lg={2} md={2} sm={12} xs={12}>
                  <div>
                    <img
                      className={compClasses.CompLogo}
                      src={compData.competitionLogoUrl}
                      alt="compLogo"
                    />
                  </div>
                </Grid>

                {/* Prizes */}
                <Grid
                  item
                  lg={3}
                  md={3}
                  sm={12}
                  xs={12}
                  style={{ textAlign: 'center' }}
                >
                  <div className={compClasses.PrizePoolHeading}>
                    <span>Prize Pool</span>
                  </div>

                  {compData?.prizes?.length > 0 &&
                    compData.prizes
                      .sort((a, b) => (a.order > b.order ? 1 : 0))
                      .map((prize, prizeIndex) => (
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          key={uuid_v4()}
                          className={compClasses.PrizeRow}
                        >
                          <Grid item lg={3} md={3} sm={3} xs={3}>
                            <span
                              className={`${
                                prizeIndex < 3
                                  ? prizeClassMapping[prizeIndex]
                                  : ''
                              }`}
                            >
                              {prize.position}
                            </span>
                          </Grid>
                          <Grid item lg={9} md={9} sm={9} xs={9}>
                            <span
                              className={`${
                                prizeIndex < 3
                                  ? prizeClassMapping[prizeIndex]
                                  : ''
                              }`}
                            >
                              {prize.reward}
                            </span>
                          </Grid>
                        </Grid>
                      ))}
                </Grid>

                {/* GAMES */}
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <div>
                    <div className={compClasses.CompGamesHeader}>
                      Competition Games
                    </div>
                    <div className={compClasses.CompGamesWrapper}>
                      <Grid container spacing={2} justifyContent="flex-end">
                        {compData.includedGames?.length > 0 &&
                          compData.includedGames.map((item) => (
                            <Grid
                              item
                              lg={6}
                              sm={6}
                              xs={6}
                              key={uuid_v4()}
                              className={compClasses.perGameContainer}
                            >
                              <GameItem item={item} ActiveGame={ActivateGame} />
                            </Grid>
                          ))}
                      </Grid>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
            {/* Sponsor row */}
            {compData.sponsors.length > 0 && (
              <CardActions
                className={compClasses.CompActions}
                style={{
                  background: 'transparent',
                }}
              />
            )}

            <CardActions
              className={compClasses.CompActions}
              style={{
                background: 'transparent',
              }}
            >
              <div style={{ width: '100%' }}>
                {compData.ended && enrolled && (
                  <span className={compClasses.EnrolledText}>Participated</span>
                )}{' '}
                {!compData.ended && enrolled && (
                  <span className={compClasses.EnrolledText}>
                    Participating
                  </span>
                )}
                {!compData.ended && !enrolled && (
                  <Button
                    size="small"
                    className={compClasses.CompSignUpButton}
                    onClick={() => compSignUp(compData.id)}
                  >
                    Sign up!
                  </Button>
                )}
              </div>
            </CardActions>
          </Card>
        )}
      </Grid>
    </Grid>
  );

  return (
    <>
      <BrowserView style={{ marginTop: '20px', padding: '10px' }}>
        <CompetitionList />
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={10} sm={10} lg={10}>
            <Grid container justifyContent="center">
              <Grid item className={clsx(classes.marginBottom5)} />
              <div style={{ width: '100%' }}>
                <List
                  dense
                  className={classes.rankList}
                  style={{ height: '632px' }}
                >
                  {compLeaderboardData.length < 1 && (
                    <Suspense fallback={<Spinner />} />
                  )}
                  {compLeaderboardData.length > 0 &&
                    compLeaderboardData.map((data, index) => {
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
                                src={
                                  data.playerAvatar
                                    ? `${data.playerAvatar}`
                                    : avatar
                                }
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
                              {data.score}
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
        <MobileCompetitionList />
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12} sm={6} lg={6} className={classes.parentVideo}>
            <Grid container justifyContent="center">
              <Grid item className={clsx(classes.marginBottom5)} />
              <div style={{ width: '100%' }}>
                <List
                  dense
                  className={classes.rankList}
                  style={{ height: '632px' }}
                >
                  {compLeaderboardData.length < 1 && (
                    <Suspense fallback={<Spinner />} />
                  )}
                  {compLeaderboardData.length > 0 &&
                    compLeaderboardData.map((data, index) => {
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
                                src={
                                  data.playerAvatar
                                    ? `${data.playerAvatar}`
                                    : avatar
                                }
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
                              {data.score}
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

export default Competition;
