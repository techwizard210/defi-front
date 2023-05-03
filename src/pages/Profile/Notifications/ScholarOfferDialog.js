/* eslint-disable */
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

const ScholarOfferDialog = (props) => {
  const { open, handleClose, wipeSignatureAndReRequest, offerId } = props;

  const { account, chainId } = useWeb3React();

  const [scholarshipOffer, setScholarshipOffer] = useState(null);

  const acceptOffer = async () => {
    try {
      const acceptOfferResp = await walletAuthFetchWithSigPrompt(
        `Scholarship/AcceptOffer?offerId=${offerId}`,
        'POST',
        null,
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
          toast.error(acceptOfferResp.message);
          handleClose();
        }
      }
    } catch (error) {
      console.log('failed to accept scholar offer');
    }
  };

  const rejectOffer = async () => {
    try {
      const rejectOfferResp = await walletAuthFetchWithSigPrompt(
        `Scholarship/RejectOffer?offerId=${offerId}`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        null,
        false,
        null
      );

      if (rejectOfferResp.success) {
        handleClose();
      }
    } catch (error) {
      console.log('failed to reject scholar offer');
    }
  };

  // const counterOffer = async (scholarOffer) => {
  //   try {
  //     const counterOfferReq = {
  //       offerId: scholarshipOffer.Id,
  //       proposedCommission: 55,
  //     };

  //     const headers = new Headers();
  //     headers.append('Content-Type', 'application/json');
  //     headers.append('Accept', 'application/json');

  //     const options = {
  //       mode: 'cors',
  //       body: JSON.stringify(counterOfferReq),
  //     };
  //     await walletAuthFetchWithSigPrompt(
  //       `Scholarship/CounterOffer`,
  //       'POST',
  //       null,
  //       account,
  //       options,
  //       true,
  //       headers
  //     );
  //   } catch (error) {
  //     console.log('failed to counter scholar offer');
  //   }
  // };

  const getScholarshipOffer = useCallback(async () => {
    try {
      const resp = await walletAuthFetchWithSigPrompt(
        `Scholarship/GetOffer?offerId=${offerId}`,
        'GET',
        wipeSignatureAndReRequest,
        account,
        null,
        false,
        null
      );
      if (resp) {
        setScholarshipOffer(resp);
      }
    } catch (error) {
      console.log('failed to fetch scholarship offer');
    }
  }, [account, wipeSignatureAndReRequest, offerId]);

  useEffect(() => {
    async function init() {
      await getScholarshipOffer();
    }
    if (account && offerId) {
      init();
    }
  }, [account, offerId]);

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
                  You&apos;ve been offered a scholarship at [
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
              {scholarshipOffer.active && (
                <Grid item lg={12} md={12} sm={12} xs={12} className="actions">
                  <Button onClick={() => acceptOffer()} className="accept">
                    Accept Offer
                  </Button>
                  {/* <Button onClick={() => counterOffer(scholarshipOffer)}>
                    Counter
                  </Button> */}
                  <Button
                    onClick={() => rejectOffer(scholarshipOffer)}
                    className="close"
                  >
                    Reject Offer
                  </Button>
                </Grid>
              )}
              {!scholarshipOffer.active && (
                <div className="offerNotActive">
                  Scholarship offer no longer active
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

export default ScholarOfferDialog;
