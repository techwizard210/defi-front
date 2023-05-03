import { lazy, useEffect, useState, useCallback } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';

import { injected } from './constants/connectors';

import BaseLayout from './components/BaseLayout';
import { ANALYTICS_ID } from './constants';
import { setCookie, getCookie, removeCookie } from './helpers';
import { To } from './theme';

const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const Dashboard = lazy(() => import('./pages/Profile'));
const StakeRewards = lazy(() => import('./pages/StakeRewards'));
const PlayGame = lazy(() => import('./pages/PlayGame/index'));
const Competitions = lazy(() => import('./pages/Competitions'));
const Competition = lazy(() => import('./pages/Competition'));
const BrowseGame = lazy(() => import('./pages/BrowseGame'));
const TermsService = lazy(() => import('./pages/TermsService'));
const GameFarms = lazy(() => import('./pages/GameFarms'));
const Admin = lazy(() => import('./pages/Admin'));
const NFTs = lazy(() => import('./pages/NFTList'));
const NFTView = lazy(() => import('./pages/NFTView/index'));

// Guilds
const GuildDashboard = lazy(() => import('./pages/Guilds'));
const Tavern = lazy(() => import('./pages/Guilds/Tavern'));
const GuildManagement = lazy(() => import('./pages/Guilds/GuildManagement'));
const GuildView = lazy(() => import('./pages/Guilds/Guild/index'));

const Routes = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize(ANALYTICS_ID);
  }, []);

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  const { ethereum } = window;
  const web3 = new Web3(ethereum);

  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
    account,
  } = useWeb3React();
  const [signature, setSignature] = useState(null);

  const requestSignature = useCallback(
    async (signedCallback, rejectSignCallback) => {
      const authHeader = getCookie(`authHeader-${account}`);
      const inProgress = sessionStorage.getItem(`signingInProgress-${account}`);

      if (!authHeader && (!inProgress || inProgress !== 'true')) {
        sessionStorage.setItem(`signingInProgress-${account}`, true);
        const timeStamp = new Date().getTime();

        try {
          const signatureRequest = await web3.eth.personal.sign(
            web3.utils.utf8ToHex(
              `Welcome to HiFi Gaming Society, please sign in: ${account}-${timeStamp}`
            ),
            account
          );

          const signatureResponse = signatureRequest;
          if (signatureResponse) {
            setCookie('persistAccountOnReload', true);
            setCookie(`signature-${account}`, signatureResponse);
            sessionStorage.setItem(`signingInProgress-${account}`, false);

            const usernameString = `${account}-${timeStamp}`;
            const authString = `${usernameString}:${signatureResponse}`;
            const base64String = window.btoa(authString);
            setCookie(`base64Sig-${account}`, `${base64String}`);
            setCookie(`authHeader-${account}`, `Basic ${base64String}`);
            setSignature(signatureResponse);

            if (signedCallback) {
              return signedCallback(signatureResponse);
            }
            return null;
          }
        } catch (error) {
          if (error.code === 4001) {
            sessionStorage.setItem(`signingInProgress-${account}`, false);
            setSignature(null);
            if (rejectSignCallback) {
              return rejectSignCallback();
            }
          }
          return null;
        }
      }
      return null;
    },
    [account, web3.eth.personal, web3.utils]
  );

  const wipeSignatureAndReRequest = async (successCallback, errorCallback) => {
    removeCookie(`authHeader-${account}`);
    sessionStorage.removeItem(`signingInProgress-${account}`);
    removeCookie(`signature-${account}`);
    const res = await requestSignature(successCallback, errorCallback);
    return res;
  };

  useEffect(() => {
    injected
      .isAuthorized()
      .then((isAuthorized) => {
        const autoLogIn = JSON.parse(getCookie('persistAccountOnReload'));

        if (isAuthorized && autoLogIn && !networkActive && !networkError) {
          activateNetwork(injected);
        }
      })
      .catch(() => {});
  }, [activateNetwork, networkActive, networkError, signature]);

  useEffect(() => {
    const setAuthHeader = async () => {
      await requestSignature();
    };
    if (account) {
      setAuthHeader();
    }
  }, [account, requestSignature]);

  return (
    <Switch>
      <BaseLayout wipeSignatureAndReRequest={wipeSignatureAndReRequest}>
        <Route exact path="/">
          <Redirect to="/browse-games" />
        </Route>
        <Route exact path="/play-game">
          <Redirect to="/browse-games" />
        </Route>
        <Route {...To('dashboard')} component={Dashboard} />
        <Route {...To('stake-rewards')} component={StakeRewards} />
        <Route
          render={() => (
            <PlayGame wipeSignatureAndReRequest={wipeSignatureAndReRequest} />
          )}
          path="/play-game/:gameId"
        />
        <Route
          render={() => (
            <Competitions
              wipeSignatureAndReRequest={wipeSignatureAndReRequest}
            />
          )}
          path="/competitions"
        />
        <Route render={() => <Competition />} path="/competition/:id" />
        <Route
          {...To('browse-games')}
          render={() => (
            <BrowseGame wipeSignatureAndReRequest={wipeSignatureAndReRequest} />
          )}
        />

        <Route
          render={() => (
            <GuildView wipeSignatureAndReRequest={wipeSignatureAndReRequest} />
          )}
          path="/guild/:id"
        />
        <Route
          render={() => (
            <GuildDashboard
              wipeSignatureAndReRequest={wipeSignatureAndReRequest}
            />
          )}
          path="/guilds"
        />

        <Route
          render={() => (
            <Tavern wipeSignatureAndReRequest={wipeSignatureAndReRequest} />
          )}
          path="/tavern"
        />

        <Route
          render={() => (
            <GuildManagement
              wipeSignatureAndReRequest={wipeSignatureAndReRequest}
            />
          )}
          path="/guildManagement"
        />
        <Route {...To('comingsoon')} component={ComingSoon} />
        <Route {...To('terms-service')} component={TermsService} />
        <Route {...To('game-farms')} component={GameFarms} />
        <Route render={() => <Admin />} path="/admin" />
        <Route render={() => <GameFarms />} path="/vaults" />
        <Route render={() => <NFTs />} path="/nfts" />
        <Route render={() => <NFTView />} path="/nft/:collection/:id" />
      </BaseLayout>
    </Switch>
  );
};

export default Routes;
