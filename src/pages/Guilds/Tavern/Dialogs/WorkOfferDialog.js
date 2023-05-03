import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';

// ** Import Material-Ui Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid, TextField } from '@material-ui/core';
import { walletAuthFetchWithSigPrompt } from '../../../../helpers/apiFetchWrappers';

const WorkOfferDialog = (props) => {
  const { open, handleClose, wipeSignatureAndReRequest } = props;

  const { account } = useWeb3React();

  const [commissionRate, setCommissionRate] = useState(50);

  const makeWorkOffer = async () => {
    try {
      const scholarOffer = {
        CommissionRate: commissionRate,
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const options = {
        mode: 'cors',
        body: JSON.stringify(scholarOffer),
      };
      const scholOfferResp = await walletAuthFetchWithSigPrompt(
        `Tavern/CreateWorkOffer`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        headers
      );

      if (scholOfferResp) {
        if (scholOfferResp.success) {
          toast.success('Created work offer');
          handleClose(null, true);
        } else {
          toast.error(scholOfferResp.error);
          handleClose(null, false);
        }
      }
    } catch (error) {
      console.log('Failed to create work offer');
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      className="guildManagementModal assignScholarModal scholOfferModal"
    >
      <DialogTitle id="max-width-dialog-title" style={{ textAlign: 'center' }}>
        Create Work Order
      </DialogTitle>
      <DialogContent className="body">
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Commission Split"
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
            />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12} className="offerDetails">
            <p>
              This means for every 100 HiFi you earn:
              <ul>
                <li>The NFT owner will get: {commissionRate} HiFi</li>
                <li>You will receive: {100 - commissionRate} HiFi</li>
              </ul>
            </p>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={makeWorkOffer} color="primary">
          Create Work Offer
        </Button>
        <Button onClick={handleClose} color="primary" className="close">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkOfferDialog;
