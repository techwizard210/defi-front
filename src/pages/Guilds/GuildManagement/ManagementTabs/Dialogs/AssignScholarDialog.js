/* eslint-disable */
import { v4 as uuid_v4 } from 'uuid';
import { useEffect, useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';

// ** Import Material-Ui Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCrosshairs,
  faGamepad,
  faCoins,
} from '@fortawesome/free-solid-svg-icons';
import { walletAuthFetchWithSigPrompt } from '../../../../../helpers/apiFetchWrappers';
import ScholarOfferDialog from './ScholarOfferDialog';

const AssignScholarDialog = (props) => {
  const { open, handleClose, wipeSignatureAndReRequest, gamingNftId } = props;
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (tab) => {
    if (tab === 0) {
    }
    setSelectedTab(tab);
  };
  const { account, chainId } = useWeb3React();

  const [availableScholars, setAvailableScholars] = useState(null);
  const [availableScholarsFetched, setAvailableScholarsFetched] =
    useState(false);

  const [selectedScholar, setSelectedScholar] = useState(null);
  const [openScholarOffer, setOpenScholarOffer] = useState(false);

  const handleScholarOfferClose = async (event, success) => {
    setOpenScholarOffer(false);
    if (success) {
      handleClose();
    }
  };

  const handleScholarOfferOpen = async (scholar) => {
    setSelectedScholar(scholar);
    setOpenScholarOffer(true);
  };

  const [tavernData, setTavernData] = useState(null);

  const getTavernData = useCallback(async () => {
    try {
      const resp = await walletAuthFetchWithSigPrompt(
        `Tavern/AvailableScholars`,
        'GET',
        wipeSignatureAndReRequest,
        account,
        null,
        false,
        null
      );

      setTavernData(resp);
    } catch (error) {
      console.log('failed to fetch tavern data');
    }
  }, [account, wipeSignatureAndReRequest]);

  const getAvailableScholars = useCallback(async () => {
    try {
      const resp = await walletAuthFetchWithSigPrompt(
        `GuildManagement/GetAvailableScholars`,
        'GET',
        wipeSignatureAndReRequest,
        account,
        null,
        false,
        null
      );

      setAvailableScholars(resp);
      setAvailableScholarsFetched(true);
    } catch (error) {
      console.log('failed to fetch available Scholars');
    }
  }, [account, wipeSignatureAndReRequest]);

  useEffect(() => {
    async function init() {
      await getAvailableScholars();
    }
    if (account) {
      init();
    }
  }, [account]);

  const sourceOption = (name, tabIndex, icon) => {
    return (
      <Grid item lg={4} md={4} sm={4} xs={4}>
        <Button
          type="button"
          onClick={() => handleTabChange(tabIndex)}
          className={`scholarHireOption ${
            selectedTab === tabIndex ? 'selected' : ''
          }`}
        >
          {name}
          {icon}
        </Button>
      </Grid>
    );
  };

  function TabPanel(tabPanelProps) {
    const { children, index, classes } = tabPanelProps;

    return (
      <div
        role="tabpanel"
        hidden={selectedTab !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        className={`hireOptionPanel ${classes}`}
      >
        {selectedTab === index && <Box>{children}</Box>}
      </div>
    );
  }

  const Options = () => {
    return (
      <Grid
        item
        container
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className="scholarHireOptions"
      >
        {sourceOption('Scholars', 0, <FontAwesomeIcon icon={faCrosshairs} />)}
        {sourceOption('Tavern', 1, <FontAwesomeIcon icon={faGamepad} />)}
        {sourceOption('Contract', 2, <FontAwesomeIcon icon={faCoins} />)}
      </Grid>
    );
  };

  const ScholarRecord = (scholar) => {
    return (
      <Grid
        item
        container
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className="scholarRecord"
      >
        <Grid item lg={6} md={6} sm={6} xs={6} className="name">
          {scholar.name}
        </Grid>
        <Grid item lg={3} md={3} sm={3} xs={3} className="actions">
          <Button
            onClick={() => handleScholarOfferOpen(scholar)}
            className="accept"
          >
            Make Offer
          </Button>
        </Grid>
      </Grid>
    );
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      className="guildManagementModal assignScholarModal"
    >
      <DialogTitle id="max-width-dialog-title" style={{ textAlign: 'center' }}>
        Assign Scholar
      </DialogTitle>
      <DialogContent className="body">
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Options />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <TabPanel value={selectedTab} index={0} classes="scholarList">
              {availableScholars?.length > 0 &&
                availableScholars.map((schol) => ScholarRecord(schol))}

              <ScholarOfferDialog
                open={openScholarOffer}
                handleClose={handleScholarOfferClose}
                gamingNftId={gamingNftId}
                selectedScholar={selectedScholar}
                defaultCommissionRate={50}
              />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              <div>Coming soon...</div>
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
              <div>Coming soon...</div>
            </TabPanel>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignScholarDialog;
