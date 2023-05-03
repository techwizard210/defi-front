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

import PickNFTDialog from './PickNFTDialog';

const ScholarOfferDialog = (props) => {
  const { open, handleClose, wipeSignatureAndReRequest } = props;

  const { account } = useWeb3React();

  const [commissionRate, setCommissionRate] = useState(null);

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

  const createScholarOffer = async () => {
    try {
      const scholarOffer = {
        CommissionRate: commissionRate,
        GamingNFTId: selectedNFT.gamingNFTId,
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const options = {
        mode: 'cors',
        body: JSON.stringify(scholarOffer),
      };
      const scholOfferResp = await walletAuthFetchWithSigPrompt(
        `Tavern/CreateScholarOffer`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        headers
      );

      if (scholOfferResp) {
        if (scholOfferResp.success) {
          toast.success('Created scholar offer');
          handleClose(null, true);
        } else {
          toast.error(scholOfferResp.error);
        }
      }
    } catch (error) {
      console.log('failed to create scholar offer contract');
    }
  };

  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
        className="guildModal assignScholarModal scholOfferModal"
      >
        <DialogTitle
          id="max-width-dialog-title"
          style={{ textAlign: 'center' }}
        >
          Create Tavern Scholar Offer
        </DialogTitle>
        <DialogContent className="body">
          <Grid container>
            <Grid item container lg={12} md={12} sm={12} xs={12}>
              <Grid
                item
                container
                lg={8}
                md={8}
                sm={12}
                xs={12}
                className="nftDetails"
              >
                {selectedNFT && (
                  <>
                    <Grid item lg={2} md={2} sm={2} xs={2} className="image">
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
              <Grid item lg={4} md={4} sm={12} xs={12} className="nftAction">
                {selectedNFT && (
                  <Button onClick={handleModalOpen}>Change NFT</Button>
                )}
                {!selectedNFT && (
                  <Button onClick={handleModalOpen}>Select NFT</Button>
                )}
              </Grid>
            </Grid>

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
              This means for every 100 HiFi the scholar earns:
              <ul>
                <li>The NFT owner will get: {commissionRate} HiFi</li>
                <li>The scholar will get: {100 - commissionRate} HiFi</li>
              </ul>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className="actions">
          {!selectedNFT && <span>Please select an NFT</span>}
          {selectedNFT &&
            commissionRate &&
            commissionRate >= 0 &&
            commissionRate <= 100 && (
              <Button onClick={createScholarOffer} color="primary">
                Create Offer
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

export default ScholarOfferDialog;
