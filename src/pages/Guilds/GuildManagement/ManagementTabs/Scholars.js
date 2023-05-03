import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import DataTable from 'react-data-table-component';

/* eslint-disable */
// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Typography from '@mui/material/Typography';
import Button from '@material-ui/core/Button';

import { useWeb3React } from '@web3-react/core';

import { walletAuthFetchWithSigPrompt } from '../../../../helpers/apiFetchWrappers';
import InviteScholarDialog from './Dialogs/InviteScholarDialog_old';

const scholarColumns = [
  {
    name: 'Name',
    selector: 'name',
    center: true,
    sortable: true,
  },
  {
    name: 'Commission',
    selector: 'commission',
    center: true,
    sortable: true,
  },
  {
    name: 'Total Days',
    selector: 'totalDays',
    center: true,
    sortable: true,
  },
  {
    name: 'Total Earn Days',
    selector: 'totalEarnDays',
    center: true,
    sortable: true,
  },
  {
    name: 'Total Merits',
    selector: 'totalMerits',
    center: true,
    sortable: true,
  },
  {
    name: 'Avg Daily Merits',
    selector: 'averageDailyMerits',
    center: true,
    sortable: true,
  },
  {
    name: 'Total HiFi',
    selector: 'totalHiFi',
    center: true,
    sortable: true,
  },
];

const Scholars = (props) => {
  const { wipeSignatureAndReRequest } = props;

  const [scholarData, setScholarData] = useState(null);

  const { account } = useWeb3React();

  const [openInviteScholar, setOpenInviteScholar] = useState(false);

  const handleInviteScholarClose = async () => {
    setOpenInviteScholar(false);
  };

  const handleInviteScholarOpen = async () => {
    setOpenInviteScholar(true);
  };

  useEffect(() => {
    const getScholarsOverview = async () => {
      try {
        const overviewResponse = await walletAuthFetchWithSigPrompt(
          `GuildManagement/Scholars`,
          'GET',
          null,
          account,
          null,
          true,
          null
        );
        if (overviewResponse) {
          setScholarData(overviewResponse);
        }
      } catch (error) {
        console.log('Unable to fetch scholars overview');
      }
    };

    async function init() {
      await getScholarsOverview();
    }
    if (account) {
      init();
    }
  }, [account]);

  return (
    <div className={`scholars ${!isMobile ? 'leftPadding' : ''}`}>
      <div>
        <Button onClick={handleInviteScholarOpen}>Invite Scholar</Button>
      </div>

      <div className="missionsSection">
        <div className="missionsWrapper">
          {scholarData && (
            <DataTable
              columns={scholarColumns}
              data={scholarData.scholars}
              pagination
              theme="solarized"
            />
          )}
        </div>
      </div>
      <InviteScholarDialog
        open={openInviteScholar}
        handleClose={handleInviteScholarClose}
        wipeSignatureAndReRequest={wipeSignatureAndReRequest}
      />
    </div>
  );
};

export default Scholars;
