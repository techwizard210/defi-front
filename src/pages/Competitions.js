import { useState, useEffect, Suspense, useCallback } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { useWeb3React } from '@web3-react/core';
import _ from 'lodash';
import moment from 'moment';
import { BrowserView, MobileView } from 'react-device-detect';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import useStyles from '../assets/styles';
import Spinner from '../components/Spinner';

import GameItem from '../components/GameItem';
import Podium from '../assets/img/hifiPodium.png';
import { History } from '../theme';

import { walletAuthFetchWithSigPrompt } from '../helpers/apiFetchWrappers';

const Competitions = (props) => {
  const { wipeSignatureAndReRequest } = props;

  const classes = useStyles.competitions();

  const { chainId, account } = useWeb3React();

  const [activeComps, setActiveComps] = useState([]);
  const [upcomingComps, setUpcomingComps] = useState([]);
  const [endedComps, setEndedComps] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const fetchCompetitionData = useCallback(async () => {
    const url = 'Competition/GetCompetitions';
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

      const competitions = resp;

      if (competitions) {
        const { active, upcoming, ended } = competitions;
        const oneDay = 24 * 60 * 60 * 1000;
        const today = new Date();

        const formatDates = (comps) => {
          const clonedComps = comps;
          for (let index = 0; index < comps.length; index += 1) {
            clonedComps[index].daysUntilStart = Math.round(
              today - new Date(clonedComps[index].startDate) / oneDay
            );
            clonedComps[index].daysUntilEnd = Math.round(
              today - new Date(clonedComps[index].endDate) / oneDay
            );
            clonedComps[index].formattedStart = moment(
              clonedComps[index].startDate
            ).format('HH:mm Do MMM');
            clonedComps[index].formattedEnd = moment(
              clonedComps[index].endDate
            ).format('HH:mm Do MMM (UTC)');
          }
          return clonedComps;
        };

        formatDates(active);
        formatDates(upcoming);
        formatDates(ended);

        setActiveComps(_.orderBy(active, ['endDate'], ['desc']));
        setUpcomingComps(_.orderBy(upcoming, ['endDate'], ['asc']));
        setEndedComps(_.orderBy(ended, ['endDate'], ['desc']));
      }
    } catch (error) {
      console.log('Failed to load competitions');
    }
  }, [account, wipeSignatureAndReRequest]);

  useEffect(() => {
    fetchCompetitionData();
  }, [chainId, fetchCompetitionData]);

  const ActivateGame = (item) => {
    History.push(`/play-game/${item.id}`);
  };

  const handleListItemClick = () => {};

  const compSignUp = async (compId) => {
    const url = `CompetitionParticipation/${compId}/Enrol`;
    try {
      const enrolled = await walletAuthFetchWithSigPrompt(
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

      if (enrolled) {
        fetchCompetitionData();
        console.log('Successfully enrolled into competition');
      }
    } catch (error) {
      console.log('Failed to enrol into competition');
    }
  };

  const viewCompStandings = (compId) => {
    History.push(`/competition/${compId}`);
  };

  const PodiumPlayer = (player, className) => {
    const localPlayer = player;
    return (
      <div className={`${className} ${classes.podiumPosition}`}>
        <div className={classes.podiumAvatarWrapper}>
          <Avatar
            src={localPlayer.playerAvatar}
            className={classes.podiumAvatar}
          />
        </div>
        <div className={classes.podiumUserName}>{localPlayer.playerName}</div>
        <div>{localPlayer.score}</div>
        <div style={{ height: '16px' }} />
        <div className="podiumFlag">
          {/* <img src={localPlayer.flag} alt="Country Flag" /> */}
        </div>
      </div>
    );
  };

  const prizeClassMapping = ['first', 'second', 'third'];
  const competitionList = (collection) => {
    return (
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {collection.length < 1 && <Suspense fallback={<Spinner />} />}
          {collection.length > 0 &&
            collection.map((data, index) => {
              return (
                <Card
                  key={uuid_v4()}
                  onClick={(event) => handleListItemClick(event, index)}
                  className={classes.CompWrapper}
                  style={{
                    backgroundImage: `url(${data.bannerImageUrl}`,
                  }}
                >
                  <CardContent
                    className={classes.CompContent}
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
                          <span className={classes.CompTitle}>{data.name}</span>
                        </div>
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <div>
                          <div className={classes.CompActiveDates}>
                            {data.formattedStart} - {data.formattedEnd}
                          </div>
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container direction="row" justifyContent="center">
                      {/* Logo */}
                      <Grid item lg={2} md={2} sm={2} xs={2}>
                        <div>
                          <img
                            className={classes.CompLogo}
                            src={data.competitionLogoUrl}
                            alt="compLogo"
                          />
                        </div>
                      </Grid>

                      {/* Prizes */}
                      <Grid
                        item
                        lg={3}
                        md={3}
                        sm={3}
                        xs={12}
                        style={{ textAlign: 'center' }}
                      >
                        <div className={classes.PrizePoolHeading}>
                          <span>Prize Pool</span>
                        </div>

                        {data?.prizes?.length > 0 &&
                          data.prizes
                            .sort((a, b) => (a.order > b.order ? 1 : 0))
                            .map((prize, prizeIndex) => (
                              <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                key={uuid_v4()}
                                className={classes.PrizeRow}
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
                      {/* Podium */}
                      <Grid
                        item
                        container
                        xs={3}
                        sm={3}
                        lg={3}
                        className={classes.leaderboardPodiumWrapper}
                      >
                        <Grid
                          container
                          spacing={2}
                          className={classes.leaderboardPodium}
                          style={{ backgroundImage: `url(${Podium})` }}
                        >
                          <Grid item xs={4} sm={4} lg={4}>
                            {data?.stats?.standings?.length > 1 && (
                              <>
                                {PodiumPlayer(
                                  data?.stats?.standings[1],
                                  classes.podiumSilver
                                )}
                              </>
                            )}
                          </Grid>
                          <Grid item xs={4} sm={4} lg={4}>
                            {data?.stats?.standings?.length > 0 && (
                              <>
                                {PodiumPlayer(
                                  data?.stats?.standings[0],
                                  classes.podiumGold
                                )}
                              </>
                            )}
                          </Grid>
                          <Grid item xs={4} sm={4} lg={4}>
                            {data?.stats?.standings?.length > 2 && (
                              <>
                                {PodiumPlayer(
                                  data?.stats?.standings[2],
                                  classes.podiumBronze
                                )}
                              </>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* GAMES */}
                      <Grid item lg={4} md={4} sm={4} xs={4}>
                        <div>
                          <div className={classes.CompActiveDates}>
                            Competition Games
                          </div>
                          <div className={classes.CompGamesWrapper}>
                            <Grid
                              container
                              spacing={2}
                              justifyContent="flex-end"
                            >
                              {data.includedGames?.length > 0 &&
                                data.includedGames.map((item) => (
                                  <Grid
                                    item
                                    lg={6}
                                    sm={6}
                                    xs={6}
                                    key={uuid_v4()}
                                    className={classes.perGameContainer}
                                  >
                                    <GameItem
                                      item={item}
                                      ActiveGame={ActivateGame}
                                    />
                                  </Grid>
                                ))}
                            </Grid>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </CardContent>
                  {/* Sponsor row */}
                  {data.sponsors.length > 0 && (
                    <CardActions
                      className={classes.CompActions}
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
                    className={classes.CompActions}
                    style={{
                      background: 'transparent',
                    }}
                  >
                    <Grid container spacing={2} justifyContent="flex-end">
                      <Grid item lg={2} sm={2} xs={2} />
                      <Grid item lg={3} sm={3} xs={3} />
                      <Grid
                        item
                        lg={3}
                        sm={3}
                        xs={3}
                        key={uuid_v4()}
                        className={classes.ViewStandingsButtonWrapper}
                      >
                        <Button
                          size="small"
                          className={classes.CompStandingsButton}
                          onClick={() => viewCompStandings(data.id)}
                        >
                          View Standings
                        </Button>
                      </Grid>
                      <Grid
                        item
                        lg={4}
                        sm={4}
                        xs={4}
                        key={uuid_v4()}
                        className={classes.perGameContainer}
                      >
                        {data.ended && data.stats?.enrolled && (
                          <span className={classes.EnrolledText}>
                            Participated
                          </span>
                        )}{' '}
                        {!data.ended && data.stats?.enrolled && (
                          <span className={classes.EnrolledText}>
                            Participating
                          </span>
                        )}
                        {account && !data.ended && !data.stats?.enrolled && (
                          <Button
                            size="small"
                            className={classes.CompSignUpButton}
                            onClick={() => compSignUp(data.id)}
                          >
                            Sign up!
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </CardActions>
                </Card>
              );
            })}
        </Grid>
      </Grid>
    );
  };

  const mobileCompetitionList = (collection) => {
    return (
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {collection.length < 1 && <Suspense fallback={<Spinner />} />}
          {collection.length > 0 &&
            collection.map((data, index) => {
              return (
                <Card
                  key={uuid_v4()}
                  onClick={(event) => handleListItemClick(event, index)}
                  className={classes.CompWrapper}
                  style={{
                    backgroundImage: `url(${data.bannerImageUrl}`,
                  }}
                >
                  <CardContent
                    className={classes.CompContent}
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
                          <span className={classes.CompTitle}>{data.name}</span>
                        </div>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <div>
                          <div className={classes.CompActiveDates}>
                            {data.formattedStart} - {data.formattedEnd}
                          </div>
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container direction="row" justifyContent="center">
                      {/* Logo */}
                      <Grid item lg={2} md={2} sm={12} xs={12}>
                        <div>
                          <img
                            className={classes.CompLogo}
                            src={data.competitionLogoUrl}
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
                        <div className={classes.PrizePoolHeading}>
                          <span>Prize Pool</span>
                        </div>

                        {data?.prizes?.length > 0 &&
                          data.prizes
                            .sort((a, b) => (a.order > b.order ? 1 : 0))
                            .map((prize, prizeIndex) => (
                              <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                key={uuid_v4()}
                                className={classes.PrizeRow}
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
                          <div className={classes.CompGamesHeader}>
                            Competition Games
                          </div>
                          <div className={classes.CompGamesWrapper}>
                            <Grid
                              container
                              spacing={2}
                              justifyContent="flex-end"
                            >
                              {data.includedGames?.length > 0 &&
                                data.includedGames.map((item) => (
                                  <Grid
                                    item
                                    lg={6}
                                    sm={6}
                                    xs={6}
                                    key={uuid_v4()}
                                    className={classes.perGameContainer}
                                  >
                                    <GameItem
                                      item={item}
                                      ActiveGame={ActivateGame}
                                    />
                                  </Grid>
                                ))}
                            </Grid>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </CardContent>
                  {/* Sponsor row */}
                  {data.sponsors.length > 0 && (
                    <CardActions
                      className={classes.CompActions}
                      style={{
                        background: 'transparent',
                      }}
                    >
                      <div>
                        <Button
                          size="small"
                          className={classes.CompSignUpButton}
                          onClick={() => compSignUp(data.id)}
                        >
                          Sign up!
                        </Button>
                      </div>
                    </CardActions>
                  )}

                  <CardActions
                    className={classes.CompActions}
                    style={{
                      background: 'transparent',
                    }}
                  >
                    <div style={{ width: '100%' }}>
                      <Button
                        size="small"
                        className={classes.CompStandingsButton}
                        onClick={() => viewCompStandings(data.id)}
                      >
                        View Standings
                      </Button>
                      {data.ended && data.stats?.enrolled && (
                        <span className={classes.EnrolledText}>
                          Participated
                        </span>
                      )}{' '}
                      {!data.ended && data.stats?.enrolled && (
                        <span className={classes.EnrolledText}>
                          Participating
                        </span>
                      )}
                      {account && !data.ended && !data.stats?.enrolled && (
                        <Button
                          size="small"
                          className={classes.CompSignUpButton}
                          onClick={() => compSignUp(data.id)}
                        >
                          Sign up!
                        </Button>
                      )}
                    </div>
                  </CardActions>
                </Card>
              );
            })}
        </Grid>
      </Grid>
    );
  };

  const handleTabChange = (event, tab) => {
    setSelectedTab(tab);
  };

  function TabPanel(tabPanelProps) {
    const { children, index } = tabPanelProps;

    return (
      <div
        role="tabpanel"
        hidden={selectedTab !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {selectedTab === index && <Box>{children}</Box>}
      </div>
    );
  }

  return (
    <>
      <BrowserView>
        <div className="boost">Competitions</div>
        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          onChange={handleTabChange}
          centered
        >
          <Tab label="Active & Upcoming" />
          <Tab label="Ended" />
        </Tabs>
        <TabPanel value={selectedTab} index={0}>
          {activeComps?.length > 0 && (
            <>
              <div className={classes.CompSectionHeader}>
                <span>Active</span>
              </div>
              <div id="app-signin">
                {competitionList(activeComps, 'activeComps')}
              </div>
            </>
          )}
          {upcomingComps?.length > 0 && (
            <>
              <div className={classes.CompSectionHeader}>
                <span>Upcoming</span>
              </div>
              <div id="app-signin">
                {competitionList(upcomingComps, 'upcomingComps')}
              </div>
            </>
          )}
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <div className={classes.CompSectionHeader}>
            <span>Ended</span>
          </div>
          <div id="app-signin">{competitionList(endedComps, 'endedComps')}</div>
        </TabPanel>
      </BrowserView>
      <MobileView>
        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          onChange={handleTabChange}
          centered
        >
          <Tab label="Active & Upcoming" />
          <Tab label="Ended" />
        </Tabs>
        <TabPanel value={selectedTab} index={0}>
          {activeComps?.length > 0 && (
            <>
              <div className={classes.CompSectionHeader}>
                <span>Active</span>
              </div>
              <div id="app-signin">
                {mobileCompetitionList(activeComps, 'activeComps')}
              </div>
            </>
          )}
          {upcomingComps?.length > 0 && (
            <>
              <div className={classes.CompSectionHeader}>
                <span>Upcoming</span>
              </div>
              <div id="app-signin">
                {mobileCompetitionList(upcomingComps, 'upcomingComps')}
              </div>
            </>
          )}
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <div className={classes.CompSectionHeader}>
            <span>Ended</span>
          </div>
          <div id="app-signin">
            {mobileCompetitionList(endedComps, 'endedComps')}
          </div>
        </TabPanel>
      </MobileView>
    </>
  );
};

export default Competitions;
