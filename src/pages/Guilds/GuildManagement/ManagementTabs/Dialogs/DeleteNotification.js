import { useWeb3React } from '@web3-react/core';

// ** Import Material-Ui Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { walletAuthFetchWithSigPrompt } from '../../../../../helpers/apiFetchWrappers';

const DeleteNotification = (props) => {
  const { open, handleClose, wipeSignatureAndReRequest, notificationId } =
    props;

  const { account } = useWeb3React();

  const deleteNotification = async () => {
    try {
      const options = {
        mode: 'cors',
      };

      const deletedResponse = await walletAuthFetchWithSigPrompt(
        `GuildNotifications?id=${notificationId}`,
        'DELETE',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        null
      );
      if (deletedResponse?.success) {
        handleClose();
      }
    } catch (error) {
      console.log('failed to delete notification');
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      className="profileModal"
    >
      <DialogTitle id="max-width-dialog-title" style={{ textAlign: 'center' }}>
        Delete Notification
      </DialogTitle>
      <DialogContent className="body">
        Are you sure you wish to delete this notification?
      </DialogContent>
      <DialogActions>
        <Button onClick={deleteNotification} color="primary" className="close">
          Delete
        </Button>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteNotification;
