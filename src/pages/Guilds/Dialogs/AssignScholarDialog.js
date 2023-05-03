/* eslint-disable react/destructuring-assignment */
import { useEffect, useState, useCallback } from 'react';
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
import Box from '@material-ui/core/Box';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCrosshairs,
  faGamepad,
  faCoins,
} from '@fortawesome/free-solid-svg-icons';
import { walletAuthFetchWithSigPrompt } from '../../../helpers/apiFetchWrappers';
import ScholarOfferDialog from './ScholarOfferDialog';
import AssignScholarAcceptWorkOfferDialog from './AssignScholarAcceptWorkOfferDialog';
import AssignScholarCreateScholarOfferDialog from './AssignScholarCreateSholarOfferDialog';
import SingleActionModal from '../../../components/SingleActionModal';

const SearchContractForm = {
  MinCommission: null,
  MaxCommission: null,
  IncludeExpired: false,
  OrderByField: 'CommissionRate',
  OrderByDirection: 'desc',
  ResultsPerPage: 20,
  PageNo: 1,
};

const AssignScholarDialog = (props) => {
  const {
    open,
    handleClose,
    wipeSignatureAndReRequest,
    gamingNftId,
    defaultCommissionRate,
    gamingNft,
  } = props;
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };
  const { account } = useWeb3React();

  const [availableScholars, setAvailableScholars] = useState(null);

  const [openModal, setOpenModal] = useState(null);
  const [selectedScholOffer, setSelectedScholOffer] = useState(null);

  const handleModalOpen = async (contract, modalName) => {
    setSelectedScholOffer(contract);
    setOpenModal(modalName);
  };

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

  const [selectedContract, setSelectedContract] = useState(null);
  const [openWorkOffer, setOpenWorkOffer] = useState(false);

  const handleAcceptWorkOfferClose = async (event, success) => {
    setOpenWorkOffer(false);
    if (success) {
      handleClose();
    }
  };

  const handleAcceptWorkOfferOpen = async (contract) => {
    setSelectedContract(contract);
    setOpenWorkOffer(true);
  };

  const [openCreateContract, setOpenCreateContract] = useState(false);

  const handleCreateContractClose = async (event, success) => {
    setOpenCreateContract(false);
    if (success) {
      handleClose();
    }
  };

  const handleCreateContractOpen = async (contract) => {
    setSelectedContract(contract);
    setOpenCreateContract(true);
  };

  // eslint-disable-next-line no-unused-vars
  const [tavernData, setTavernData] = useState(null);
  const [workOffers, setWorkOffers] = useState(null);
  const [scholarOffers, setScholarOffers] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [tavernQuery, setTavernQuery] = useState(SearchContractForm);

  const getTavernData = useCallback(async () => {
    try {
      const query = tavernQuery;
      query.NftId = gamingNftId;
      const options = {
        mode: 'cors',
        body: JSON.stringify(query),
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const resp = await walletAuthFetchWithSigPrompt(
        `Tavern/Overview`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        true,
        headers
      );

      setScholarOffers(resp.contracts.filter((c) => c.contractType === 0));
      setWorkOffers(resp.contracts.filter((c) => c.contractType === 1));
      setTavernData(resp);
    } catch (error) {
      console.log('failed to fetch tavern data');
    }
  }, [account, gamingNftId, tavernQuery, wipeSignatureAndReRequest]);

  const handleModalClose = async () => {
    setSelectedScholOffer(null);
    setOpenModal(null);
    getTavernData();
  };

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
    } catch (error) {
      console.log('failed to fetch available Scholars');
    }
  }, [account, wipeSignatureAndReRequest]);

  const cancelScholarOffer = async () => {
    try {
      const options = {
        mode: 'cors',
      };

      const cancelResponse = await walletAuthFetchWithSigPrompt(
        `Tavern/CancelScholarOffer?contractId=${selectedScholOffer.id}`,
        'DELETE',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        null
      );
      if (cancelResponse) {
        if (cancelResponse?.success) {
          toast.success('Scholar offer cancelled');
        } else {
          toast.error(cancelResponse.error);
        }
        handleModalClose();
      }
    } catch (error) {
      console.log('failed to cancel scholar offer');
    }
  };

  useEffect(() => {
    async function init() {
      await getAvailableScholars();
      await getTavernData();
    }
    if (account && open) {
      init();
    }
  }, [account, getAvailableScholars, getTavernData, open]);

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

  const ScholarRecord = (scholar) => (
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

  const WorkOfferRecord = (workOffer) => {
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
          {workOffer.displayName}
        </Grid>
        <Grid item lg={3} md={3} sm={3} xs={3} className="name">
          {workOffer.commissionRate}%
        </Grid>
        <Grid item lg={3} md={3} sm={3} xs={3} className="actions">
          <Button
            onClick={() => handleAcceptWorkOfferOpen(workOffer)}
            className="accept"
          >
            Accept Work Offer
          </Button>
        </Grid>
      </Grid>
    );
  };

  const ScholarOfferRecord = (scholOffer) => {
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
          Taven Scholar Offer
        </Grid>
        <Grid item lg={3} md={3} sm={3} xs={3} className="name">
          {scholOffer.commissionRate}%
        </Grid>
        <Grid item lg={3} md={3} sm={3} xs={3} className="actions">
          <Button
            onClick={() => handleModalOpen(scholOffer, 'CancelScholarOffer')}
            className="close"
          >
            Cancel
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
      className={`guildManagementModal assignScholarModal ${
        isMobile ? 'mobile' : ''
      }`}
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

              {availableScholars?.length === 0 && (
                <span className="emptyList">No available scholars...</span>
              )}

              <ScholarOfferDialog
                open={openScholarOffer}
                handleClose={handleScholarOfferClose}
                gamingNftId={gamingNftId}
                selectedScholar={selectedScholar}
                defaultCommissionRate={defaultCommissionRate}
              />
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              {workOffers?.length > 0 &&
                workOffers.map((wo) => WorkOfferRecord(wo))}

              {workOffers?.length === 0 && (
                <span className="emptyList">No work offers listed...</span>
              )}

              <AssignScholarAcceptWorkOfferDialog
                open={openWorkOffer}
                handleClose={handleAcceptWorkOfferClose}
                wipeSignatureAndReRequest={wipeSignatureAndReRequest}
                contract={selectedContract}
                gamingNftId={gamingNftId}
              />
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
              <Grid
                item
                container
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className="headerRow"
              >
                <Grid item lg={6} md={6} sm={6} xs={6} className="name">
                  Contract Type
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3} className="name">
                  Commission
                </Grid>
                <Grid item lg={3} md={3} sm={3} xs={3} className="actions" />
              </Grid>

              {scholarOffers?.length > 0 &&
                scholarOffers.map((so) => ScholarOfferRecord(so))}

              {scholarOffers?.length === 0 && (
                <span className="emptyList">
                  No scholar offers currently listed...
                </span>
              )}

              {gamingNft?.assignedScholars + scholarOffers?.length <
                gamingNft?.scholarSlots && (
                <div>
                  <Button onClick={handleCreateContractOpen}>
                    Create Contract
                  </Button>
                  <AssignScholarCreateScholarOfferDialog
                    open={openCreateContract}
                    handleClose={handleCreateContractClose}
                    wipeSignatureAndReRequest={wipeSignatureAndReRequest}
                    selectedNft={gamingNft}
                  />
                </div>
              )}

              <SingleActionModal
                open={openModal === 'CancelScholarOffer'}
                handleClose={handleModalClose}
                messageWording="Are you sure you want to cancel the scholar offer?"
                action={cancelScholarOffer}
                modalTitle="Cancel Scholar Offer"
                actionWording="Cancel Scholar Offer"
                actionClass="close"
              />
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
