/* eslint-disable */
import { useState, useEffect, useCallback } from 'react';
import DataTable from 'react-data-table-component';
import { parseUnits } from '@ethersproject/units';

import Grid from '@material-ui/core/Grid';

import { toast } from 'react-toastify';

import { useWeb3React } from '@web3-react/core';

// ** Import Assets
import useStyles from '../../../assets/styles';

import { walletAuthFetchWithSigPrompt } from '../../../helpers/apiFetchWrappers';

import { getGameFactoryContractInstance, parseBalance } from '../../../helpers';

const Rewards = () => {
  const [errMsg, setErrorMsg] = useState('');

  const { chainId, library, active, account } = useWeb3React();
  const [isAllowReward, setIsAllowReward] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared] = useState(false);

  const [pendingRewards, setPendingRewards] = useState(null);

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const classes = useStyles.profile();

  const columns = [
    {
      name: 'User Address',
      selector: 'walletId',
      center: true,
      sortable: true,
    },
    {
      name: 'Name',
      selector: 'name',
      center: true,
      sortable: true,
    },
    {
      name: 'Amount Staked',
      selector: 'earnStake',
      center: true,
      sortable: true,
    },
    {
      name: 'APR Earnings',
      selector: 'passive',
      center: true,
      sortable: true,
    },
    {
      name: 'Boost Rewards',
      selector: 'boost',
      center: true,
      sortable: true,
    },
    {
      name: 'Tokens',
      selector: 'lotteryTickets',
      center: true,
      sortable: true,
      width: '200px',
      cell: (row) => (
        <div>
          <div>{`Earnings Tokens: ${row.earningsTokens}`}</div>
          <div>{`Raffle Tickets: ${row.lotteryTickets}`}</div>
        </div>
      ),
    },
    {
      name: 'Gaming Rewards',
      selector: 'gaming',
      center: true,
      sortable: true,
    },
    {
      name: 'Scholar Rewards',
      selector: 'scholar',
      center: true,
      sortable: true,
    },
    {
      name: 'Competition Rewards',
      selector: 'competition',
      center: true,
      sortable: true,
    },
    {
      name: 'Rewarded Amount',
      selector: 'totalValue',
      center: true,
      sortable: true,
      width: '200px',
    },
  ];

  const syncRewardsToDB = async () => {
    try {
      const resp = await walletAuthFetchWithSigPrompt(
        `Rewards/ProcessEarnings`,
        'GET',
        null,
        account,
        null,
        false,
        null
      );
      if (resp.success) {
        toast.success('Successfully sync reward states');
      } else {
        toast.success('Unabled to sync reward states');
      }
    } catch (error) {
    }
  };

  const allowReward = async () => {
    if (selectedRows.length > 0) {
      if (
        window.confirm(
          'Do you really want to allocate rewards to all users listed below?? '
        )
      ) {
        if (active) {
          setIsAllowReward(true);
          const factoryContract = getGameFactoryContractInstance();

          try {
            const usersList = [];
            const priceList = [];

            // eslint-disable-next-line array-callback-return
            selectedRows.map((item) => {
              usersList.push(item.walletId);
              priceList.push(parseUnits(item.totalValue.toString()));
              // await myfirebase.collection('rewards').add(item);
            });

            if (usersList.length > 0)
              factoryContract.methods
                .batchAddRewardCandidates(usersList, priceList)
                .send({ from: account })
                .then(async () => {
                  toast.success('Successfully processed rewards');
                  await syncRewardsToDB();
                  setIsAllowReward(false);
                })
                .catch((err) => {
                  setIsAllowReward(false);
                  if (err.data && err.data.message)
                    toast.error(err.data.message);
                });
          } catch (err) {
            toast.error(
              'Could not add the candidates. Please make sure Metamask is connected'
            );
            setIsAllowReward(false);
          }
        }
      }
    } else {
      toast.error('Cannot find candidate lists. Please calculate reward first');
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      const resp = await walletAuthFetchWithSigPrompt(
        'Rewards/GetPendingEarnings',
        'GET',
        true,
        account,
        null,
        false,
        null
      );
      if (resp) {
        setPendingRewards(resp);
      }
    };

    async function init() {
      await fetchAllData();
    }
    if (account) {
      init();
    }
  }, [account]);

  const statSectionHeader = (title, value) => {
    return (
      <Grid
        item
        container
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className="Headline"
        justifyContent="center"
      >
        {title}: {value}
      </Grid>
    );
  };

  const statSectionRow = (title, value, percent) => {
    return (
      <Grid
        item
        container
        lg={12}
        md={12}
        sm={12}
        xs={12}
        className="substat"
        justifyContent="center"
      >
        <Grid item lg={4} md={4} sm={6} xs={6} className="title">
          {title}:
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={6} className="date">
          {value}
        </Grid>
        <Grid item lg={4} md={4} sm={6} xs={6} className="pecentage">
          {percent && <>{percent}%</>}
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <div className="pageHeading">
        <span>Pending Rewards</span>
      </div>

      {pendingRewards && (
        <>
          <Grid container item lg={12} md={12} sm={12} xs={12} spacing={2}>
            <Grid item lg={4} md={4} sm={4} xs={4} className="headlinerPadding">
              <div className="headlinerWrapper">
                {statSectionHeader(
                  'Total HiFi',
                  pendingRewards.totalValue.toLocaleString()
                )}
                <hr />
                {statSectionRow(
                  'APR',
                  pendingRewards.apr?.toLocaleString(),
                  pendingRewards.aprPercentage
                )}
                {statSectionRow(
                  'Gaming',
                  pendingRewards.gaming?.toLocaleString(),
                  pendingRewards.gamingPercentage
                )}
                {statSectionRow(
                  'Scholar',
                  pendingRewards.scholar?.toLocaleString(),
                  pendingRewards.scholarPercentage
                )}
                {statSectionRow(
                  'Lottery',
                  pendingRewards.lottery?.toLocaleString(),
                  pendingRewards.lotteryPercentage
                )}
                {statSectionRow(
                  'Competition',
                  pendingRewards.competition?.toLocaleString(),
                  pendingRewards.competitionPercentage
                )}
              </div>
            </Grid>
            <Grid
              container
              item
              lg={4}
              md={4}
              sm={4}
              xs={4}
              className="headlinerPadding"
            >
              <div className="headlinerWrapper">
                {statSectionHeader(
                  'Total Players',
                  pendingRewards.totalPlayers?.toLocaleString()
                )}
                <hr />
                {statSectionRow(
                  'Earn Players',
                  pendingRewards.totalEarnPlayers?.toLocaleString(),
                  pendingRewards.totalEarnPercentage
                )}
                {statSectionRow(
                  'Free Players',
                  pendingRewards.totalFreePlayers?.toLocaleString(),
                  pendingRewards.totalFreePercentage
                )}
              </div>
            </Grid>
            <Grid
              container
              item
              lg={4}
              md={4}
              sm={4}
              xs={4}
              className="headlinerPadding"
            >
              <div className="headlinerWrapper">
                {statSectionHeader(
                  'Total Tokens',
                  pendingRewards.totalTokens?.toLocaleString()
                )}
                <hr />
                {statSectionRow(
                  'Earning',
                  pendingRewards.earningsTokens?.toLocaleString(),
                  pendingRewards.earningsTokensPercentage
                )}
                {statSectionRow(
                  'Lottery',
                  pendingRewards.lotteryTickets?.toLocaleString(),
                  pendingRewards.lotteryTicketsPercentage
                )}
              </div>
            </Grid>
          </Grid>

          <div className="processRewardsButtonWrapper">
            <button
              type="button"
              className="processRewardsButton"
              onClick={() => allowReward()}
            >
              Process Rewards
            </button>
          </div>
          <DataTable
            columns={columns}
            data={pendingRewards.pendingRewards}
            pagination
            selectableRows
            theme="solarized"
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggleCleared}
          />
        </>
      )}
    </>
  );
};

export default Rewards;
