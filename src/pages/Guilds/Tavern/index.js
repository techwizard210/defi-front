import { useState } from 'react';
import { isMobile } from 'react-device-detect';

import { Button, Grid } from '@material-ui/core';
import ContractList from './ContractList';
import ScholarOfferDialog from './Dialogs/ScholarOfferDialog';
import WorkOfferDialog from './Dialogs/WorkOfferDialog';

const Tavern = (props) => {
  const { wipeSignatureAndReRequest } = props;

  const [openModal, setOpenModal] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  const [canCreateScholarOffer, setCanCreateScholarOffer] = useState(false);
  const [canCreateWorkOffer, setCanCreateWorkOffer] = useState(false);

  const handleModalOpen = async (modalName) => {
    setOpenModal(modalName);
  };

  const handleModalClose = async () => {
    setOpenModal(null);
    setRefreshList(true);
  };

  return (
    <div className={`tavern ${isMobile ? 'mobile' : ''}`}>
      <Grid container>
        <Grid item lg={6} md={6} sm={6} xs={6} className="tavernAction">
          <Button
            onClick={() => handleModalOpen('ScholarOffer')}
            disabled={!canCreateScholarOffer}
          >
            <i className="fa-solid fa-user-graduate icon" />
            Create scholar offer
          </Button>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={6} className="tavernAction">
          <Button
            onClick={() => handleModalOpen('WorkOfferOffer')}
            disabled={!canCreateWorkOffer}
          >
            <i className="fa-solid fa-briefcase icon" />
            Create work offer
          </Button>
        </Grid>
      </Grid>
      <ContractList
        wipeSignatureAndReRequest={wipeSignatureAndReRequest}
        refreshList={refreshList}
        setRefreshList={setRefreshList}
        setCanCreateScholarOffer={setCanCreateScholarOffer}
        setCanCreateWorkOffer={setCanCreateWorkOffer}
      />

      <ScholarOfferDialog
        open={openModal === 'ScholarOffer'}
        handleClose={handleModalClose}
      />
      <WorkOfferDialog
        open={openModal === 'WorkOfferOffer'}
        handleClose={handleModalClose}
      />
    </div>
  );
};

export default Tavern;
