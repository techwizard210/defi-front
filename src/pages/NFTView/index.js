/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import { useState, useEffect } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { useWeb3React } from '@web3-react/core';

import { BrowserView, MobileView } from 'react-device-detect';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import moment from 'moment';

import TimelineIcon from '@mui/icons-material/Timeline';

import { useParams } from 'react-router-dom';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import { toast } from 'react-toastify';

import { walletAuthFetchWithSigPrompt } from '../../helpers/apiFetchWrappers';
import LevelTrackDialog from './LevelTrackDialog';
import StakingDialog from './StakingDialog';
import CountdownTimer from '../../components/CountdownTimer';

import {
  _isValidChainId,
  getMinimumNFTStakeAmount,
  getTokenBalance,
  getNFTStakingContractInstance,
  parseBalance,
} from '../../helpers';

import { IntoTheHifiverseNFTContract } from '../../constants';

const NFTView = (props) => {
  const { wipeSignatureAndReRequest } = props;
  const { id, collection } = useParams();

  const { chainId, account } = useWeb3React();

  const [nftData, setNftData] = useState(null);
  const [stakingOptions, setStakingOptions] = useState(null);
  const [selectedStakingOption, setSelectedStakingOption] = useState(null);
  const [minDepositAmount, setMinDepositAmount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);

  // Dialogs
  const [open, setOpen] = useState(false);
  const [openStaking, setOpenStaking] = useState(false);

  const handleClose = async () => {
    setOpen(false);
  };

  const handleOpen = async () => {
    setOpen(true);
  };

  const handleStakingClose = async () => {
    setOpenStaking(false);
  };

  const handleStakingOpen = async (stakingOption) => {
    setSelectedStakingOption(stakingOption);
    setOpenStaking(true);
  };

  useEffect(() => {
    async function init() {
      const validChain = await _isValidChainId();
      if (!validChain) {
        toast.error('Unsupported network');
      } else {
        const url = `NFT/${collection}/${id}`;
        const resp = await walletAuthFetchWithSigPrompt(
          url,
          'GET',
          wipeSignatureAndReRequest,
          account,
          null,
          true,
          null
        );

        const minimumNFTStakeAmount = await getMinimumNFTStakeAmount();

        if (account) {
          const nftStakingContract = getNFTStakingContractInstance();
          const userPoolsForNFT = await nftStakingContract.methods
            .getUserPoolsForNFT(
              account,
              IntoTheHifiverseNFTContract,
              Number(id)
            )
            .call();

          const stakingOptionLength = await nftStakingContract.methods
            .getStakingOptionLength()
            .call();

          const contractStakingOptions = [];
          for (let j = 0; j < Number(stakingOptionLength); j++) {
            const so = await nftStakingContract.methods
              .stakingOptions(j)
              .call();
            contractStakingOptions.push(so);
          }

          for (let i = 0; i < userPoolsForNFT.length; i++) {
            const index = Number(userPoolsForNFT[i]);
            const matchingUserPool = await nftStakingContract.methods
              .getUserPoolInfo(Number(index))
              .call();
            const matchingPool = await nftStakingContract.methods
              .pools(Number(index) - 1)
              .call();

            // HIFI DTO STAKING OPTION
            const matchedDBStakingOption = resp.stakingOptions.find(
              (x) => x.index === Number(matchingPool.stakingOption)
            );

            if (matchedDBStakingOption != null) {
              matchedDBStakingOption.currentlyStaked = parseBalance(
                matchingUserPool.amount
              );

              const stakingOption =
                contractStakingOptions[matchedDBStakingOption.index];
              if (Number(stakingOption.duration) !== 0) {
                const unlockDate = new Date(
                  Number(matchingUserPool.vestingStart) * 1000
                );
                unlockDate.setSeconds(
                  unlockDate.getSeconds() + Number(stakingOption.duration)
                );
                matchedDBStakingOption.unlockDate = unlockDate;
                matchedDBStakingOption.unlockMilliseconds =
                  unlockDate - new Date();
              }
            }
          }

          if (resp?.levelInfo.hoursUntilNextLevel !== null) {
            const dt = new Date();
            dt.setSeconds(
              dt.getSeconds() + resp?.levelInfo.hoursUntilNextLevel * 3600
            );
            resp.levelInfo.dateOfNextLevel = dt;
          }
        }

        setNftData(resp);
        setStakingOptions(resp.stakingOptions);
        setMinDepositAmount(minimumNFTStakeAmount);
        setTokenBalance(await getTokenBalance());
      }
    }
    // fetchNFTData();
    init();
  }, [account, chainId, collection, id, wipeSignatureAndReRequest]);

  const stakingOption = (option) => (
    <Box key={uuid_v4()} className="stakingOption">
      <div className="optionTitle">{option.vestingPeriod}</div>
      <Grid
        container
        item
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className="detailsWrapper"
      >
        <Grid item lg={3} md={3} sm={6} xs={6}>
          <Grid container item lg={12} md={12} sm={12} xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12} className="detailHeader">
              Currently Staked
              <hr />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12} className="detailValue">
              {Number(option.currentlyStaked).toLocaleString()}
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={2} md={2} sm={6} xs={6}>
          <Grid container item lg={12} md={12} sm={12} xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12} className="detailHeader">
              XP Bonus
              <hr />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12} className="detailValue">
              {option.bonus}
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={6}>
          <Grid container item lg={12} md={12} sm={12} xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12} className="detailHeader">
              Locked Until
              <hr />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12} className="detailValue">
              {Number(option.currentlyStaked) > 0 &&
                option.unlockDate != null && (
                  <>
                    {moment(option.unlockDate).format('Do MMMM YYYY hh:mm:ss')}
                  </>
                )}
              {option.currentlyStaked <= 0 ||
                (option.unlockDate === null && <>N/A</>)}
            </Grid>
          </Grid>
        </Grid>

        <Grid item lg={3} md={3} sm={6} xs={6}>
          <Button
            onClick={() => handleStakingOpen(option)}
            className="stakeButton"
          >
            Deposit / Withdraw
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  const NFTProperties = () => (
    <CardContent className="propertiesWrapper">
      {nftData?.properties?.length > 0 &&
        nftData?.properties.map((prop) => (
          <Grid container key={uuid_v4()} className="prop">
            <Grid item lg={4} md={4} sm={6} xs={6} className="propSlot">
              {prop.slot}
            </Grid>
            <Grid item lg={8} md={8} sm={6} xs={6} className="propValue">
              {prop.value}{' '}
            </Grid>
          </Grid>
        ))}
    </CardContent>
  );

  const HeaderCard = () => (
    <Card className="headerCard">
      <CardContent>
        <Grid container>
          <Grid item lg={3} md={3} sm={12} xs={12}>
            <img
              src={
                `${process.env.REACT_APP_API_URL}/${nftData?.image}` ??
                `${process.env.REACT_APP_API_URL}/${nftData?.image}`
              }
              alt="nftImg"
              className="nftImg"
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item lg={8} md={8} sm={12} xs={12} className="nftInfoWrapper">
            <div className="name">{nftData?.name}</div>
            <div className="info tier">Tier: {nftData?.tierReadable}</div>
            {nftData?.levelInfo && (
              <div className="info">
                Total HiFi Staked:{' '}
                <span>{nftData?.levelInfo.tokensStaked.toLocaleString()}</span>
              </div>
            )}
            {nftData?.levelInfo.hoursUntilNextLevel !== null && (
              <div className="info">
                Time until next level:{' '}
                <span>
                  <CountdownTimer
                    expiryDateProp={nftData?.levelInfo.dateOfNextLevel}
                  />
                </span>
              </div>
            )}

            {nftData?.info?.length > 0 && (
              <Grid container className="infoBoxes">
                {nftData.info.map((info) => (
                  <Grid
                    key={uuid_v4()}
                    item
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    className="infoBox info"
                  >
                    <div className="header">
                      {info.title}
                      {info.type === 0 && (
                        <div className="levelTrack">
                          <TimelineIcon onClick={handleOpen} />
                        </div>
                      )}
                    </div>
                    <div className="info">{info?.value}</div>
                    {info.additionalInfo && (
                      <div className="info">{info.additionalInfo}</div>
                    )}
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <>
      <BrowserView className="nftView">
        <HeaderCard />

        <Grid container direction="row" spacing={2}>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Grid container>
              <Card className="propertiesCard">
                Properties
                <NFTProperties />
              </Card>
            </Grid>
          </Grid>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <Grid container>
              <Card className="stakingCard">
                Staking
                <div className="optionsWrapper">
                  {stakingOptions?.length > 0 &&
                    stakingOptions.map((option) => stakingOption(option))}
                </div>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </BrowserView>
      <MobileView className="nftView mobile">
        <HeaderCard />

        <Grid container direction="row" spacing={2}>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <Grid container>
              <Card className="propertiesCard">
                Properties
                <NFTProperties />
              </Card>
            </Grid>
          </Grid>
          <Grid item lg={8} md={8} sm={12} xs={12}>
            <Grid container>
              <Card className="stakingCard">
                Staking
                <div className="optionsWrapper">
                  {stakingOptions?.length > 0 &&
                    stakingOptions.map((option) => stakingOption(option))}
                </div>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </MobileView>
      <StakingDialog
        open={openStaking}
        handleClose={handleStakingClose}
        stakingOption={selectedStakingOption}
        minDepositAmount={minDepositAmount}
        nftIndex={id}
        tokenBalance={tokenBalance}
      />

      {nftData?.levelTrack && (
        <LevelTrackDialog
          open={open}
          handleClose={handleClose}
          levelTrack={nftData.levelTrack}
          currentLevel={nftData.levelInfo.currentLevel}
        />
      )}
    </>
  );
};

export default NFTView;
