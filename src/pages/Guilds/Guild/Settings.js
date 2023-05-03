import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';

import { useWeb3React } from '@web3-react/core';

import { walletAuthFetchWithSigPrompt } from '../../../helpers/apiFetchWrappers';

const Settings = () => {
  const [guildSettings, setGuildSettings] = useState({});

  const { id } = useParams();
  const { account } = useWeb3React();

  useEffect(() => {
    const fetchGuildData = async () => {
      const resp = await walletAuthFetchWithSigPrompt(
        `Guild/${id}/Settings`,
        'GET',
        null,
        account,
        null,
        true,
        null
      );
      const profile = resp;
      if (profile) {
        setGuildSettings(profile);
      }
    };

    async function init() {
      await fetchGuildData();
    }
    init();
  }, [account, id]);

  return (
    <Grid container className={`profileSection ${isMobile ? 'mobile' : ''}`}>
      <Grid container item lg={12} md={12} sm={12} xs={12}>
        <Grid container item lg={2} md={2} sm={4} xs={6}>
          Default Commission (%)
        </Grid>
        <Grid container item lg={10} md={10} sm={8} xs={6}>
          {guildSettings.defaultCommission}
        </Grid>
      </Grid>

      <Grid container item lg={12} md={12} sm={12} xs={12}>
        <Grid container item lg={2} md={2} sm={4} xs={6}>
          Manager Cut (%)
        </Grid>
        <Grid container item lg={10} md={10} sm={8} xs={6}>
          {guildSettings.guildTax}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Settings;
