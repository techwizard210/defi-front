import { InjectedConnector } from '@web3-react/injected-connector';
import { Networks } from './index';

export const injected = new InjectedConnector({
  supportedNetworks: Networks,
});
