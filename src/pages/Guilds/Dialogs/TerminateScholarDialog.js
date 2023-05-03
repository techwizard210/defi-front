import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import { isMobile } from 'react-device-detect';

// ** Import Material-Ui Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';

import { walletAuthFetchWithSigPrompt } from '../../../helpers/apiFetchWrappers';

const TerminateScholarDialog = (props) => {
  const { open, handleClose, wipeSignatureAndReRequest, nftSlot } = props;

  const { account } = useWeb3React();

  const terminateScholarship = async () => {
    try {
      const terminateResp = await walletAuthFetchWithSigPrompt(
        `Scholarship/Terminate?scholarshipId=${nftSlot.scholarship.id}`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        null,
        false,
        null
      );

      if (terminateResp) {
        if (terminateResp.success) {
          toast.success('Scholarship contract terminated');
          handleClose();
        } else {
          toast.error(terminateResp.error);
        }
      }
    } catch (error) {
      console.log(`Failed to terminate scholarship: ${error.message}`);
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      className={`guildManagementModal terminateModal ${
        isMobile ? 'mobile' : ''
      }`}
    >
      <DialogTitle id="max-width-dialog-title" style={{ textAlign: 'center' }}>
        Terminate Scholarship
      </DialogTitle>
      <DialogContent className="body">
        <Grid container>
          <Grid
            item
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className="terminateMessage"
          >
            {nftSlot && (
              <>
                You are about to terminate the scholarship for{' '}
                <span className="playerName">
                  [{nftSlot.scholarship.playerName}]
                </span>
                , are you sure you wish to continue?
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={terminateScholarship} color="primary">
          Terminate
        </Button>
        <Button onClick={handleClose} color="primary" className="close">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TerminateScholarDialog;
