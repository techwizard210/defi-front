import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { v4 as uuid_v4 } from 'uuid';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { useWeb3React } from '@web3-react/core';

import { walletAuthFetchWithSigPrompt } from '../../../helpers/apiFetchWrappers';

const Profile = () => {
  const [missions, setMissions] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const { account } = useWeb3React();

  const handleCompletedChange = () => {
    setShowCompleted(!showCompleted);
  };

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const missionsResponse = await walletAuthFetchWithSigPrompt(
          `Player/GetMissionDashboardData`,
          'GET',
          null,
          account,
          null,
          true,
          null
        );

        if (missionsResponse) {
          setMissions(missionsResponse.missions);
        }
      } catch (error) {
        console.log('Unable to fetch missions');
      }
    };

    async function init() {
      await fetchQuests();
    }
    if (account) {
      init();
    }
  }, [account]);

  const missionRender = (mission, completed) => {
    return (
      <Grid
        item
        container
        lg={3}
        md={4}
        sm={12}
        xs={12}
        key={uuid_v4()}
        className=""
      >
        <Card
          className={`mission ${completed ? 'completed' : ''}`}
          sx={{ maxWidth: 345 }}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <div className="missionHeader">
            {completed && (
              <Stack direction="row" spacing={1} className="chips">
                <Chip label="Completed" className="completedPill" />
              </Stack>
            )}

            <div className="missionName">{mission.name}</div>
            <div className="missionTypeChips">
              {mission.missionType === 0 && (
                <>
                  <Chip label="Daily Mission" className="dailyMissionChip" />

                  {mission.missionTypeAdditionalInfo && (
                    <Chip
                      label={mission.missionTypeAdditionalInfo}
                      className="dailyMissionChip"
                    />
                  )}
                </>
              )}
              {mission.missionType === 1 && (
                <Chip label="One-time Mission" className="singleMissionChip" />
              )}
              {mission.missionType === 2 && (
                <Chip label="Journey Mission" className="journeyMissionChip" />
              )}
            </div>
          </div>

          <CardContent>
            <hr className="missionSection headerExtender" />
            {mission.summaryParts?.length > 0 && (
              <div className="missionSection">
                {mission.summaryParts?.map((sumPart) => (
                  <Typography
                    className="missionSummary"
                    key={uuid_v4()}
                    variant="body2"
                  >
                    {sumPart}
                  </Typography>
                ))}
              </div>
            )}
            <div className="missionSection">
              {mission.criteria?.map((critPart) => (
                <Typography
                  className="missionCriteria"
                  key={uuid_v4()}
                  variant="body2"
                >
                  {critPart}
                </Typography>
              ))}
            </div>

            <hr className="missionSection" />

            <div className="missionSection rewardsSection">
              Rewards
              {mission.rewards?.map((reward) => (
                <Grid
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  key={uuid_v4()}
                  className="missionReward"
                >
                  {reward}
                </Grid>
              ))}
            </div>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <div className={`missions ${!isMobile ? 'leftPadding' : ''}`}>
      <Typography
        component="div"
        gutterBottom
        className="TextColorGrey heading"
      >
        Missions
        <Typography
          component="div"
          gutterBottom
          className="TextColorGrey completedFilter"
        >
          <input
            id="showCompleted"
            type="checkbox"
            checked={showCompleted}
            onChange={handleCompletedChange}
          />
          <label htmlFor="showCompleted">Show Completed</label>
        </Typography>
      </Typography>

      <div className="missionsSection">
        <div className="missionsWrapper">
          <Grid container spacing={1}>
            {!missions && (
              <div className="noMoreMissions">
                Please connect your wallet to view your available missions
              </div>
            )}

            {missions?.activeMissions?.length === 0 && (
              <div className="noMoreMissions">
                Looks like you&apos;ve completed all of the missions for today,
                come back tomorrow (Reset 00:00 UTC) for some more missions!{' '}
              </div>
            )}
            {missions?.activeMissions?.map((item) => missionRender(item))}
            {showCompleted &&
              missions?.completedMissions?.map((item) =>
                missionRender(item, true)
              )}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Profile;
