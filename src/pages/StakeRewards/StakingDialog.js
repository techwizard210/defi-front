import { useState } from 'react';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useWeb3React } from '@web3-react/core';

import { toast } from 'react-toastify';

// ** Import Images
import { parseUnits } from '@ethersproject/units';

import {
  getGameFactoryContractInstance,
  approveTokenToContract,
  _isValidChainId,
} from '../../helpers';

const StakingDailog = (props) => {
  const [isStakeProcessing, setIsStakeProcessing] = useState(false);
  const [isWithdrawProcessing, setIsWithdrawProcessing] = useState(false);

  const { open, state, handleClose, setStakeAmount, setWithdrawAmount } = props;

  const { account, chainId } = useWeb3React();

  const sendStakeToken = async () => {
    if (!account || !chainId || !(await _isValidChainId())) {
      toast.error(`Unsupported network. Please Change Network`);
      return;
    }

    const actionType = 2;
    const minimumRequiredAmount = state.minAmountForEarn;
    const { stakeAmount } = state;

    if (Number(stakeAmount) < Number(minimumRequiredAmount)) {
      toast.error(`Stake amount must be greater that ${minimumRequiredAmount}`);
      return;
    }

    try {
      setIsStakeProcessing(true);
      const factoryContract = getGameFactoryContractInstance();
      const calculatedPrice = parseUnits(stakeAmount);
      await approveTokenToContract(calculatedPrice, state.userAddress);
      await factoryContract.methods
        .stakeTokens(actionType, calculatedPrice)
        .send({ from: state.userAddress });

      toast.success(`Successfully staked ${stakeAmount} tokens`);

      setIsStakeProcessing(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error(
        err.message
          ? err.message
          : `Transaction Failed. Please make sure you have sufficient balance and Minimum Balance`
      );
    }
    setIsStakeProcessing(false);
  };

  const withdrawToken = async () => {
    if (!account || !chainId || !(await _isValidChainId())) {
      toast.error(`Unsupported network. Please Change Network`);
      return;
    }
    const actionType = 2;
    const stakedAmount = state.stakedAmount[1];
    if (state.withdrawAmount < 0) {
      toast.error(`Withdraw amount must be greater than 0`);
      return;
    }
    if (state.withdrawAmount > Number(stakedAmount)) {
      toast.error(`Insufficient Balance to withdraw.`);
      return;
    }
    try {
      setIsWithdrawProcessing(true);
      const factoryContract = getGameFactoryContractInstance();
      const calculatedPrice = parseUnits(state.withdrawAmount);
      await approveTokenToContract(state.withdrawAmount, state.userAddress);
      await factoryContract.methods
        .withdrawStakedToken(actionType, calculatedPrice)
        .send({ from: state.userAddress });

      toast.success(`Successfully withdrawn ${state.withdrawAmount} tokens`);

      setIsWithdrawProcessing(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error(
        err.message
          ? err.message
          : `Transaction Failed. Please make sure you have sufficient balance and Minimum Balance`
      );
    }
    setIsWithdrawProcessing(false);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="max-width-dialog-title" style={{ textAlign: 'center' }}>
        Stake / Unstake for EARN
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs>
            <Box m={2}>
              <TextField
                autoFocus
                margin="dense"
                label="HiFi Balance"
                fullWidth
                value={parseFloat(
                  state.tokenBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })
                )}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs>
            <Box m={2}>
              <TextField
                autoFocus
                margin="dense"
                label="HiFi Staked"
                fullWidth
                value={Number.parseInt(state.stakedAmount[1], 10) || 0}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs>
            <Box m={2}>
              <TextField
                autoFocus
                margin="dense"
                label="Stake Amount"
                fullWidth
                type="number"
                value={state.stakeAmount}
                onChange={setStakeAmount}
                InputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  inputProps: {
                    min: Number.parseInt(state.minAmountForEarn, 10),
                  },
                }}
                helperText={`Stake at least ${Number.parseInt(
                  state.minAmountForEarn,
                  10
                )} to enable ${state.actionType}`}
              />

              <Button
                onClick={sendStakeToken}
                variant="contained"
                color="secondary"
              >
                {!isStakeProcessing ? (
                  'Stake'
                ) : (
                  <>
                    <CircularProgress color="primary" size={20} />
                  </>
                )}
              </Button>
            </Box>
          </Grid>
          <Grid item xs>
            <Box m={2}>
              <TextField
                autoFocus
                margin="dense"
                label="Withdraw Amount"
                type="number"
                fullWidth
                value={state.withdrawAmount}
                onChange={setWithdrawAmount}
                variant="filled"
                helperText="* 4% withdrawal fee"
              />
              <Button
                onClick={withdrawToken}
                variant="contained"
                color="primary"
              >
                {!isWithdrawProcessing ? (
                  'Withdraw'
                ) : (
                  <>
                    <CircularProgress color="secondary" size={20} />
                  </>
                )}
              </Button>
            </Box>
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

export default StakingDailog;
