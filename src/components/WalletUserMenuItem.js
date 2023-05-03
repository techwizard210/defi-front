import React from 'react';
import { Flex, UserMenuItem, WarningIcon } from '@pancakeswap/uikit';

const WalletUserMenuItem = ({ hasLowBnbBalance, onPresentWalletModal }) => {
  return (
    <UserMenuItem as="button" onClick={onPresentWalletModal}>
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        My Wallet
        {hasLowBnbBalance && <WarningIcon color="warning" width="24px" />}
      </Flex>
    </UserMenuItem>
  );
};

export default WalletUserMenuItem;
