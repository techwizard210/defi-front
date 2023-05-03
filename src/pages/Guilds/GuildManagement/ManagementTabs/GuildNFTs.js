/* eslint-disable react/destructuring-assignment */
import { useState, useEffect, useCallback } from 'react';
import { BrowserView, MobileView } from 'react-device-detect';
import DataTable from 'react-data-table-component';
import { v4 as uuid_v4 } from 'uuid';
import moment from 'moment';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Button from '@mui/material/Button';

import { useWeb3React } from '@web3-react/core';

import { walletAuthFetchWithSigPrompt } from '../../../../helpers/apiFetchWrappers';
import AssignScholarDialog from '../../Dialogs/AssignScholarDialog';
import TerminateScholarDialog from '../../Dialogs/TerminateScholarDialog';

const GuildNFTs = () => {
  const [nftData, setNFTData] = useState(null);

  const { account } = useWeb3React();

  const [nftScholarsShownId, setNftScholarsShownId] = useState(null);
  const [selectedNft, setSelectedNft] = useState(null);
  const [openAssignScholar, setOpenAssignScholar] = useState(false);

  const getNFTsOverview = useCallback(async () => {
    try {
      const overviewResponse = await walletAuthFetchWithSigPrompt(
        `GuildManagement/NFTs`,
        'GET',
        null,
        account,
        null,
        true,
        null
      );
      if (overviewResponse) {
        setNFTData(overviewResponse);
      }
    } catch (error) {
      console.log('Unable to fetch guild nfts overview');
    }
  }, [account]);

  const handleAssignScholarClose = async () => {
    setOpenAssignScholar(false);
    getNFTsOverview();
  };

  const handleAssignScholarOpen = async (nft) => {
    setSelectedNft(nft);
    setNftScholarsShownId(nft.gamingNFTId);
    setOpenAssignScholar(true);
  };

  const [openTerminateScholarship, setOpenTerminateScholarship] =
    useState(false);
  const [nftSlot, setNftSlot] = useState(null);

  const handleTerminateScholarshipOpen = async (slot) => {
    setNftSlot(slot);
    setOpenTerminateScholarship(true);
  };

  const toggleScholarsShown = (nft) => {
    if (nftScholarsShownId === nft.gamingNFTId) {
      setNftScholarsShownId(null);
      setSelectedNft(null);
    } else {
      setNftScholarsShownId(nft.gamingNFTId);
      setSelectedNft(nft);
    }
  };

  const handleTerminateScholarshipClose = async () => {
    setOpenTerminateScholarship(false);
    getNFTsOverview();
  };

  useEffect(() => {
    async function init() {
      await getNFTsOverview();
    }
    if (account) {
      init();
    }
  }, [account, getNFTsOverview]);

  const nftInfoSection = (iconClass, title, value) => (
    <Grid item container lg={3} md={3} sm={3} xs={3} className="nftInfoSection">
      <Grid item container lg={12} md={12} sm={12} xs={12}>
        <Grid item container lg={3} md={3} sm={3} xs={3}>
          <div className="infoIconWrapper">
            <i className={`fa-solid ${iconClass}`} />
          </div>
        </Grid>
        <Grid
          item
          container
          lg={9}
          md={9}
          sm={9}
          xs={9}
          className="infoValueWrapper"
        >
          <Grid item lg={12} md={12} sm={12} xs={12} className="infoTitle">
            {title}
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12} className="infoValue">
            {value}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const scholarRow = (schol) => (
    <Grid
      key={uuid_v4()}
      item
      container
      lg={12}
      md={12}
      sm={12}
      xs={12}
      className="scholRow"
    >
      <Grid item container lg={2} md={2} sm={2} xs={2}>
        <Grid item lg={12} md={12} sm={12} xs={12} className="value">
          {schol.scholarship.playerName}
        </Grid>
      </Grid>
      <Grid item lg={2} md={2} sm={2} xs={2}>
        <Grid item lg={12} md={12} sm={12} xs={12} className="value">
          {moment(schol.scholarship.startDate).format('Do MMMM YYYY HH:mm:ss')}
        </Grid>
      </Grid>
      <Grid item lg={2} md={2} sm={2} xs={2}>
        <Grid item lg={12} md={12} sm={12} xs={12} className="value">
          {schol.scholarship.commissionRate}%
        </Grid>
      </Grid>
      <Grid item lg={2} md={2} sm={2} xs={2}>
        <Grid item lg={12} md={12} sm={12} xs={12} className="value">
          {schol.scholarship.totalHiFi}
        </Grid>
      </Grid>
      <Grid item lg={2} md={2} sm={2} xs={2}>
        <Grid item lg={12} md={12} sm={12} xs={12} className="value">
          {schol.scholarship.totalMerits}
        </Grid>
      </Grid>
      <Grid item lg={2} md={2} sm={2} xs={2}>
        <Grid item lg={12} md={12} sm={12} xs={12} className="value">
          <Button
            onClick={() => handleTerminateScholarshipOpen(schol)}
            className="close"
          >
            Terminate
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );

  const columns = [
    {
      name: 'Name',
      selector: (c) => c.name,
      center: true,
      sortable: true,
    },
    {
      name: 'Owner',
      selector: (c) => c.ownerName,
      center: true,
      sortable: true,
    },
    {
      name: 'Assigned Scholars',
      selector: (c) => c.assignedScholars,
      center: true,
      sortable: true,
      cell: (row) => (
        <>
          {row.assignedScholars} / {row.scholarSlots}
        </>
      ),
    },
    {
      name: 'Earned HiFi',
      selector: (c) => c.earnedHiFi,
      center: true,
      sortable: true,
      cell: (row) => <>{Number(row.earnedHiFi).toLocaleString()}</>,
    },
    {
      name: 'Earned Merits',
      selector: (c) => c.earnedMerits,
      center: true,
      sortable: true,
      cell: (row) => <>{Number(row.earnedMerits).toLocaleString()}</>,
    },
  ];

  const ExpandedComponent = ({ data }) => (
    <Grid
      item
      container
      lg={12}
      md={12}
      sm={12}
      xs={12}
      className="scholarsWrapper"
    >
      {data.assignedScholars < data.scholarSlots && (
        <Button onClick={() => handleAssignScholarOpen(data)}>
          Assign Scholar
        </Button>
      )}

      <Grid
        key={uuid_v4()}
        item
        container
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className="scholTitleRow"
      >
        <Grid item container lg={2} md={2} sm={2} xs={2}>
          <Grid item lg={12} md={12} sm={12} xs={12} className="value">
            Player Name
          </Grid>
        </Grid>
        <Grid item lg={2} md={2} sm={2} xs={2}>
          <Grid item lg={12} md={12} sm={12} xs={12} className="value">
            Date Started
          </Grid>
        </Grid>
        <Grid item lg={2} md={2} sm={2} xs={2}>
          <Grid item lg={12} md={12} sm={12} xs={12} className="value">
            Commission Rate
          </Grid>
        </Grid>
        <Grid item lg={2} md={2} sm={2} xs={2}>
          <Grid item lg={12} md={12} sm={12} xs={12} className="value">
            HiFi Earnings
          </Grid>
        </Grid>
        <Grid item lg={2} md={2} sm={2} xs={2}>
          <Grid item lg={12} md={12} sm={12} xs={12} className="value">
            Merit Earnings
          </Grid>
        </Grid>
        <Grid item lg={2} md={2} sm={2} xs={2}>
          <Grid item lg={12} md={12} sm={12} xs={12} className="value">
            Actions
          </Grid>
        </Grid>
      </Grid>
      {data?.slots?.length === 0 ||
        (data?.slots == null && (
          <Grid
            key={uuid_v4()}
            item
            container
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className="scholRow noScholars"
          >
            <Grid item lg={12} md={12} sm={12} xs={12} className="value">
              No scholars assigned to this NFT...
            </Grid>
          </Grid>
        ))}
      {data?.slots?.length > 0 && data?.slots.map((slot) => scholarRow(slot))}
    </Grid>
  );

  const nftItem = (nft) => {
    return (
      <Grid
        key={uuid_v4()}
        item
        container
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className="nftItem"
      >
        <Grid item lg={1} md={1} sm={1} xs={1}>
          <img
            src={`${process.env.REACT_APP_API_URL}/${nft.image}`}
            alt="nftImg"
            style={{ width: '100%' }}
          />
        </Grid>
        <Grid
          item
          container
          lg={11}
          md={11}
          sm={11}
          xs={11}
          className="nftInfoWrapper"
        >
          <Grid item container lg={12} md={12} sm={12} xs={12}>
            <Grid item lg={6} md={6} sm={6} xs={6} className="nftName">
              {nft.name}
            </Grid>
            <Grid item lg={3} md={3} sm={3} xs={3} className="ownedBy">
              Owner: {nft.ownerName}
            </Grid>
          </Grid>
          <Grid item container lg={12} md={12} sm={12} xs={12}>
            {nftInfoSection(
              'fa-users',
              'Assigned Scholars',
              `${nft.assignedScholars} / ${nft.scholarSlots}`
            )}
            {nftInfoSection('fa-user-graduate', 'Earned HiFi', nft.earnedHiFi)}
            {nftInfoSection(
              'fa-user-astronaut',
              'Earned Merits',
              nft.earnedMerits
            )}
            <Grid
              item
              container
              lg={3}
              md={3}
              sm={3}
              xs={3}
              className="nftInfoSection"
            >
              <Grid item container lg={12} md={12} sm={12} xs={12}>
                <Button onClick={() => toggleScholarsShown(nft)}>
                  {nftScholarsShownId === nft.gamingNFTId && (
                    <>Hide Scholarships</>
                  )}
                  {nftScholarsShownId !== nft.gamingNFTId && (
                    <>Show Scholarships</>
                  )}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {nft.gamingNFTId === nftScholarsShownId && (
          <Grid
            item
            container
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className="scholarsWrapper"
          >
            {nft.assignedScholars < nft.scholarSlots && (
              <Button onClick={() => handleAssignScholarOpen(nft)}>
                Assign Scholar
              </Button>
            )}

            <Grid
              key={uuid_v4()}
              item
              container
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="scholTitleRow"
            >
              <Grid item container lg={2} md={2} sm={2} xs={2}>
                <Grid item lg={12} md={12} sm={12} xs={12} className="value">
                  Player Name
                </Grid>
              </Grid>
              <Grid item lg={2} md={2} sm={2} xs={2}>
                <Grid item lg={12} md={12} sm={12} xs={12} className="value">
                  Date Started
                </Grid>
              </Grid>
              <Grid item lg={2} md={2} sm={2} xs={2}>
                <Grid item lg={12} md={12} sm={12} xs={12} className="value">
                  Commission Rate
                </Grid>
              </Grid>
              <Grid item lg={2} md={2} sm={2} xs={2}>
                <Grid item lg={12} md={12} sm={12} xs={12} className="value">
                  HiFi Earnings
                </Grid>
              </Grid>
              <Grid item lg={2} md={2} sm={2} xs={2}>
                <Grid item lg={12} md={12} sm={12} xs={12} className="value">
                  Merit Earnings
                </Grid>
              </Grid>
              <Grid item lg={2} md={2} sm={2} xs={2}>
                <Grid item lg={12} md={12} sm={12} xs={12} className="value">
                  Actions
                </Grid>
              </Grid>
            </Grid>
            {nft?.slots?.length === 0 ||
              (nft?.slots == null && (
                <Grid
                  key={uuid_v4()}
                  item
                  container
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className="scholRow noScholars"
                >
                  <Grid item lg={12} md={12} sm={12} xs={12} className="value">
                    No scholars assigned to this NFT...
                  </Grid>
                </Grid>
              ))}
            {nft?.slots?.length > 0 &&
              nft?.slots.map((slot) => scholarRow(slot))}
          </Grid>
        )}
      </Grid>
    );
  };

  return (
    <>
      <BrowserView className="nftSection">
        <div className="nftListWrapper">
          <div className="subHeading">Guild Owned NFTs</div>
          <Grid container>
            {nftData?.nfTs?.length > 0 &&
              nftData?.nfTs.map((nft) => nftItem(nft))}
          </Grid>
        </div>
      </BrowserView>
      <MobileView className="nftSection mobile">
        <div className="nftListWrapper">
          <div className="subHeading">Guild Owned NFTs</div>
          <DataTable
            columns={columns}
            data={nftData?.nfTs}
            pagination
            theme="solarized"
            highlightOnHover
            noDataComponent={
              <div className="noContracts">
                You have no NFT at the moment...
              </div>
            }
            expandableRows
            expandableRowsComponent={ExpandedComponent}
          />
        </div>
      </MobileView>

      {nftData && (
        <AssignScholarDialog
          open={openAssignScholar}
          handleClose={handleAssignScholarClose}
          gamingNftId={nftScholarsShownId}
          defaultCommissionRate={nftData.defaultCommission}
          gamingNft={selectedNft}
        />
      )}

      <TerminateScholarDialog
        open={openTerminateScholarship}
        handleClose={handleTerminateScholarshipClose}
        nftSlot={nftSlot}
      />
    </>
  );
};

export default GuildNFTs;
