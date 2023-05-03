import { v4 as uuid_v4 } from 'uuid';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

// ** Import Material-Ui Components

import { useWeb3React } from '@web3-react/core';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';

import { walletAuthFetchWithSigPrompt } from '../../../../../helpers/apiFetchWrappers';
import SingleActionModal from '../../../../../components/SingleActionModal';

const PendingInviteList = (props) => {
  const { wipeSignatureAndReRequest } = props;

  const [pendingInvites, setPendingInvites] = useState(null);

  const { account } = useWeb3React();

  const [selectedPendingInvite, setSelectedPendingInvite] = useState(null);
  const [openModal, setOpenModal] = useState(null);

  const getPendingInvites = useCallback(async () => {
    try {
      const resp = await walletAuthFetchWithSigPrompt(
        `GuildManagement/PendingInvites?scholars=false`,
        'GET',
        wipeSignatureAndReRequest,
        account,
        null,
        false,
        null
      );
      setPendingInvites(resp);
    } catch (error) {
      console.log('Unable to fetch pending invites');
    }
  }, [account, wipeSignatureAndReRequest]);

  const handleModalOpen = async (modalName, invite) => {
    setSelectedPendingInvite(invite);
    setOpenModal(modalName);
  };

  const handleModalClose = async () => {
    setOpenModal(null);
    getPendingInvites();
  };

  const cancelInvite = async () => {
    try {
      const options = {
        mode: 'cors',
      };

      const deletedResponse = await walletAuthFetchWithSigPrompt(
        `GuildManagement/CancelInvite?inviteId=${selectedPendingInvite.id}`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        null
      );
      if (deletedResponse) {
        if (deletedResponse?.success) {
          toast.success('Removed guild invite');
        } else {
          toast.error(deletedResponse.error);
        }
        handleModalClose();
      }
    } catch (error) {
      console.log('failed to remove guild invite');
    }
  };

  const acceptJoinRequest = async () => {
    try {
      const acceptedResponse = await walletAuthFetchWithSigPrompt(
        `GuildManagement/AcceptJoinRequest?inviteId=${selectedPendingInvite.id}`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        null,
        false,
        null
      );
      if (acceptedResponse) {
        if (acceptedResponse?.success) {
          toast.success('Accepted join request');
        } else {
          toast.error(acceptedResponse.error);
        }
        handleModalClose();
      }
    } catch (error) {
      console.log('failed to accept join request');
    }
  };

  const rejectJoinRequest = async () => {
    try {
      const rejectedResponse = await walletAuthFetchWithSigPrompt(
        `GuildManagement/RejectJoinRequest?inviteId=${selectedPendingInvite.id}`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        null,
        false,
        null
      );
      if (rejectedResponse) {
        if (rejectedResponse?.success) {
          toast.success('Rejected join request');
        } else {
          toast.error(rejectedResponse.error);
        }
        handleModalClose();
      }
    } catch (error) {
      console.log('failed to reject join request');
    }
  };

  useEffect(() => {
    async function init() {
      await getPendingInvites();
    }
    if (account) {
      init();
    }
  }, [account, getPendingInvites]);

  const inviteRow = (invite) => (
    <Grid
      item
      container
      lg={12}
      md={12}
      sm={12}
      xs={12}
      key={uuid_v4()}
      className="inviteWrapper"
    >
      <Grid item container lg={2} md={2} sm={2} xs={2} className="name">
        {invite.playerName}
      </Grid>
      <Grid item container lg={2} md={2} sm={2} xs={2} className="role">
        {invite.role}
      </Grid>
      <Grid item container lg={3} md={3} sm={3} xs={3} className="nftCount">
        {invite.direction}
      </Grid>
      <Grid item container lg={3} md={3} sm={3} xs={3} className="scholarSlots">
        {invite.nftCount > 0 && (
          <>
            {invite.nftCount} NFT | ({invite.scholarSlotCount} slots)
          </>
        )}
      </Grid>
      <Grid item container lg={2} md={2} sm={2} xs={2} className="actions">
        {invite.direction === 'Guild Offer' && (
          <Button onClick={() => handleModalOpen('CancelInvite', invite)}>
            Cancel
          </Button>
        )}
        {invite.direction !== 'Guild Offer' && (
          <>
            <Button
              onClick={() => handleModalOpen('AcceptRequest', invite)}
              className="accept"
            >
              Accept
            </Button>
            <Button
              onClick={() => handleModalOpen('RejectRequest', invite)}
              className="close"
            >
              Reject
            </Button>
          </>
        )}
      </Grid>
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
      <Grid item lg={2} md={2} sm={2} xs={2} className="name">
        Name
      </Grid>
      <Grid item lg={2} md={2} sm={2} xs={2} className="role">
        Role
      </Grid>
      <Grid item lg={3} md={3} sm={3} xs={3} className="nftCount">
        Invite Type
      </Grid>
      <Grid item lg={3} md={3} sm={3} xs={3} className="scholarSlots">
        NFT Details
      </Grid>
      <Grid item lg={2} md={2} sm={2} xs={2} className="actions" />
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
        <Grid item lg={12} md={12} sm={12} xs={12}>
          Pending Invites &amp; Requests
        </Grid>
      </Grid>
      <Grid
        item
        container
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className="titleRowWrapper"
      >
        <TitleRow />
      </Grid>

      {pendingInvites?.length > 0 && (
        <Grid
          item
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="inviteListWrapper"
        >
          {pendingInvites.map((invite) => inviteRow(invite))}
        </Grid>
      )}

      {pendingInvites?.length === 0 && (
        <Grid item lg={12} md={12} sm={12} xs={12} className="noPendingInvites">
          No Pending Invites..
        </Grid>
      )}

      <SingleActionModal
        open={openModal === 'CancelInvite'}
        handleClose={handleModalClose}
        messageWording="Are you sure you want to cancel this guild invite?"
        action={cancelInvite}
        modalTitle="Cancel Guild Invite"
        actionWording="Cancel Invite"
        actionClass="close"
      />

      <SingleActionModal
        open={openModal === 'AcceptRequest'}
        handleClose={handleModalClose}
        messageWording="Are you sure you want to accept the join request?"
        action={acceptJoinRequest}
        modalTitle="Accept Member Join Request"
        actionWording="Accept"
      />

      <SingleActionModal
        open={openModal === 'RejectRequest'}
        handleClose={handleModalClose}
        messageWording="Are you sure you want to reject the join request?"
        action={rejectJoinRequest}
        modalTitle="Reject Member Join Request"
        actionWording="Reject"
        actionClass="close"
      />
    </>
  );
};

export default PendingInviteList;
