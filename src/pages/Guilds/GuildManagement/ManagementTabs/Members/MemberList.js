import { v4 as uuid_v4 } from 'uuid';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

import { useWeb3React } from '@web3-react/core';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import { walletAuthFetchWithSigPrompt } from '../../../../../helpers/apiFetchWrappers';
import InviteMemberDialog from '../../../Dialogs/InviteMemberDialog';
import ManageMemberDialog from '../../../Dialogs/ManageMemberDialog';
import SingleActionModal from '../../../../../components/SingleActionModal';

const cleanQuery = {
  Name: null,
  Roles: [0, 20, 30, 40],
  OrderByField: null,
  OrderByDirection: null,
  ResultsPerPage: 20,
  PageNo: 1,
};

const MemberList = (props) => {
  const { wipeSignatureAndReRequest } = props;

  const [membersData, setMembersData] = useState(null);

  const { account } = useWeb3React();

  const [openInviteMember, setOpenInviteMember] = useState(false);

  const handleInviteMemberClose = async () => {
    setOpenInviteMember(false);
  };

  const handleInviteMemberOpen = async () => {
    setOpenInviteMember(true);
  };

  const [openManageMember, setOpenManageMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleManageMemberOpen = async (member) => {
    setSelectedMember(member);
    setOpenManageMember(true);
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
        `GuildManagement/Members`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        true,
        headers
      );
      setMembersData(resp);
    } catch (error) {
      console.log('Unable to fetch members overview');
    }
  }, [account, ascSort, sortColumn, wipeSignatureAndReRequest]);

  const handleManageMemberClose = async () => {
    setSelectedMember(null);
    setOpenManageMember(false);
    getMembersOverview();
  };

  const [openKickMember, setOpenKickMember] = useState(false);

  const handleKickMemberClose = async () => {
    setOpenKickMember(false);
    getMembersOverview();
  };

  const handleKickMemberOpen = async (scholar) => {
    setSelectedMember(scholar);
    setOpenKickMember(true);
  };

  const kickMember = async () => {
    try {
      const options = {
        mode: 'cors',
      };

      const kickResponse = await walletAuthFetchWithSigPrompt(
        `GuildManagement/KickMember?memberId=${selectedMember.id}`,
        'DELETE',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        null
      );
      if (kickResponse) {
        if (kickResponse?.success) {
          toast.success('Member kicked');
        } else {
          toast.error(kickResponse.error);
        }
        handleKickMemberClose();
      }
    } catch (error) {
      console.log('failed to kick member');
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
            <Grid
              item
              container
              lg={2}
              md={2}
              sm={2}
              xs={2}
              className="scholarSlots"
            >
              {membersData?.canManageMembers && (
                <>
                  <Button onClick={() => handleManageMemberOpen(member)}>
                    Manage
                  </Button>
                  {(member.rank === 0 ||
                    member.rank === 10 ||
                    membersData?.rank > member.rank) && (
                    <Button
                      onClick={() => handleKickMemberOpen(member)}
                      className="close"
                    >
                      Kick
                    </Button>
                  )}
                </>
              )}
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
      <Grid
        item
        container
        lg={2}
        md={2}
        sm={2}
        xs={2}
        className="scholarSlots"
      />
    </Grid>
  );

  return (
    <>
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
          Current Members
        </Grid>
        <Grid item lg={4} md={4} sm={4} xs={4}>
          {membersData?.canManageMembers && (
            <Button onClick={handleInviteMemberOpen} className="inviteButton">
              Invite Member
            </Button>
          )}
        </Grid>
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12} className="titleRowWrapper">
        <TitleRow />
      </Grid>

      <Grid item lg={12} md={12} sm={12} xs={12} className="memberListWrapper">
        {membersData?.members?.length > 0 &&
          membersData.members.map((member) => memberRow(member))}
      </Grid>

      <InviteMemberDialog
        open={openInviteMember}
        handleClose={handleInviteMemberClose}
        wipeSignatureAndReRequest={wipeSignatureAndReRequest}
      />

      <ManageMemberDialog
        open={openManageMember}
        handleClose={handleManageMemberClose}
        wipeSignatureAndReRequest={wipeSignatureAndReRequest}
        selectedMember={selectedMember}
      />

      <SingleActionModal
        open={openKickMember}
        handleClose={handleKickMemberClose}
        messageWording={`Are you sure you want to kick the member [${
          selectedMember?.name ?? ''
        }]?${
          selectedMember?.nftCount > 0
            ? ' - As they own at least one NFT, all of their active scholarships will also be terminated'
            : ''
        }`}
        action={kickMember}
        modalTitle="Kick Member"
        actionWording="Kick"
        actionClass="close"
      />
    </>
  );
};

export default MemberList;
