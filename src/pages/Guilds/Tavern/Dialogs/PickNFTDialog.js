import { useState, useCallback, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { v4 as uuid_v4 } from 'uuid';

// ** Import Material-Ui Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';
import { walletAuthFetchWithSigPrompt } from '../../../../helpers/apiFetchWrappers';

const PickNFTDialog = (props) => {
  const { open, handleClose, wipeSignatureAndReRequest } = props;

  const { account } = useWeb3React();
  const [nfts, setNfts] = useState(null);
  const [nftsFetched, setNftsFetched] = useState(null);

  const [selectedNFT, setSelectedNFT] = useState(null);

  const getAvailableNFTs = useCallback(async () => {
    try {
      const resp = await walletAuthFetchWithSigPrompt(
        'Tavern/GetAvailableNFTs',
        'GET',
        wipeSignatureAndReRequest,
        account,
        null,
        false,
        null
      );

      setNfts(resp);
      setNftsFetched(true);
    } catch (error) {
      console.log('failed to fetch available scholars');
    }
  }, [account, wipeSignatureAndReRequest]);

  useEffect(() => {
    async function init() {
      await getAvailableNFTs();
    }
    if (account) {
      init();
    }
  }, [account, getAvailableNFTs, wipeSignatureAndReRequest]);

  const nftResult = (nft) => (
    <Grid
      item
      container
      lg={12}
      md={12}
      sm={12}
      xs={12}
      key={uuid_v4()}
      className={`${
        selectedNFT !== null && selectedNFT.gamingNFTId === nft.gamingNFTId
          ? 'selected'
          : ''
      }`}
    >
      <Grid item container lg={9} md={9} sm={9} xs={9} className="name">
        <Grid item lg={2} md={2} sm={2} xs={2} className="image">
          <img
            src={`${process.env.REACT_APP_API_URL}/${nft.image}`}
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
          <Grid item lg={12} md={12} sm={12} xs={12} className="name">
            {nft.name}
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
            Scholar Slots {nft.scholarSlots ?? 0} / {nft.maxScholarSlots}
          </Grid>
        </Grid>
      </Grid>
      <Grid item lg={3} md={3} sm={3} xs={3} className="nftAction">
        {(selectedNFT === null ||
          selectedNFT.gamingNFTId !== nft.gamingNFTId) &&
          nft.scholarSlots < nft.maxScholarSlots && (
            <Button onClick={() => setSelectedNFT(nft)}>Select</Button>
          )}
        {selectedNFT !== null &&
          selectedNFT.gamingNFTId === nft.gamingNFTId && <>Selected</>}
        {nft.scholarSlots === nft.maxScholarSlots && <>NFT Full</>}
      </Grid>
    </Grid>
  );

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      className="guildModal scholOfferModal"
    >
      <DialogTitle id="max-width-dialog-title" style={{ textAlign: 'center' }}>
        Select NFT
      </DialogTitle>
      <DialogContent className="body">
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12} className="nftListWrapper">
            {nftsFetched &&
              nfts?.length > 0 &&
              nfts.map((nft) => nftResult(nft))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {selectedNFT !== null && (
          <Button
            onClick={() => handleClose(null, selectedNFT)}
            color="primary"
          >
            Select NFT
          </Button>
        )}
        <Button onClick={handleClose} color="primary" className="close">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PickNFTDialog;
