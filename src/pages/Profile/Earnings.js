import { useState, useEffect, Suspense } from 'react';
import { v4 as uuid_v4 } from 'uuid';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import { useWeb3React } from '@web3-react/core';

import Spinner from '../../components/Spinner';
import { walletAuthFetchWithSigPrompt } from '../../helpers/apiFetchWrappers';

const Earnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  const { account } = useWeb3React();

  const handleTabChange = (event, tab) => {
    setSelectedTab(tab);
  };

  useEffect(() => {
    const fetchEarningRecords = async () => {
      try {
        const earningsResponse = await walletAuthFetchWithSigPrompt(
          `Rewards/GetPlayerRewards`,
          'GET',
          null,
          account,
          null,
          true,
          null
        );

        if (earningsResponse) {
          setEarnings(earningsResponse.result);
        }
      } catch (error) {
        console.log('Unable to fetch earnings');
      }
    };

    async function init() {
      await fetchEarningRecords();
    }
    if (account) {
      init();
    }
  }, [account]);

  const rewardsForHeader = (title, value, showHifi) => {
    return (
      <Grid
        item
        container
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className="rewardsFor dateRow"
      >
        <Grid item lg={4} md={4} sm={6} xs={6} className="title">
          {title}:
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={6} className="date">
          {value}
          {showHifi && <span className="HifiSpan">HiFi</span>}
        </Grid>
      </Grid>
    );
  };

  const pendingRewardsEarningsSubstat = (title, value) => {
    return (
      <Grid
        item
        container
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className="substat dateRow"
      >
        <Grid item lg={4} md={4} sm={6} xs={6} className="title">
          {title}:
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={6} className="date">
          {value}
        </Grid>
      </Grid>
    );
  };

  const earningsList = (collection) => {
    return (
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item lg={12} md={12} sm={12} xs={12} className="rewardRowWrapper">
          {collection.length < 1 && <Suspense fallback={<Spinner />} />}
          {collection.length > 0 &&
            collection.map((data) => {
              return (
                <Card key={uuid_v4()} className="earningsItemWrapper">
                  <CardContent
                    style={{
                      background: 'transparent',
                    }}
                  >
                    <Grid container direction="row" justifyContent="center">
                      <Grid
                        item
                        container
                        lg={6}
                        md={6}
                        sm={12}
                        xs={12}
                        className="substatWrapper"
                      >
                        {rewardsForHeader(
                          'Rewards for',
                          new Date(data.rewardsForDate).toLocaleDateString()
                        )}
                        {pendingRewardsEarningsSubstat(
                          'Calculated',
                          new Date(data.calculatedDate).toLocaleDateString()
                        )}
                        {pendingRewardsEarningsSubstat(
                          'Processed',
                          data.processedDate
                            ? new Date(data.processedDate).toLocaleDateString()
                            : null
                        )}
                      </Grid>
                      <Grid
                        item
                        container
                        lg={6}
                        md={6}
                        sm={12}
                        xs={12}
                        className="substatWrapper"
                      >
                        {rewardsForHeader(
                          'Total',
                          data.totalValue?.toLocaleString(),
                          true
                        )}
                        {pendingRewardsEarningsSubstat(
                          'Gaming',
                          data.gaming?.toLocaleString()
                        )}
                        {pendingRewardsEarningsSubstat(
                          'Boost',
                          data.boost?.toLocaleString()
                        )}
                        {pendingRewardsEarningsSubstat(
                          'Staking APR',
                          data.passive?.toLocaleString()
                        )}
                        {pendingRewardsEarningsSubstat(
                          'Scholar',
                          data.scholar?.toLocaleString()
                        )}
                        {pendingRewardsEarningsSubstat(
                          'Raffle',
                          data.lottery?.toLocaleString()
                        )}
                        {pendingRewardsEarningsSubstat(
                          'Competition',
                          data.competition?.toLocaleString()
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              );
            })}
        </Grid>
      </Grid>
    );
  };

  const EarningFiguresTotalsSubStat = (title, value, percent) => {
    return (
      <Grid
        item
        container
        lg={4}
        md={4}
        sm={12}
        xs={12}
        className="totalSubStatWrapper"
      >
        <div className="breakdownRow">
          <div className="breakdownTitle">{title}</div>
          <div className="value">
            {value} <span className="HifiSpan">HiFi</span>
          </div>
          <div className="value">{percent}%</div>
        </div>
      </Grid>
    );
  };

  const EarningsFigures = () => {
    return (
      <>
        {earnings.earningsHeadliners.map((item) => {
          return (
            <div key={uuid_v4()} className="headlinerWrapper">
              <div className="contentWrapper">
                <Grid container direction="row" justifyContent="center">
                  <Grid item lg={6} md={6} sm={12} xs={12}>
                    <Typography paragraph className="title">
                      {item.title}
                    </Typography>
                    <div className="total">
                      {item.total?.toLocaleString()}{' '}
                      <span
                        style={{
                          color: '#ed51a3',
                        }}
                      >
                        HiFi
                      </span>
                    </div>
                  </Grid>
                  <Grid item container lg={6} md={6} sm={12} xs={12}>
                    {item.earningsTokens > 0 && (
                      <Grid item container lg={6} md={6} sm={12} xs={12}>
                        <Typography paragraph className="title" />
                        <div className="total">
                          {item.earningsTokens?.toLocaleString()} Merits
                        </div>
                        <div className="globalTokens">
                          (Total merits earned by all gamers:{' '}
                          {item.totalMerits?.toLocaleString()})
                        </div>
                      </Grid>
                    )}
                    {item.lotteryTickets > 0 && (
                      <Grid item container lg={6} md={6} sm={12} xs={12}>
                        <Typography paragraph className="title" />
                        <div className="total">
                          {item.lotteryTickets?.toLocaleString()} Raffle Tickets
                        </div>
                        <div className="globalTokens">
                          (Total raffle tickets earned by all gamers:{' '}
                          {item.totalLotteryTickets?.toLocaleString()})
                        </div>
                      </Grid>
                    )}
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Typography paragraph className="title">
                      Where did these earnings come from
                    </Typography>
                    <Grid
                      container
                      direction="row"
                      className="breakdownWrapper"
                    >
                      {EarningFiguresTotalsSubStat(
                        'Gaming',
                        item.gaming?.toLocaleString(),
                        item.gamingPercent
                      )}
                      {EarningFiguresTotalsSubStat(
                        'Staking APR',
                        item.passive?.toLocaleString(),
                        item.passivePercent
                      )}
                      {EarningFiguresTotalsSubStat(
                        'Scholars *',
                        item.scholar?.toLocaleString(),
                        item.scholarPercent
                      )}
                      {EarningFiguresTotalsSubStat(
                        'Boost',
                        item.boost?.toLocaleString(),
                        item.boostPercent
                      )}
                      {EarningFiguresTotalsSubStat(
                        'Competitions',
                        item.competition?.toLocaleString(),
                        item.competitionPercent
                      )}
                      {EarningFiguresTotalsSubStat(
                        'Raffle',
                        item.lottery?.toLocaleString(),
                        item.lotteryPercent
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </div>
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
          <Tab label="Overview" />
          <Tab label="Reward History" />
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
      >
        {selectedTab === index && <Box>{children}</Box>}
      </div>
    );
  }

  return (
    <div className="earnings">
      <TabSection />

      <Box className="earningsWrapper">
        <TabPanel value={selectedTab} index={0}>
          {!earnings && (
            <div className="noMoreMissions">
              Please connect your wallet to view your earnings
            </div>
          )}
          {earnings && <EarningsFigures />}
          <div className="comingSoonEarnings">* coming soon</div>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          {!earnings && (
            <div className="noMoreMissions">
              Please connect your wallet to view your earnings
            </div>
          )}
          {earnings && (
            <>
              <div className="earningsSectionHeader">
                <span>Pending Rewards</span>
              </div>
              <div className="rewardScrollerOverflow">
                {earningsList(earnings.pendingRewards)}
              </div>

              <div className="earningsSectionHeader">
                <span>Processed Rewards</span>
              </div>
              <div className="rewardScrollerOverflow">
                {earningsList(earnings.processedRewards)}
              </div>
              {earnings.pendingRewards?.length > 0 ||
                (earnings.processedRewards?.length > 0 && (
                  <div className="comingSoonEarnings">* coming soon</div>
                ))}
            </>
          )}
        </TabPanel>
      </Box>
    </div>
  );
};

export default Earnings;
