import { ConnectorNames } from '@pancakeswap/uikit';

import metaMaskIcon from '../../assets/img/metamask-icon.svg';
import trueWalletIcon from '../../assets/img/truewallet-icon.svg';

const connectors = [
  {
    title: 'MetaMask',
    icon: metaMaskIcon,
    connectorId: ConnectorNames.Injected,
  },
  {
    title: 'TrustWallet',
    icon: trueWalletIcon,
    connectorId: ConnectorNames.Injected,
  },
  // {
  //   title: 'WalletConnect',
  //   icon: WalletConnectIcon,
  //   connectorId: ConnectorNames.WalletConnect,
  // },
];

export default connectors;
export const connectorLocalStorageKey = 'connectorId';
