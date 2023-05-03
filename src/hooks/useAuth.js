import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { NoBscProviderError } from '@binance-chain/bsc-connector';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
// import {
//   UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
//   WalletConnectConnector,
// } from '@web3-react/walletconnect-connector';
import { toast } from 'react-toastify';

import { connectorLocalStorageKey } from '@pancakeswap/uikit';
import { connectorsByName } from '../utils/web3React';
import { setupNetwork } from '../utils/wallet';

const useAuth = () => {
  const { activate, deactivate } = useWeb3React();
  const dispatch = useDispatch();
  const login = useCallback(
    (connectorID) => {
      if (activate) {
        const connector = connectorsByName[connectorID];
        if (connector) {
          dispatch({
            type: 'SESSION',
            payload: null,
          });
          activate(connector, async (error) => {
            if (error instanceof UnsupportedChainIdError) {
              const hasSetup = await setupNetwork();
              if (hasSetup) {
                activate(connector);
              }
            } else {
              window.localStorage.removeItem(connectorLocalStorageKey);
              if (
                error instanceof NoEthereumProviderError ||
                error instanceof NoBscProviderError
              ) {
                toast.error('No provider was found');
              } else if (error instanceof UserRejectedRequestErrorInjected) {
                // if (connector instanceof WalletConnectConnector) {
                //   const walletConnector = connector;
                //   walletConnector.walletConnectProvider = null;
                // }
                toast.error('Please authorize to access your account');
              }
            }
          });
        } else {
          toast.error('The connector config is wrong');
        }
      }
    },
    [activate, dispatch]
  );

  const logout = useCallback(() => {
    if (deactivate) {
      deactivate();
      dispatch({
        type: 'SESSION_OUT',
        payload: null,
      });
      sessionStorage.removeItem('signin');
      sessionStorage.removeItem('token');
      localStorage.setItem('persistAccountOnReload', false);

      window.localStorage.removeItem(connectorLocalStorageKey);
    }
  }, [deactivate, dispatch]);

  return { login, logout };
};

export default useAuth;
