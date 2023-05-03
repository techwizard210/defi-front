import { useState, useEffect } from 'react';

// ** Import Material-Ui Components
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';

import {
  getBNBBalance,
  getTokenBalance,
  getUserStakingAmount,
  getDefaultAddres,
  getBaseStakeAmountForEarn,
  getGoldItemPrice,
  getSilverItemPrice,
  getBronzeItemPrice,
  getWithdrawFee,
  _isValidChainId,
} from '../../helpers';
import { MINIMUM_BALANCE_FOR_EARN, ITEM_PRICE } from '../../constants';

import { getEarningSettings } from '../../helpers/databaseHelpers';

import useStyles from '../../assets/styles';

import StakeList from './StakeList';
import StakingDialog from './StakingDialog';
import Mining from './Mining';

const StakeRewards = () => {
  const classes = useStyles.stakerewards();
  const backdrops = useStyles.backdrop();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { chainId, account } = useWeb3React();

  const [state, setUserState] = useState({
    userAddress: '',
    stakedAmount: '0',
    stakeAmount: '0',
    withdrawAmount: '0',
    bnbBalance: '0',
    tokenBalance: '0',
    actionType: 'PLAY',
    withdrawFee: '4',
    minAmountForEarn: MINIMUM_BALANCE_FOR_EARN,
    itemPrice: ITEM_PRICE,
    chainId,
    earnApr: null,
  });

  const setStakeAmount = (e) => {
    setUserState({
      ...state,
      stakeAmount: e.target.value,
    });
  };

  const setWithdrawAmount = (e) => {
    setUserState({
      ...state,
      withdrawAmount: e.target.value,
    });
  };

  const handleCloseBackdrop = () => {
    setLoading(false);
  };

  const stakeToken = async (e, item) => {
    e.preventDefault();
    setLoading(true);
    setUserState({
      ...state,
      actionType: item,
    });
    setOpen(true);
    setLoading(false);
  };

  const handleClose = async () => {
    setOpen(false);
  };

  useEffect(() => {
    async function init() {
      const validChain = await _isValidChainId();
      if (!validChain) {
        toast.error('Unsupported network');
      } else {
        const stakeTokens = await getUserStakingAmount();
        const defaultBalance = await getBNBBalance();
        const tokenBalance = await getTokenBalance();
        const userAddress = await getDefaultAddres();
        const minAmountForEarn = await getBaseStakeAmountForEarn();
        const goldPrice = await getGoldItemPrice();
        const silverPrice = await getSilverItemPrice();
        const bronzePrice = await getBronzeItemPrice();
        const withdrawFee = await getWithdrawFee();
        const earningSettings = await getEarningSettings();
        setUserState({
          userAddress,
          stakedAmount: stakeTokens,
          bnbBalance: defaultBalance,
          tokenBalance,
          withdrawFee,
          minAmountForEarn,
          itemPrice: [goldPrice, silverPrice, bronzePrice],
          earnApr: Number(
            Number(earningSettings.APR * earningSettings.APRMultiplier).toFixed(
              2
            )
          ),
        });
      }
    }
    async function initNoAccount() {
      const validChain = await _isValidChainId();
      if (!validChain) {
        toast.error('Unsupported network');
      } else {
        const minAmountForEarn = await getBaseStakeAmountForEarn();
        const goldPrice = await getGoldItemPrice();
        const silverPrice = await getSilverItemPrice();
        const bronzePrice = await getBronzeItemPrice();
        const withdrawFee = await getWithdrawFee();
        const earningSettings = await getEarningSettings();
        const newState = { ...state };
        newState.withdrawFee = withdrawFee;
        newState.minAmountForEarn = minAmountForEarn;
        newState.itemPrice = [goldPrice, silverPrice, bronzePrice];
        newState.earnApr = Number(
          Number(earningSettings.APR * earningSettings.APRMultiplier).toFixed(2)
        );

        setUserState(newState);
      }
    }
    if (account) {
      init();
    } else {
      initNoAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <>
      <Box className={`${classes.root} ${classes.padMeUp}`}>
        <StakeList
          stakeToken={stakeToken}
          earnApr={state.earnApr}
          minForEarn={Number(state.minAmountForEarn).toLocaleString(0)}
        />
        <Mining state={state} />
        <StakingDialog
          open={open}
          state={state}
          handleClose={handleClose}
          setStakeAmount={setStakeAmount}
          setWithdrawAmount={setWithdrawAmount}
        />
      </Box>
      <Backdrop
        className={backdrops.backdrop}
        open={isLoading}
        onClick={handleCloseBackdrop}
        style={{ zIndex: 999999 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default StakeRewards;
