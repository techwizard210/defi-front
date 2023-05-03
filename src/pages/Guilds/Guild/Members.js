import { useState, useEffect, useCallback } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { useParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import { Grid } from '@material-ui/core';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import { useWeb3React } from '@web3-react/core';

import { walletAuthFetchWithSigPrompt } from '../../../helpers/apiFetchWrappers';

const cleanQuery = {
  Name: null,
  Roles: [0, 10, 20, 30, 40],
  OrderByField: null,
  OrderByDirection: null,
  ResultsPerPage: 20,
  PageNo: 1,
};

const Members = (props) => {
  const [membersData, setMembersData] = useState(null);

  const { wipeSignatureAndReRequest } = props;

  const { id } = useParams();
  const { account } = useWeb3React();

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
        `Guild/${id}/Members`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        true,
        headers
      );
      setMembersData(resp);
      // const calcedPageCount = Math.ceil(
      //   resp.totalRecords / query.ResultsPerPage
      // );
      // setPageCount(calcedPageCount);
    } catch (error) {
      console.log('Unable to fetch members overview');
    }
  }, [account, ascSort, id, sortColumn, wipeSignatureAndReRequest]);

  useEffect(() => {
    getMembersOverview();
  }, [account, getMembersOverview, id]);

  const memberRow = (member) => (
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
            <Grid item container lg={4} md={4} sm={4} xs={4} className="name">
              {member.name}
            </Grid>
            <Grid item container lg={2} md={2} sm={2} xs={2} className="role">
              {member.roleReadable}
            </Grid>
            <Grid
              item
              container
              lg={2}
              md={2}
              sm={2}
              xs={2}
              className="nftCount"
            >
              {member.nftCount}
            </Grid>
            <Grid
              item
              container
              lg={2}
              md={2}
              sm={2}
              xs={2}
              className="scholarSlots"
            >
              {member.scholarSlotCount}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
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
      <Grid
        item
        container
        lg={4}
        md={4}
        sm={4}
        xs={4}
        className="name"
        onClick={() => toggleSort('Player.Name')}
      >
        Name
        {sortColumn === 'Player.Name' && ascSort && <ArrowDownwardIcon />}
        {sortColumn === 'Player.Name' && !ascSort && <ArrowUpwardIcon />}
      </Grid>
      <Grid
        item
        container
        lg={2}
        md={2}
        sm={2}
        xs={2}
        className="role"
        onClick={() => toggleSort('Role')}
      >
        Role
        {sortColumn === 'Role' && ascSort && <ArrowDownwardIcon />}
        {sortColumn === 'Role' && !ascSort && <ArrowUpwardIcon />}
      </Grid>
      <Grid
        item
        container
        lg={2}
        md={2}
        sm={2}
        xs={2}
        className="nftCount"
        onClick={() => toggleSort('NFTCount')}
      >
        NFT Count
        {sortColumn === 'NFTCount' && ascSort && <ArrowDownwardIcon />}
        {sortColumn === 'NFTCount' && !ascSort && <ArrowUpwardIcon />}
      </Grid>
      <Grid
        item
        container
        lg={2}
        md={2}
        sm={2}
        xs={2}
        className="scholarSlots"
        onClick={() => toggleSort('ScholarSlots')}
      >
        Scholar Slots
        {sortColumn === 'ScholarSlots' && ascSort && <ArrowDownwardIcon />}
        {sortColumn === 'ScholarSlots' && !ascSort && <ArrowUpwardIcon />}
      </Grid>
    </Grid>
  );

  return (
    <div className={`members ${isMobile ? 'mobile' : ''}`}>
      <Grid container className="membersList">
        <Grid
          item
          container
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="subHeading"
        >
          <Grid item lg={12} md={12} sm={12} xs={12}>
            Current Members
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
          {membersData?.members?.length > 0 &&
            membersData.members.map((member) => memberRow(member))}
        </Grid>
      </Grid>
    </div>
  );
};

export default Members;
