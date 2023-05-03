import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
/* eslint-disable */
// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Typography from '@mui/material/Typography';

import { useWeb3React } from '@web3-react/core';

import { walletAuthFetchWithSigPrompt } from '../../../../helpers/apiFetchWrappers';

const ManagementDashboard = () => {
  const [managementOverview, setManagementOverview] = useState(null);

  const { account } = useWeb3React();

  useEffect(() => {
    const getManagementOverview = async () => {
      try {
        const overviewResponse = await walletAuthFetchWithSigPrompt(
          `GuildManagement/ManagementOverview`,
          'GET',
          null,
          account,
          null,
          true,
          null
        );

        if (overviewResponse) {
          setManagementOverview(overviewResponse);
        }
      } catch (error) {
        console.log('Unable to fetch management overview');
      }
    };

    async function init() {
      await getManagementOverview();
    }
    if (account) {
      init();
    }
  }, [account]);

  return (
    <div className={`missions ${!isMobile ? 'leftPadding' : ''}`}>
      <div className="missionsSection">
        <div className="missionsWrapper">
          <Grid container spacing={1}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {' '}
              <div className="noMoreMissions">Dashboard coming soon...</div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;
