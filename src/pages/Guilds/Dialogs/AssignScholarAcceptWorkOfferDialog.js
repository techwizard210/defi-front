import { useState, useEffect, useCallback } from 'react';
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

const AssignScholarAcceptWorkOfferDialog = (props) => {
  const {
    open,
    handleClose,
    wipeSignatureAndReRequest,
    contract,
    gamingNftId,
  } = props;

  const { account } = useWeb3React();

  const [workOffer, setWorkOffer] = useState(null);

  const acceptOffer = async () => {
    try {
      const acceptWorkOfferReq = {
        ContractId: contract.id,
        GamingNFTId: gamingNftId,
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const options = {
        mode: 'cors',
        body: JSON.stringify(acceptWorkOfferReq),
      };

      const acceptOfferResp = await walletAuthFetchWithSigPrompt(
        `Tavern/AcceptWorkOffer`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        headers
      );

      if (acceptOfferResp) {
        if (acceptOfferResp.success) {
          toast.success('Accepted work offer');
          handleClose(null, true);
        } else {
          toast.error(acceptOfferResp.error);
          handleClose();
        }
      }
    } catch (error) {
      console.log('failed to accept work offer');
    }
  };

  const getWorkOffer = useCallback(async () => {
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

      const workOfferResp = await walletAuthFetchWithSigPrompt(
        `Tavern/GetContract`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        headers
      );

      if (workOfferResp) {
        setWorkOffer(workOfferResp);
      }
    } catch (error) {
      console.log('failed to fetch work offer');
    }
  }, [contract, wipeSignatureAndReRequest, account]);

  useEffect(() => {
    async function init() {
      await getWorkOffer();
    }
    if (account && contract && contract.contractType === 1) {
      init();
    }
  }, [account, getWorkOffer, contract]);

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
        className={`guildModal scholOfferModal ${isMobile ? 'mobile' : ''}`}
      >
        <DialogTitle
          id="max-width-dialog-title"
          style={{ textAlign: 'center' }}
        >
          Accept Work Offer
        </DialogTitle>
        <DialogContent className="body">
          <Grid container>
            {workOffer && (
              <Grid item container lg={12} md={12} sm={12} xs={12}>
                <Grid
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className="offerDetails"
                >
                  <p>This is a work offer from [{workOffer.playerName}].</p>
                  <p>
                    They are offering a commission rate of:{' '}
                    {workOffer.commissionRate}%.
                  </p>
                  <div>
                    This means for every 100 HiFi you earn:
                    <ul>
                      <li>
                        You will get: {100 - workOffer.commissionRate} HiFi
                      </li>
                      <li>
                        The NFT owner will get: {workOffer.commissionRate} HiFi
                      </li>
                    </ul>
                  </div>
                </Grid>

                {!workOffer.canAction && (
                  <div className="offerNotActive">
                    Work offer no longer active or you don&apos;t have
                    permission to accept the contract
                  </div>
                )}
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          {workOffer?.canAction && gamingNftId && (
            <Button onClick={() => acceptOffer()} className="accept">
              Accept Offer
            </Button>
          )}
          <Button onClick={handleClose} color="primary" className="close">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssignScholarAcceptWorkOfferDialog;
