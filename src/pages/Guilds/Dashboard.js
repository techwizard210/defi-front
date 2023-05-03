import { useState, useEffect, useCallback } from 'react';
import { isMobile } from 'react-device-detect';
import { v4 as uuid_v4 } from 'uuid';
import { useParams } from 'react-router-dom';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';

import { useWeb3React } from '@web3-react/core';

import { walletAuthFetchWithSigPrompt } from '../../helpers/apiFetchWrappers';

const Dashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const [dashboardData, setDashboardData] = useState(null);

  const { account } = useWeb3React();
  const { id } = useParams();

  const getDashboardData = useCallback(async () => {
    try {
      const url = id ? `Guild/${id}/Dashboard` : 'Guild/Dashboard';
      const resp = await walletAuthFetchWithSigPrompt(
        url,
        'GET',
        null,
        account,
        null,
        true,
        null
      );

      setDashboardData(resp);
    } catch (error) {
      console.log('failed to fetch guild data');
    }
  }, [account, id]);

  useEffect(() => {
    getDashboardData();
  }, [account, getDashboardData]);

  const isNumeric = (str) => {
    if (typeof str !== 'string') return false;
    return (
      // eslint-disable-next-line no-restricted-globals
      !isNaN(str) && !isNaN(parseFloat(str))
    );
  };

  const headlineFigure = (headliner) => (
    <Grid
      container
      item
      lg={3}
      md={3}
      sm={6}
      xs={12}
      className="headliner"
      key={uuid_v4()}
    >
      <Grid
        container
        item
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className="headlinerWrapper"
      >
        <Grid item lg={12} md={12} sm={12} xs={12} className="title">
          {headliner.title}
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12} className="value">
          {isNumeric(headliner.value) ? (
            <>{Number(headliner.value).toLocaleString()}</>
          ) : (
            <>{headliner.value}</>
          )}
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12} className="description">
          {headliner.description}
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <div className={`dashboard ${!isMobile ? 'leftPadding' : ''}`}>
      <div className="headlineFiguresSection">
        <div className="headlinersWrapper">
          <Grid container spacing={2}>
            {dashboardData?.headlineFigures?.length === 0 && (
              <Grid item lg={12} md={12} sm={12} xs={12}>
                {' '}
                <div className="noData">
                  No dashboard data was found for this guild...
                </div>
              </Grid>
            )}
            {dashboardData?.headlineFigures?.length > 0 &&
              dashboardData?.headlineFigures.map((headliner) =>
                headlineFigure(headliner)
              )}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
