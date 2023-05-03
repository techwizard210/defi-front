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
import PickNFTDialog from './PickNFTDialog';

const AcceptWorkOfferDialog = (props) => {
  const { open, handleClose, wipeSignatureAndReRequest, contract } = props;

  const { account } = useWeb3React();

  const [workOffer, setWorkOffer] = useState(null);

  const [selectedNFT, setSelectedNFT] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleModalOpen = async () => {
    setOpenModal(true);
  };

  const handleModalClose = async (event, nft) => {
    if (nft) {
      setSelectedNFT(nft);
    }
    setOpenModal(false);
  };

  const acceptOffer = async () => {
    try {
      const acceptWorkOfferReq = {
        ContractId: contract.id,
        GamingNFTId: selectedNFT.gamingNFTId,
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
          handleClose();
        } else {
          toast.error(acceptOfferResp.error);
          handleClose();
        }
      }
    } catch (error) {
      console.log('failed to accept work offer');
    }
  };

  const getWorkOfferOffer = useCallback(async () => {
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
      await getWorkOfferOffer();
    }
    if (account && contract && contract.contractType === 1) {
      init();
    }
  }, [account, getWorkOfferOffer, contract]);

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
        className="guildModal scholOfferModal"
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
                <Grid item container lg={12} md={12} sm={12} xs={12}>
                  <Grid
                    item
                    container
                    lg={8}
                    md={8}
                    sm={8}
                    xs={8}
                    className="nftDetails"
                  >
                    {selectedNFT && (
                      <>
                        <Grid
                          item
                          lg={2}
                          md={2}
                          sm={2}
                          xs={2}
                          className="image"
                        >
                          <img
                            src={`${process.env.REACT_APP_API_URL}/${selectedNFT.image}`}
                            alt="nftImg"
                            style={{ width: '100%' }}
                          />
                        </Grid>
                        <Grid
                          item
                          container
                          lg={10}
                          md={10}
                          sm={10}
                          xs={10}
                          className="nftInfo"
                        >
                          <Grid
                            item
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className="name"
                          >
                            {selectedNFT.name}
                          </Grid>
                          <Grid
                            item
                            container
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className="scholarSlots"
                          >
                            <i className="fa-solid fa-user-graduate icon" />
                            Scholar Slots {selectedNFT.scholarSlots ?? 0} /{' '}
                            {selectedNFT.maxScholarSlots}
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {!selectedNFT && <>No NFT Selected</>}
                  </Grid>
                  <Grid item lg={4} md={4} sm={4} xs={4} className="nftAction">
                    {selectedNFT && (
                      <Button onClick={handleModalOpen}>Change NFT</Button>
                    )}
                    {!selectedNFT && (
                      <Button onClick={handleModalOpen}>Select NFT</Button>
                    )}
                  </Grid>
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
          {workOffer?.canAction && selectedNFT && (
            <Button onClick={() => acceptOffer()} className="accept">
              Accept Offer
            </Button>
          )}
          <Button onClick={handleClose} color="primary" className="close">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <PickNFTDialog open={openModal} handleClose={handleModalClose} />
    </>
  );
};

export default AcceptWorkOfferDialog;
