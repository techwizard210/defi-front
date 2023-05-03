/* eslint-disable react/destructuring-assignment */
import { useEffect, useState, useCallback } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import { v4 as uuid_v4 } from 'uuid';
import { useWeb3React } from '@web3-react/core';
import SwiperCore, { Navigation, Autoplay, Mousewheel } from 'swiper/core';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import DataTable from 'react-data-table-component';

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import useStyles from '../../assets/styles';

import { History } from '../../theme';

import { walletAuthFetchWithSigPrompt } from '../../helpers/apiFetchWrappers';
import CreateGuildDialog from './CreateGuildDialog';

const SearchGuildForm = {
  Name: null,
  OrderByField: 'Name',
  OrderByDirection: 'asc',
  ResultsPerPage: 20,
  PageNo: 1,
};

const GuildList = (props) => {
  const backdrops = useStyles.backdrop();

  const { wipeSignatureAndReRequest } = props;

  const { account, chainId } = useWeb3React();

  const [guilds, setGuilds] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const [openCreateGuild, setOpenCreateGuild] = useState(false);

  const handleCreateGuildOpen = async () => {
    setOpenCreateGuild(true);
  };

  const goToGuildManagement = () => {
    History.push(`/GuildManagement`);
  };

  const goToGuildView = (guild) => {
    History.push(`/Guild/${guild.id}`);
  };

  SwiperCore.use([Navigation, Autoplay, Mousewheel]);

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [guildQuery, setGuildQuery] = useState(SearchGuildForm);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCloseBackdrop = () => {
    setLoading(false);
  };

  const fetchGuilds = useCallback(async () => {
    try {
      const query = guildQuery;
      query.PageNo = page;

      const options = {
        mode: 'cors',
        body: JSON.stringify(query),
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const resp = await walletAuthFetchWithSigPrompt(
        `GuildManagement/GuildList`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        true,
        headers
      );

      setGuilds(resp);
      const calcedPageCount = Math.ceil(
        resp.totalRecords / query.ResultsPerPage
      );
      setPageCount(calcedPageCount);
    } catch (error) {
      console.log('failed to fetch NFTs');
    }
  }, [account, guildQuery, page, wipeSignatureAndReRequest]);

  const handleCreateGuildClose = async () => {
    setOpenCreateGuild(false);
    fetchGuilds();
  };

  useEffect(() => {
    fetchGuilds();
  }, [account, chainId, fetchGuilds, wipeSignatureAndReRequest]);

  const columns = [
    {
      name: 'Name',
      selector: (g) => g.name,
      center: true,
      sortable: true,
    },
    {
      name: 'Members',
      selector: (c) => c.memberCount,
      center: true,
      sortable: true,
    },
    {
      name: 'Scholars',
      selector: (g) => g.scholarCount,
      center: true,
      sortable: true,
    },
    {
      name: 'NFTs',
      selector: (g) => g.nftCount,
      center: true,
      sortable: true,
    },
    {
      name: '',
      width: '100px',
      displayName: '',
      cell: (row) => <Button onClick={() => goToGuildView(row)}>View</Button>,
    },
  ];

  const GuildInfoSection = (iconClass, title, value) => (
    <Grid
      item
      container
      lg={3}
      md={3}
      sm={6}
      xs={6}
      className="guildInfoSection"
    >
      <Grid item container lg={12} md={12} sm={12} xs={12}>
        <Grid item container lg={3} md={3} sm={4} xs={4}>
          <div className="infoIconWrapper">
            <i className={`fa-solid ${iconClass}`} />
          </div>
        </Grid>
        <Grid
          item
          container
          lg={9}
          md={9}
          sm={8}
          xs={8}
          className="infoValueWrapper"
        >
          <Grid item lg={12} md={12} sm={12} xs={12} className="infoTitle">
            {title}
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12} className="infoValue">
            {value}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const GuildItem = (guild, finalItem, manage) => (
    <Grid
      item
      container
      lg={12}
      md={12}
      sm={12}
      xs={12}
      key={uuid_v4()}
      className="guildItem"
    >
      <Grid item lg={1} md={1} sm={3} xs={3}>
        <img src={guild.image} alt="nftImg" style={{ width: '100%' }} />
      </Grid>
      <Grid
        item
        container
        lg={11}
        md={11}
        sm={9}
        xs={9}
        className="guildInfoWrapper"
      >
        <Grid item container lg={12} md={12} sm={12} xs={12}>
          <Grid item lg={9} md={9} sm={12} xs={12} className="guildName">
            {guild.name}
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={12} className="guildAction">
            {manage && <Button onClick={goToGuildManagement}>Manage</Button>}
            {!manage && (
              <Button onClick={() => goToGuildView(guild)}>View</Button>
            )}
          </Grid>
        </Grid>
        <Grid item container lg={12} md={12} sm={12} xs={12}>
          {GuildInfoSection('fa-users', 'Members', guild.memberCount)}
          {GuildInfoSection('fa-user-graduate', 'Scholars', guild.scholarCount)}
          {GuildInfoSection('fa-user-astronaut', 'NFTs', guild.nftCount)}
          {finalItem}
        </Grid>
      </Grid>
    </Grid>
  );

  const CurrentGuild = () => {
    return (
      <Grid container spacing={2} className="guildList">
        {GuildItem(
          guilds.currentGuild,
          GuildInfoSection(
            'fa-users',
            'Current Role',
            guilds.currentGuild.role
          ),
          guilds.currentGuild.role !== 'Scholar'
        )}
      </Grid>
    );
  };

  const MobileCurrentGuild = () => {
    const { currentGuild } = guilds;

    return (
      <Grid container spacing={2} className="guildList">
        <Grid
          item
          container
          lg={12}
          md={12}
          sm={12}
          xs={12}
          key={uuid_v4()}
          className="guildItem"
        >
          <Grid item lg={1} md={1} sm={3} xs={3}>
            <img
              src={currentGuild.image}
              alt="nftImg"
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid
            item
            container
            lg={11}
            md={11}
            sm={9}
            xs={9}
            className="guildInfoWrapper"
          >
            <Grid item container lg={12} md={12} sm={12} xs={12}>
              <Grid item lg={9} md={9} sm={12} xs={12} className="guildName">
                {currentGuild.name}
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12} className="guildAction">
                <Button onClick={goToGuildManagement}>Manage</Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            container
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className="guildInfoWrapper"
          >
            <Grid item container lg={12} md={12} sm={12} xs={12}>
              {GuildInfoSection(
                'fa-users',
                'Members',
                currentGuild.memberCount
              )}
              {GuildInfoSection(
                'fa-user-graduate',
                'Scholars',
                currentGuild.scholarCount
              )}
              {GuildInfoSection(
                'fa-user-astronaut',
                'NFTs',
                currentGuild.nftCount
              )}
              {GuildInfoSection('fa-users', 'Current Role', currentGuild.role)}
            </Grid>
          </Grid>{' '}
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <BrowserView className="guildsList">
        <Box>
          {guilds?.currentGuild && (
            <>
              <div className="heading">You are currently a member of</div>

              <CurrentGuild />
            </>
          )}
          {account && !guilds?.currentGuild && (
            <>
              <div className="heading">
                You are currently not a member of any guild
              </div>

              <Button onClick={handleCreateGuildOpen}>Create Guild</Button>
              <CreateGuildDialog
                open={openCreateGuild}
                handleClose={handleCreateGuildClose}
                wipeSignatureAndReRequest={wipeSignatureAndReRequest}
              />
            </>
          )}
          <div className="heading">Guild List</div>
          <DataTable
            columns={columns}
            data={guilds?.guilds}
            pagination
            theme="solarized"
            highlightOnHover
            noDataComponent={
              <div className="noContracts">
                There are no guilds at the moment...
              </div>
            }
          />
        </Box>

        <Backdrop
          className={backdrops.backdrop}
          open={isLoading}
          onClick={handleCloseBackdrop}
          style={{ zIndex: 999999 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </BrowserView>
      <MobileView className="guildsList mobile">
        <Box>
          <Grid container>
            {guilds?.currentGuild && (
              <>
                <div className="heading">You are currently a member of</div>

                <MobileCurrentGuild />
              </>
            )}
            {!guilds?.currentGuild && (
              <>
                <div className="heading">
                  You are currently not a member of any guild
                </div>

                <Button onClick={handleCreateGuildOpen}>Create Guild</Button>
                <CreateGuildDialog
                  open={openCreateGuild}
                  handleClose={handleCreateGuildClose}
                  wipeSignatureAndReRequest={wipeSignatureAndReRequest}
                />
              </>
            )}
            <div className="heading">Guild List</div>

            <DataTable
              columns={columns}
              data={guilds?.guilds}
              pagination
              theme="solarized"
              highlightOnHover
              noDataComponent={
                <div className="noContracts">
                  There are no guilds at the moment...
                </div>
              }
            />

            {pageCount > 2 && (
              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className="nftPagination"
              >
                <Stack spacing={2}>
                  <Pagination
                    count={pageCount}
                    page={page}
                    onChange={handlePageChange}
                  />
                </Stack>
              </Grid>
            )}
          </Grid>
        </Box>
        <Backdrop
          className={backdrops.backdrop}
          open={isLoading}
          onClick={handleCloseBackdrop}
          style={{ zIndex: 999999 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </MobileView>
    </>
  );
};

export default GuildList;
