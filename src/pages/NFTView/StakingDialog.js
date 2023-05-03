/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

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

import moment from 'moment';

import { useWeb3React } from '@web3-react/core';

import { toast } from 'react-toastify';

// ** Import Images
import { parseUnits } from '@ethersproject/units';

import {
  getNFTStakingContractInstance,
  approveTokenToNFTStakeContract,
  _isValidChainId,
} from '../../helpers';

import { IntoTheHifiverseNFTContract } from '../../constants';

const StakingDailog = (props) => {
  const [isStakeProcessing, setIsStakeProcessing] = useState(false);
  const [isWithdrawProcessing, setIsWithdrawProcessing] = useState(false);

  const { control, setValue } = useForm();

  const {
    open,
    handleClose,
    stakingOption,
    minDepositAmount,
    nftIndex,
    tokenBalance,
  } = props;

  const [stakeAmount, setStakeAmount] = useState(0);

  const { account, chainId } = useWeb3React();

  const hasVesting =
    stakingOption?.bonus !== '' && stakingOption?.bonus !== 'None';

  const setWithdrawToMax = () => {
    if ((Number(stakingOption?.currentlyStaked) || 0) > 0) {
      setValue('WithdrawAmount', stakingOption?.currentlyStaked);
    }
  };

  const stakeTokens = async () => {
    if (!account || !chainId || !(await _isValidChainId())) {
      toast.error(`Unsupported network. Please Change Network`);
      return;
    }

    if (
      Number(stakeAmount) +
        (Number.parseInt(stakingOption?.currentlyStaked, 10) || 0) <
      Number(minDepositAmount)
    ) {
      toast.error(`Stake amount must be greater than ${minDepositAmount}`);
      return;
    }

    try {
      setIsStakeProcessing(true);
      const nftStakingContract = getNFTStakingContractInstance();
      const calculatedPrice = parseUnits(stakeAmount);
      await approveTokenToNFTStakeContract(calculatedPrice, account);
      await nftStakingContract.methods
        .deposit(
          stakingOption.index,
          IntoTheHifiverseNFTContract,
          Number(nftIndex),
          calculatedPrice
        )
        .send({ from: account });

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
    const withdrawAmount = control._formValues.WithdrawAmount;
    if (!account || !chainId || !(await _isValidChainId())) {
      toast.error(`Unsupported network. Please Change Network`);
      return;
    }

    if (withdrawAmount < 0) {
      toast.error(`Withdraw amount must be greater than 0`);
      return;
    }
    if (withdrawAmount > Number(stakingOption.currentlyStaked)) {
      toast.error(`Insufficient Balance to withdraw.`);
      return;
    }

    const remainingBalance =
      Number(stakingOption.currentlyStaked) - Number(withdrawAmount);

    if (remainingBalance !== 0 && remainingBalance < Number(minDepositAmount)) {
      toast.error(
        `Withdrawal Error - you must either empty the pool or leave at least ${Number(
          minDepositAmount
        )} $HiFi in the pool`
      );
      return;
    }
    try {
      setIsWithdrawProcessing(true);
      const nftStakingContract = getNFTStakingContractInstance();
      const calculatedPrice = parseUnits(withdrawAmount);
      await approveTokenToNFTStakeContract(calculatedPrice, account);

      const userPoolsForNFT = await nftStakingContract.methods
        .getUserPoolsForNFT(
          account,
          IntoTheHifiverseNFTContract,
          Number(nftIndex)
        )
        .call();

      let poolId = 0;

      for (let i = 0; i < userPoolsForNFT.length; i++) {
        const index = userPoolsForNFT[i];
        const poolToWithdrawFrom = await nftStakingContract.methods
          .pools(Number(index) - 1)
          .call();

        if (Number(poolToWithdrawFrom.stakingOption) === stakingOption.index) {
          poolId = index;
        }
      }

      await nftStakingContract.methods
        .withdraw(poolId, calculatedPrice)
        .send({ from: account });

      toast.success(`Successfully withdrawn ${calculatedPrice} tokens`);

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
      className="NFTStakingModal"
    >
      <DialogTitle id="max-width-dialog-title" className="title">
        Stake / Unstake to NFT
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <div className="stakingOptionName">
              {stakingOption?.vestingPeriod}
              {hasVesting && <> - {stakingOption?.bonus} Bonus XP</>}
            </div>
          </Grid>

          <Grid item xs>
            <Box m={2}>
              <TextField
                margin="dense"
                label="HiFi Balance"
                fullWidth
                value={parseFloat(
                  tokenBalance?.toLocaleString(undefined, {
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
                margin="dense"
                label="HiFi Staked"
                fullWidth
                value={Number(stakingOption?.currentlyStaked) || 0}
                InputProps={{
                  readOnly: true,
                }}
                onClick={() => setWithdrawToMax()}
                className="stakedAmount"
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
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                InputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  inputProps: {
                    min: Number.parseInt(minDepositAmount, 10),
                  },
                }}
                helperText={`Stake at least ${Number.parseInt(
                  minDepositAmount,
                  10
                )}`}
              />

              <Button
                onClick={stakeTokens}
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
              {stakingOption?.unlockDate === null}
              {(stakingOption?.unlockDate === null ||
                stakingOption?.unlockMilliseconds <= 0) &&
                stakingOption?.currentlyStaked > 0 && (
                  <form>
                    <Controller
                      render={({ field }) => (
                        <TextField
                          autoFocus
                          margin="dense"
                          label="Withdraw Amount"
                          type="number"
                          fullWidth
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          variant="filled"
                          helperText="Click on staked amount to set to max"
                          className="withdraw"
                        />
                      )}
                      control={control}
                      name="WithdrawAmount"
                      defaultValue=""
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
                  </form>
                )}
              {stakingOption?.currentlyStaked === 0 && (
                <div className="lockedHiFiWrapper">
                  <div className="lockedHiFiBlocker">
                    <div className="lockedTitle">
                      Can&apos;t withdraw - You have no $HiFi Staked into this
                      option
                    </div>
                  </div>
                  <TextField
                    margin="dense"
                    label="Withdraw Amount"
                    fullWidth
                    value={0}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Button variant="contained" color="primary">
                    {!isWithdrawProcessing ? (
                      'Withdraw'
                    ) : (
                      <>
                        <CircularProgress color="secondary" size={20} />
                      </>
                    )}
                  </Button>
                </div>
              )}
              {stakingOption?.unlockMilliseconds >= 0 && (
                <div className="lockedHiFiWrapper">
                  <div className="lockedHiFiBlocker">
                    <div className="lockedTitle">$HiFi Locked, unlocks</div>
                    <div className="lockedUntil">
                      {moment(stakingOption.unlockDate).format(
                        'Do MMMM YYYY hh:mm:ss'
                      )}
                    </div>
                  </div>
                  <TextField
                    margin="dense"
                    label="Withdraw Amount"
                    fullWidth
                    value={0}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Button variant="contained" color="primary">
                    {!isWithdrawProcessing ? (
                      'Withdraw'
                    ) : (
                      <>
                        <CircularProgress color="secondary" size={20} />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Box>
          </Grid>
          {hasVesting && stakingOption?.currentlyStaked > 0 && (
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <div className="stakingOptionVestingWarning">
                <>
                  By staking more $HiFi into this option, you will reset the
                  unlock date for all the $HiFi in this pool.
                  <br />
                  <br />
                  The vesting period is : {stakingOption?.vestingPeriod}
                </>
              </div>
            </Grid>
          )}
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
