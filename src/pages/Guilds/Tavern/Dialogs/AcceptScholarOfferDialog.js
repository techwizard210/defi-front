import { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';

// ** Import Material-Ui Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';

import { walletAuthFetchWithSigPrompt } from '../../../../helpers/apiFetchWrappers';

const AcceptScholarOfferDialog = (props) => {
  const { open, handleClose, wipeSignatureAndReRequest, contract } = props;

  const { account } = useWeb3React();

  const [scholarshipOffer, setScholarshipOffer] = useState(null);

  const acceptOffer = async () => {
    try {
      const acceptOfferResp = await walletAuthFetchWithSigPrompt(
        `Tavern/AcceptScholarshipOffer?contractId=${contract.id}`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        null,
        false,
        null
      );

      if (acceptOfferResp) {
        if (acceptOfferResp.success) {
          toast.success('Accepted scholarship offer');
          handleClose();
        } else {
          toast.error(acceptOfferResp.error);
          handleClose();
        }
      }
    } catch (error) {
      console.log('failed to accept scholar offer');
    }
  };

  const getScholarshipOffer = useCallback(async () => {
    try {
      const { id, contractType } = contract;

      const contractFetchQuery = {
        ContractId: id,
        Type: contractType,
      };

      const options = {
        mode: 'cors',
        body: JSON.stringify(contractFetchQuery),
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const resp = await walletAuthFetchWithSigPrompt(
        `Tavern/GetContract`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        headers
      );

      if (resp) {
        setScholarshipOffer(resp);
      }
    } catch (error) {
      console.log('failed to fetch scholarship offer');
    }
  }, [contract, wipeSignatureAndReRequest, account]);

  useEffect(() => {
    async function init() {
      await getScholarshipOffer();
    }
    if (account && contract && contract.contractType === 0) {
      init();
    }
  }, [account, getScholarshipOffer, contract]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      className="guildManagementModal scholOfferModal"
    >
      <DialogTitle id="max-width-dialog-title" style={{ textAlign: 'center' }}>
        View Scholarship Offer
      </DialogTitle>
      <DialogContent className="body">
        <Grid container>
          {scholarshipOffer && (
            <Grid item container lg={12} md={12} sm={12} xs={12}>
              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className="offerDetails"
              >
                <p>
                  This is a scholarship contract at [
                  {scholarshipOffer.guildName}] on the NFT [
                  {scholarshipOffer.nftName}].
                </p>
                <p>
                  They are offering a commission rate of:{' '}
                  {scholarshipOffer.commissionRate}%.
                </p>
                <p>
                  This means for every 100 HiFi you earn:
                  <ul>
                    <li>
                      You will get: {100 - scholarshipOffer.commissionRate} HiFi
                    </li>
                    <li>
                      The NFT owner will get: {scholarshipOffer.commissionRate}{' '}
                      HiFi
                    </li>
                  </ul>
                </p>
              </Grid>
              {scholarshipOffer.canAction && (
                <Grid item lg={12} md={12} sm={12} xs={12} className="actions">
                  <Button onClick={() => acceptOffer()} className="accept">
                    Accept Offer
                  </Button>
                </Grid>
              )}
              {!scholarshipOffer.canAction && (
                <div className="offerNotActive">
                  Scholarship offer no longer active or you don&apos;t have
                  permission to accept the contract
                </div>
              )}
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" className="close">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AcceptScholarOfferDialog;
