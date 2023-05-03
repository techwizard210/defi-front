import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import DataTable from 'react-data-table-component';

// ** Import Material-Ui Components

import { useWeb3React } from '@web3-react/core';
import Button from '@material-ui/core/Button';

import { walletAuthFetchWithSigPrompt } from '../../../../helpers/apiFetchWrappers';
import InviteMemberDialog from './Dialogs/InviteMemberDialog';

const memberColumns = [
  {
    name: 'Name',
    selector: 'name',
    center: true,
    sortable: true,
  },
  {
    name: 'Rank',
    selector: 'rank',
    center: true,
    sortable: true,
  },
  {
    name: 'NFT Count',
    selector: 'nftCount',
    center: true,
    sortable: true,
  },
  {
    name: 'Scholar Slots',
    selector: 'scholarSlotCount',
    center: true,
    sortable: true,
  },
];

const Members = (props) => {
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

  useEffect(() => {
    const getMembersOverview = async () => {
      try {
        const overviewResponse = await walletAuthFetchWithSigPrompt(
          `GuildManagement/Members`,
          'GET',
          null,
          account,
          null,
          true,
          null
        );
        if (overviewResponse) {
          setMembersData(overviewResponse);
        }
      } catch (error) {
        console.log('Unable to fetch members overview');
      }
    };

    async function init() {
      await getMembersOverview();
    }
    if (account) {
      init();
    }
  }, [account]);

  return (
    <div className={`missions ${!isMobile ? 'leftPadding' : ''}`}>
      <div>
        <Button onClick={handleInviteMemberOpen}>Invite Member</Button>
      </div>

      <div className="membersList">
        <div className="membersListWrapper">
          {membersData && (
            <DataTable
              columns={memberColumns}
              data={membersData.members}
              pagination
              theme="solarized"
            />
          )}
        </div>
      </div>

      <InviteMemberDialog
        open={openInviteMember}
        handleClose={handleInviteMemberClose}
        wipeSignatureAndReRequest={wipeSignatureAndReRequest}
      />
    </div>
  );
};

export default Members;
