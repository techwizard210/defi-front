import {
  CloseIcon,
  Heading,
  IconButton,
  ModalBody,
  ModalContainer,
  ModalHeader as UIKitModalHeader,
  ModalTitle,
} from '@pancakeswap/uikit';
import { parseUnits } from '@ethersproject/units';
import styled from 'styled-components';
import { FetchStatus, useGetBnbBalance } from '../hooks/useTokenBalance';
import WalletInfo from './WalletInfo';

export const WalletView = {
  WALLET_INFO: 'WALLET_INFO',
  TRANSACTIONS: 'TRANSACTIONS',
};

export const LOW_BNB_BALANCE = parseUnits('2', 'gwei');

const ModalHeader = styled(UIKitModalHeader)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
`;

const WalletModal = ({ onDismiss }) => {
  const { balance, fetchStatus } = useGetBnbBalance();
  const hasLowBnbBalance =
    fetchStatus === FetchStatus.SUCCESS && balance.lte(LOW_BNB_BALANCE);

  return (
    <ModalContainer title="Welcome!" minWidth="320px">
      <ModalHeader>
        <ModalTitle>
          <Heading>Your Wallet</Heading>
        </ModalTitle>
        <IconButton variant="text" onClick={onDismiss}>
          <CloseIcon width="24px" color="text" />
        </IconButton>
      </ModalHeader>
      <ModalBody p="24px" maxWidth="400px" width="100%">
        <WalletInfo hasLowBnbBalance={hasLowBnbBalance} onDismiss={onDismiss} />
      </ModalBody>
    </ModalContainer>
  );
};

export default WalletModal;
