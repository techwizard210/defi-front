import React from 'react';
import {
  Box,
  Button,
  Flex,
  LinkExternal,
  Message,
  Skeleton,
  Text,
} from '@pancakeswap/uikit';
import { useWeb3React } from '@web3-react/core';
import useTokenBalance, {
  FetchStatus,
  useGetBnbBalance,
} from '../hooks/useTokenBalance';
import useAuth from '../hooks/useAuth';
import { getBscScanLink } from '../utils';
import { getFullDisplayBalance, formatBigNumber } from '../utils/formatBalance';
import { TOKENS_BY_NETWORK } from '../constants';

const WalletInfo = ({ hasLowBnbBalance, onDismiss }) => {
  const { chainId, account } = useWeb3React();
  const { balance, fetchStatus } = useGetBnbBalance();
  const { balance: cakeBalance, fetchStatus: cakeFetchStatus } =
    useTokenBalance(TOKENS_BY_NETWORK[chainId][0].address);

  const { logout } = useAuth();

  const handleLogout = () => {
    onDismiss();
    logout();
  };

  return (
    <>
      <Text
        color="secondary"
        fontSize="12px"
        textTransform="uppercase"
        fontWeight="bold"
        mb="8px"
      >
        Your Address
      </Text>
      {hasLowBnbBalance && (
        <Message variant="warning" mb="24px">
          <Box>
            <Text fontWeight="bold">BNB Balance Low</Text>
            <Text as="p">You need BNB for transaction fees</Text>
          </Box>
        </Message>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">BNB Balance</Text>
        {fetchStatus !== FetchStatus.SUCCESS ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{formatBigNumber(balance, 6)}</Text>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text color="textSubtle">HIFI Balance</Text>
        {cakeFetchStatus !== FetchStatus.SUCCESS ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{getFullDisplayBalance(cakeBalance, 18, 3)}</Text>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="end" mb="24px">
        <LinkExternal href={getBscScanLink(account, 'address', chainId)}>
          View on BscScan
        </LinkExternal>
      </Flex>
      <Button variant="secondary" width="100%" onClick={handleLogout}>
        Disconnect Wallet
      </Button>
    </>
  );
};

export default WalletInfo;
