/* eslint-disable react/destructuring-assignment */
import { useEffect, useState, useCallback } from 'react';
// import { BrowserView } from 'react-device-detect';
// import { v4 as uuid_v4 } from 'uuid';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import moment from 'moment';

import DataTable from 'react-data-table-component';

import { Button } from '@material-ui/core';

import { walletAuthFetchWithSigPrompt } from '../../../helpers/apiFetchWrappers';
import AcceptScholarOfferDialog from './Dialogs/AcceptScholarOfferDialog';
import SingleActionModal from '../../../components/SingleActionModal';
import AcceptWorkOfferDialog from './Dialogs/AcceptWorkOfferDialog';

const SearchContractForm = {
  MinCommission: null,
  MaxCommission: null,
  IncludeExpired: false,
  OrderByField: 'ListingCreated',
  OrderByDirection: 'desc',
  ResultsPerPage: 20,
  PageNo: 1,
};

const ContractList = (props) => {
  const {
    wipeSignatureAndReRequest,
    refreshList,
    setRefreshList,
    setCanCreateScholarOffer,
    setCanCreateWorkOffer,
  } = props;
  const [tavernData, setTavernData] = useState(null);

  const { account, chainId } = useWeb3React();

  // eslint-disable-next-line no-unused-vars
  const [tavernQuery, setTavernQuery] = useState(SearchContractForm);

  const [openModal, setOpenModal] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);

  const handleModalOpen = async (contract, modalName) => {
    setSelectedContract(contract);
    setOpenModal(modalName);
  };

  const getTavernData = useCallback(async () => {
    try {
      const query = tavernQuery;
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

      setTavernData(resp);
      setCanCreateScholarOffer(resp.canCreateScholarOffers);
      setCanCreateWorkOffer(resp.canCreateWorkOffer);
    } catch (error) {
      console.log('failed to fetch tavern data');
    }
  }, [
    account,
    setCanCreateScholarOffer,
    setCanCreateWorkOffer,
    tavernQuery,
    wipeSignatureAndReRequest,
  ]);

  const handleModalClose = async () => {
    setSelectedContract(null);
    setOpenModal(null);
    getTavernData();
  };

  const cancelWorkOffer = async () => {
    try {
      const options = {
        mode: 'cors',
      };

      const cancelResponse = await walletAuthFetchWithSigPrompt(
        `Tavern/CancelWorkOffer?contractId=${selectedContract.id}`,
        'DELETE',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        null
      );
      if (cancelResponse) {
        if (cancelResponse?.success) {
          toast.success('Work offer cancelled');
        } else {
          toast.error(cancelResponse.error);
        }
        handleModalClose();
      }
    } catch (error) {
      console.log('failed to cancel work offer');
    }
  };

  const cancelScholarOffer = async () => {
    try {
      const options = {
        mode: 'cors',
      };

      const cancelResponse = await walletAuthFetchWithSigPrompt(
        `Tavern/CancelScholarOffer?contractId=${selectedContract.id}`,
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
    getTavernData();
  }, [account, chainId, getTavernData, wipeSignatureAndReRequest, refreshList]);

  useEffect(() => {
    if (refreshList) {
      getTavernData();
      setRefreshList(false);
    }
  }, [getTavernData, refreshList, setRefreshList]);

  const columns = [
    {
      name: 'Contract Type',
      selector: (c) => c.contractType,
      center: true,
      sortable: true,
      cell: (row) => (
        <>
          {row.contractType === 0 && (
            <>
              <i className="fa-solid fa-user-graduate icon" />
              Scholar Offer
            </>
          )}
          {row.contractType === 1 && (
            <>
              <i className="fa-solid fa-briefcase" />
              Work Offer
            </>
          )}
        </>
      ),
    },
    {
      name: 'Hiring Guild / Player Name',
      selector: (c) => c.displayName,
      center: true,
      sortable: true,
    },
    {
      name: 'Guild Cut',
      selector: (c) => c.commissionRate,
      center: true,
      sortable: true,
      cell: (row) => <>{row.commissionRate}%</>,
    },
    {
      name: 'Listing Created',
      selector: (c) => c.listingCreated,
      center: true,
      sortable: true,
      cell: (row) => (
        <>{moment(row.listingCreated).format('Do MMMM YYYY HH:mm:ss')}</>
      ),
    },
    {
      name: '',
      width: '200px',
      displayName: '',
      cell: (row) => (
        <>
          {row.contractType === 0 && (
            <>
              {row.canAction && (
                <Button
                  onClick={() => handleModalOpen(row, 'AcceptScholarOffer')}
                >
                  Accept Offer
                </Button>
              )}
              {row.canCancel && (
                <Button
                  onClick={() => handleModalOpen(row, 'CancelScholarOffer')}
                  className="close"
                >
                  Cancel
                </Button>
              )}
            </>
          )}
          {row.contractType === 1 && (
            <>
              {row.canAction && (
                <Button onClick={() => handleModalOpen(row, 'AcceptWorkOffer')}>
                  Accept Offer
                </Button>
              )}
              {row.canCancel && (
                <Button
                  onClick={() => handleModalOpen(row, 'CancelWorkOffer')}
                  className="close"
                >
                  Cancel
                </Button>
              )}
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="contracts">
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box>
              <Grid>
                <div className="heading">Open Contracts</div>
                <DataTable
                  columns={columns}
                  data={tavernData?.contracts}
                  pagination
                  theme="solarized"
                  highlightOnHover
                  noDataComponent={
                    <div className="noContracts">
                      There are no active contracts at the moment...
                    </div>
                  }
                />
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </div>
      <AcceptScholarOfferDialog
        open={openModal === 'AcceptScholarOffer'}
        handleClose={handleModalClose}
        contract={selectedContract}
      />

      <AcceptWorkOfferDialog
        open={openModal === 'AcceptWorkOffer'}
        handleClose={handleModalClose}
        contract={selectedContract}
      />

      <SingleActionModal
        open={openModal === 'CancelWorkOffer'}
        handleClose={handleModalClose}
        messageWording="Are you sure you want to cancel the work offer?"
        action={cancelWorkOffer}
        modalTitle="Cancel Work Offer"
        actionWording="Cancel Work Offer"
        actionClass="close"
      />

      <SingleActionModal
        open={openModal === 'CancelScholarOffer'}
        handleClose={handleModalClose}
        messageWording="Are you sure you want to cancel the scholar offer?"
        action={cancelScholarOffer}
        modalTitle="Cancel Scholar Offer"
        actionWording="Cancel Scholar Offer"
        actionClass="close"
      />
    </>
  );
};

export default ContractList;
