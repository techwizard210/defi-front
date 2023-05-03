import { useEffect, useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';

// ** Import Material-Ui Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';

import { walletAuthFetchWithSigPrompt } from '../../../helpers/apiFetchWrappers';

const GuildInviteDialog = (props) => {
  const { open, handleClose, wipeSignatureAndReRequest, inviteId } = props;

  const { account } = useWeb3React();

  const [guildInvite, setGuildInvite] = useState(null);

  const acceptInvite = async () => {
    try {
      const accepted = await walletAuthFetchWithSigPrompt(
        `GuildManagement/AcceptInvite?inviteId=${inviteId}`,
        'POST',
        null,
        account,
        null,
        false,
        null
      );

      if (accepted) {
        if (accepted.success) {
          toast.success('Accepted guild invite');
          handleClose();
        } else {
          toast.error(accepted.error);
        }
      }
    } catch (error) {
      console.log('failed to accept guild invite');
    }
  };

  const rejectInvite = async () => {
    try {
      const rejected = await walletAuthFetchWithSigPrompt(
        `GuildManagement/RejectInvite?inviteId=${inviteId}`,
        'POST',
        null,
        account,
        null,
        true,
        null
      );

      if (rejected) {
        if (rejected.success) {
          toast.success('Rejected guild invite');
        }
        handleClose();
      }
    } catch (error) {
      console.log('failed to reject guild invite');
    }
  };

  const getGuildInvite = useCallback(async () => {
    try {
      const resp = await walletAuthFetchWithSigPrompt(
        `GuildManagement/GetInvite?inviteId=${inviteId}`,
        'GET',
        wipeSignatureAndReRequest,
        account,
        null,
        false,
        null
      );
      if (resp) {
        setGuildInvite(resp);
      }
    } catch (error) {
      console.log('failed to fetch guild invite');
    }
  }, [account, wipeSignatureAndReRequest, inviteId]);

  useEffect(() => {
    async function init() {
      await getGuildInvite();
    }
    if (account && inviteId) {
      init();
    }
  }, [account, getGuildInvite, inviteId]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      className="guildManagementModal guildInviteModal"
    >
      <DialogTitle id="max-width-dialog-title" style={{ textAlign: 'center' }}>
        Guild Invite
      </DialogTitle>
      <DialogContent className="body">
        <Grid container>
          {guildInvite && (
            <Grid
              item
              container
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="notificationRecord"
            >
              <Grid item lg={12} md={12} sm={12} xs={12} className="text">
                {guildInvite.message}
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12} className="actions">
                {guildInvite.active && (
                  <>
                    <Button onClick={() => acceptInvite()} className="accept">
                      Accept
                    </Button>
                    <Button onClick={() => rejectInvite()} className="close">
                      Reject
                    </Button>
                  </>
                )}
                {!guildInvite.active && (
                  <div className="inviteNotActive">
                    Guild invite no longer active
                  </div>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GuildInviteDialog;
