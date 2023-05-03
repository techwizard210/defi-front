import { useState, useEffect, Suspense } from 'react';
import { isMobile } from 'react-device-detect';
import { v4 as uuid_v4 } from 'uuid';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@mui/material/Typography';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import DataTable from 'react-data-table-component';

import { useWeb3React } from '@web3-react/core';

import Spinner from '../../components/Spinner';
import { walletAuthFetchWithSigPrompt } from '../../helpers/apiFetchWrappers';

import GameItem from '../../components/GameItem';

const Gaming = () => {
  const [gamingStats, setGamingStats] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const { account } = useWeb3React();

  const handleTabChange = (event, tab) => {
    setSelectedTab(tab);
  };

  useEffect(() => {
    const fetchGamingStats = async () => {
      try {
        const gamingStatsResponse = await walletAuthFetchWithSigPrompt(
          `Player/GetPlayHistory`,
          'GET',
          null,
          account,
          null,
          true,
          null
        );

        if (gamingStatsResponse) {
          setGamingStats(gamingStatsResponse);
        }
      } catch (error) {
        console.log('Unable to fetch gaming stats');
      }
    };

    async function init() {
      await fetchGamingStats();
    }
    if (account) {
      init();
    }
  }, [account]);

  const ActivateGame = (item) => {
    const id = item.id ?? item.bundleUrl;
    History.push(`/play-game/${id}`);
  };

  const gameItem = (playSession) => {
    return (
      <Grid container>
        <Grid item container lg={5} md={5} sm={6} xs={12}>
          <GameItem item={playSession} ActiveGame={ActivateGame} />
        </Grid>
        <Grid item container lg={7} md={7} sm={6} xs={12}>
          {!isMobile && (
            <Grid
              item
              container
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="rewardsFor dateRow bottomBorder"
            >
              <div className="gameItemTitle">{playSession.title}</div>
            </Grid>
          )}

          <Grid
            item
            container
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className="rewardsFor dateRow"
          >
            <Grid item lg={5} md={6} sm={6} xs={6} className="title">
              Played At
            </Grid>
            <Grid item lg={7} md={7} sm={6} xs={6} className="date">
              {new Date(playSession.startedAt).toLocaleDateString()}{' '}
              {new Date(playSession.startedAt).toLocaleTimeString()}
            </Grid>
          </Grid>
          <Grid
            item
            container
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className="rewardsFor dateRow"
          >
            <Grid item lg={5} md={5} sm={6} xs={6} className="title">
              Play Time
            </Grid>
            <Grid item lg={7} md={7} sm={6} xs={6} className="date">
              {playSession.readableTimeString}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const subHeadlinerStat = (title, value) => {
    return (
      <Grid container className="subHeadlinerWrapper">
        <Grid item lg={6} md={6} sm={12} xs={12}>
          {title}
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          {value}
        </Grid>
      </Grid>
    );
  };

  const columns = [
    {
      name: 'Game Name',
      selector: (row) => row.title,
      center: true,
      sortable: true,
    },
    {
      name: 'Play Sessions',
      selector: (row) => row.totalPlays,
      center: true,
      sortable: true,
    },
    {
      name: 'Play Time',
      selector: (row) => row.totalMs,
      center: true,
      sortable: true,
      cell: (row) => row.readbablePlayTime,
    },
  ];

  const GamingFigures = () => {
    return (
      <>
        {gamingStats.gamingHeadliners.map((item) => {
          return (
            <Card key={uuid_v4()} className="headlinerWrapper">
              <Paper className="contentWrapper">
                <Grid container direction="row" justifyContent="center">
                  <Grid item lg={5} md={5} sm={12} xs={12}>
                    <Typography paragraph className="title">
                      {item.title}
                    </Typography>

                    <Grid container direction="row" justifyContent="center">
                      {subHeadlinerStat(
                        'Total Play Sessions',
                        item.playSessionCount
                      )}
                      {subHeadlinerStat('Play Time', item.readbablePlayTime)}
                    </Grid>
                  </Grid>
                  <Grid item lg={7} md={7} sm={12} xs={12}>
                    <Typography paragraph className="title">
                      Your Most Popular Games
                    </Typography>
                    <Grid
                      container
                      direction="row"
                      className="breakdownWrapper"
                    >
                      <Grid
                        item
                        container
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        className="totalSubStatWrapper"
                      >
                        <DataTable
                          columns={columns}
                          data={item.gameSessions}
                          theme="default"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Card>
          );
        })}
      </>
    );
  };

  const TabSection = () => {
    return (
      <>
        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          onChange={handleTabChange}
          centered
        >
          <Tab label="Recently Played" />
          <Tab label="Advanced" />
        </Tabs>
      </>
    );
  };

  function TabPanel(tabPanelProps) {
    const { children, index } = tabPanelProps;

    return (
      <div
        role="tabpanel"
        hidden={selectedTab !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        className="statsWrapper"
      >
        {selectedTab === index && <Box>{children}</Box>}
      </div>
    );
  }

  return (
    <div className="gameStats">
      <TabSection />

      {!gamingStats && (
        <>
          <TabPanel value={selectedTab} index={0}>
            <div className="noMoreMissions">
              Please connect your wallet to view your gaming stats
            </div>
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <div className="noMoreMissions">
              Please connect your wallet to view your gaming stats
            </div>
          </TabPanel>
        </>
      )}
      {gamingStats && (
        <>
          <TabPanel value={selectedTab} index={0} className="statsWrapper">
            <div className="statsWrapper">
              <div className="gamingSectionHeader">
                <span>Recently Played</span>
              </div>
              <div className="gamingHistory noMax">
                <Grid item container spacing={1}>
                  {gamingStats.playSessions.length < 1 && (
                    <Suspense fallback={<Spinner />} />
                  )}
                  {gamingStats.playSessions.length > 0 &&
                    gamingStats.playSessions.slice(0, 10).map((playSession) => {
                      return (
                        <Grid
                          key={uuid_v4()}
                          item
                          container
                          lg={6}
                          md={6}
                          sm={12}
                          xs={12}
                        >
                          <Card className="gamingItemWrapper">
                            <CardContent
                              style={{
                                background: 'transparent',
                              }}
                            >
                              {gameItem(playSession)}
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                </Grid>
              </div>
            </div>
          </TabPanel>

          <TabPanel value={selectedTab} index={1}>
            <Grid container spacing={1} className="statsWrapper">
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <div className="gamingSectionHeader">
                  <span>Statistics</span>
                </div>
                <GamingFigures />
              </Grid>
              {/* <Grid item lg={4} md={4} sm={12} xs={12}>
                <div className="gamingSectionHeader">
                  <span>Play History</span>
                </div>
                <div className="gamingHistory">
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      {playSessionList(gamingStats.playSessions)}
                    </Grid>
                  </Grid>
                </div>
              </Grid> */}
            </Grid>
          </TabPanel>
        </>
      )}
    </div>
  );
};

export default Gaming;
