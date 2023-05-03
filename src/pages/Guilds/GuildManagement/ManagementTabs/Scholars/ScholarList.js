import { v4 as uuid_v4 } from 'uuid';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { BrowserView, MobileView } from 'react-device-detect';
import DataTable from 'react-data-table-component';

import { useWeb3React } from '@web3-react/core';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import { walletAuthFetchWithSigPrompt } from '../../../../../helpers/apiFetchWrappers';
import InviteScholarDialog from '../../../Dialogs/InviteScholarDialog';
import SingleActionModal from '../../../../../components/SingleActionModal';

const cleanQuery = {
  Name: null,
  Roles: [10],
  OrderByField: 'Name',
  OrderByDirection: null,
  ResultsPerPage: 0,
  PageNo: 1,
};

const ScholarList = (props) => {
  const { wipeSignatureAndReRequest } = props;

  const [scholarsData, setScholarsData] = useState(null);

  const { account } = useWeb3React();

  const [openInviteScholar, setOpenInviteScholar] = useState(false);

  const handleInviteScholarClose = async () => {
    setOpenInviteScholar(false);
  };

  const handleInviteScholarOpen = async () => {
    setOpenInviteScholar(true);
  };

  const [sortColumn, setSortColumn] = useState(null);
  const [ascSort, setSortDirection] = useState(true);

  const toggleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(!ascSort);
    } else {
      setSortColumn(column);
      setSortDirection(true);
    }
  };

  const getMembersOverview = useCallback(async () => {
    try {
      const query = cleanQuery;
      if (sortColumn) {
        query.OrderByField = sortColumn;
      }
      query.OrderByDirection = ascSort ? 'asc' : 'desc';

      const options = {
        mode: 'cors',
        body: JSON.stringify(query),
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const resp = await walletAuthFetchWithSigPrompt(
        `GuildManagement/Scholars`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        true,
        headers
      );
      setScholarsData(resp);
    } catch (error) {
      console.log('Unable to fetch scholars overview');
    }
  }, [account, ascSort, sortColumn, wipeSignatureAndReRequest]);

  const [openKickScholar, setOpenKickScholar] = useState(false);
  const [selectedScholar, setSelectedScholar] = useState(null);

  const handleKickScholarClose = async () => {
    setOpenKickScholar(false);
    getMembersOverview();
  };

  const handleKickScholarOpen = async (scholar) => {
    setSelectedScholar(scholar);
    setOpenKickScholar(true);
  };

  const kickScholar = async () => {
    try {
      const options = {
        mode: 'cors',
      };

      const kickResponse = await walletAuthFetchWithSigPrompt(
        `GuildManagement/KickMember?memberId=${selectedScholar.playerId}`,
        'DELETE',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        null
      );
      if (kickResponse) {
        if (kickResponse?.success) {
          toast.success('Kicked scholar');
        } else {
          toast.error(kickResponse.error);
        }
        handleKickScholarClose();
      }
    } catch (error) {
      console.log('failed to remove kick scholar');
    }
  };

  useEffect(() => {
    async function init() {
      await getMembersOverview();
    }
    if (account) {
      init();
    }
  }, [account, getMembersOverview]);

  const columns = [
    {
      name: 'Name',
      selector: (s) => s.name,
      center: true,
      sortable: true,
    },
    {
      name: 'Commission',
      selector: (s) => s.commission,
      center: true,
      sortable: true,
    },
    {
      name: 'Total Days',
      selector: (s) => s.totalDays,
      center: true,
      sortable: true,
    },
    {
      name: 'Earn Days',
      selector: (s) => s.totalEarnDays,
      center: true,
      sortable: true,
    },
    {
      name: 'Total Merits',
      selector: (s) => s.totalMerits,
      center: true,
      sortable: true,
    },
    {
      name: 'Avg Daily Merits',
      selector: (s) => s.averageDailyMerits,
      center: true,
      sortable: true,
    },
    {
      name: 'Total HiFi',
      selector: (s) => s.totalHiFi,
      center: true,
      sortable: true,
    },
    {
      name: 'Avg Daily HiFi',
      selector: (s) => s.averageDailyHiFi,
      center: true,
      sortable: true,
    },
    {
      name: '',
      center: true,
      cell: (row) => (
        <>
          {scholarsData?.canManageScholars && (
            <Button
              onClick={() => handleKickScholarOpen(row)}
              className="close"
            >
              Kick
            </Button>
          )}
        </>
      ),
    },
  ];

  const scholarCell = (value, width, extraClass) => (
    <Grid
      item
      container
      lg={width}
      md={width}
      sm={width}
      xs={width}
      className={`scholarSlots ${extraClass}`}
    >
      {value}
    </Grid>
  );

  const scholarRow = (scholar) => (
    <Grid
      item
      container
      lg={12}
      md={12}
      sm={12}
      xs={12}
      key={uuid_v4()}
      className="memberWrapper"
    >
      <Card className="memberCard">
        <CardContent className="memberInfo">
          <Grid item container lg={12} md={12} sm={12} xs={12} key={uuid_v4()}>
            {scholarCell(scholar.name, 3, 'name')}
            {scholarCell(scholar.commission, 2)}
            {scholarCell(scholar.totalDays, 1)}
            {scholarCell(scholar.totalEarnDays, 1)}
            {scholarCell(scholar.totalMerits, 1)}
            {scholarCell(scholar.averageDailyMerits, 1)}
            {scholarCell(scholar.totalHiFi, 1)}
            {scholarCell(scholar.averageDailyHiFi, 1)}
            <Grid
              item
              container
              lg={1}
              md={1}
              sm={1}
              xs={1}
              className="scholarSlots"
            >
              {scholarsData?.canManageScholars && (
                <Button
                  onClick={() => handleKickScholarOpen(scholar)}
                  className="close"
                >
                  Kick
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );

  const colTitle = (colName, width, sortName) => (
    <Grid
      item
      container
      lg={width}
      md={width}
      sm={width}
      xs={width}
      onClick={() => toggleSort(sortName ?? colName)}
      className="colheading"
    >
      {sortColumn === (sortName ?? colName) && (
        <>
          {ascSort && <ArrowDownwardIcon />}
          {!ascSort && <ArrowUpwardIcon />}
        </>
      )}
      {colName}
    </Grid>
  );

  const TitleRow = () => (
    <Grid
      item
      container
      lg={12}
      md={12}
      sm={12}
      xs={12}
      key={uuid_v4()}
      className="titleRow"
    >
      {colTitle('Name', 3)}
      {colTitle('Commission', 2)}
      {colTitle('Total Days', 1, 'TotalDays')}
      {colTitle('Earn Days', 1, 'TotalEarnDays')}
      {colTitle('Total Merits', 1, 'TotalMerits')}
      {colTitle('Avg Daily Merits', 1, 'AverageDailyMerits')}
      {colTitle('Total HiFi', 1, 'TotalHiFi')}
      {colTitle('Avg Daily HiFi', 1, 'AverageDailyHiFi')}
    </Grid>
  );

  return (
    <>
      <BrowserView>
        <Grid
          item
          container
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="subHeading"
        >
          <Grid item lg={8} md={8} sm={8} xs={8}>
            Current Scholars
          </Grid>
          <Grid item lg={4} md={4} sm={4} xs={4}>
            {scholarsData?.canManageScholars && (
              <Button
                onClick={handleInviteScholarOpen}
                className="inviteButton"
              >
                Invite Scholar
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12} className="titleRowWrapper">
          <TitleRow />
        </Grid>

        <Grid
          item
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="memberListWrapper"
        >
          {scholarsData?.scholars?.length > 0 &&
            scholarsData.scholars.map((scholar) => scholarRow(scholar))}
        </Grid>
      </BrowserView>

      <MobileView>
        <Grid
          item
          container
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="subHeading"
        >
          <Grid item lg={8} md={8} sm={8} xs={8}>
            Current Scholars
          </Grid>
          <Grid item lg={4} md={4} sm={4} xs={4}>
            {scholarsData?.canManageScholars && (
              <Button
                onClick={handleInviteScholarOpen}
                className="inviteButton"
              >
                Invite Scholar
              </Button>
            )}
          </Grid>
        </Grid>
        <DataTable
          columns={columns}
          data={scholarsData?.scholars}
          pagination
          theme="solarized"
          highlightOnHover
          noDataComponent={
            <div className="noContracts">
              You have no scholars at the moment...
            </div>
          }
        />
      </MobileView>

      <InviteScholarDialog
        open={openInviteScholar}
        handleClose={handleInviteScholarClose}
        wipeSignatureAndReRequest={wipeSignatureAndReRequest}
      />

      <SingleActionModal
        open={openKickScholar}
        handleClose={handleKickScholarClose}
        messageWording={`Are you sure you want to kick the scholar [${
          selectedScholar?.name ?? ''
        }]?`}
        action={kickScholar}
        modalTitle="Kick Scholar"
        actionWording="Kick"
        actionClass="close"
      />
    </>
  );
};

export default ScholarList;
