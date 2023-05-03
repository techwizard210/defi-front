import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import { isMobile } from 'react-device-detect';

// ** Import Material-Ui Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid, TextField } from '@material-ui/core';
import { walletAuthFetchWithSigPrompt } from '../../../helpers/apiFetchWrappers';

const KickMemberDialog = (props) => {
  const {
    open,
    handleClose,
    wipeSignatureAndReRequest,
    selectedScholar,
    gamingNftId,
    defaultCommissionRate,
  } = props;

  const { account } = useWeb3React();

  const [commissionRate, setCommissionRate] = useState(defaultCommissionRate);

  const makeScholarOffer = async () => {
    try {
      const scholarOffer = {
        PlayerId: selectedScholar.playerId,
        Name: selectedScholar.name,
        CommissionRate: commissionRate,
        NftId: gamingNftId,
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const options = {
        mode: 'cors',
        body: JSON.stringify(scholarOffer),
      };
      const scholOfferResp = await walletAuthFetchWithSigPrompt(
        `Scholarship/MakeOffer`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        headers
      );

      if (scholOfferResp) {
        if (scholOfferResp.success) {
          toast.success('Sent scholar slot offer');
          handleClose(null, true);
        } else {
          toast.error(scholOfferResp.error);
          handleClose(null, false);
        }
      }
    } catch (error) {
      console.log('failed to make scholar offer');
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      className={`guildManagementModal assignScholarModal scholOfferModal ${
        isMobile ? 'mobile' : ''
      }`}
    >
      <DialogTitle id="max-width-dialog-title" style={{ textAlign: 'center' }}>
        Scholar Offer
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
              This means for every 100 HiFi the scholar earns:
              <ul>
                <li>The NFT owner will get: {commissionRate} HiFi</li>
                <li>The scholar will get: {100 - commissionRate} HiFi</li>
              </ul>
            </p>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={makeScholarOffer} color="primary">
          Offer
        </Button>
        <Button onClick={handleClose} color="primary" className="close">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KickMemberDialog;
