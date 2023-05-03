/* jshint esversion: 6 */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// ** Import Material-Ui Components & Icons
import Button from '@material-ui/core/Button';
import Popover from '@mui/material/Popover';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Avatar from '@material-ui/core/Avatar';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';

// Import web3
import { useWeb3React } from '@web3-react/core';
import { Flex, LogoutIcon, useModal, UserMenuItem } from '@pancakeswap/uikit';

import useAuth from '../../hooks/useAuth';
import useStyles from '../../assets/styles';
import { FetchStatus, useGetBnbBalance } from '../../hooks/useTokenBalance';
import { walletAuthFetchWithSigPrompt } from '../../helpers/apiFetchWrappers';
import ConnectModal from '../../widgets/WalletModal/ConnectModal';
import { History } from '../../theme';
import { removeCookie, setCookie } from '../../helpers';
import WalletUserMenuItem from '../WalletUserMenuItem';
import WalletModal, { WalletView, LOW_BNB_BALANCE } from '../WalletModal';

const WalletSection = (props) => {
  const { wipeSignatureAndReRequest } = props;
  const dispatch = useDispatch();

  const classes = useStyles.header();
  const { login } = useAuth();
  const { balance, fetchStatus } = useGetBnbBalance();

  const { account } = useWeb3React();
  const [onPresentWalletModal] = useModal(
    <WalletModal initialView={WalletView.WALLET_INFO} />
  );
  const [openConnectModal] = useModal(<ConnectModal login={login} />);

  const hasLowBnbBalance =
    fetchStatus === FetchStatus.SUCCESS && balance.lte(LOW_BNB_BALANCE);
  const pageName = History.location.pathname.split('/');
  pageName.splice(0, 1);

  // ** Declare States
  const [profile, setUserProfile] = useState(null);

  const handleLogOut = async () => {
    sessionStorage.removeItem('signin');
    sessionStorage.removeItem('token');
    removeCookie(`authHeader-${account}`);
    removeCookie(`signature-${account}`);
    removeCookie(`base64Sig-${account}`);
    removeCookie('persistAccountOnReload');
    window.location.reload();
  };

  useEffect(() => {
    const signin = async () => {
      const resp = await walletAuthFetchWithSigPrompt(
        'Player/FetchProfile',
        'GET',
        wipeSignatureAndReRequest,
        account,
        null,
        false,
        null
      );
      if (resp) {
        setUserProfile(resp);
        dispatch({ type: 'PROFILE', payload: resp });
      }
      setCookie('persistAccountOnReload', true);
    };

    if (account) {
      signin();
    }
  }, [account, dispatch, wipeSignatureAndReRequest]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // ** Render Components
  return (
    <>
      {account ? (
        <>
          <div
            onClick={handleClick}
            className="walletWrapper"
            role="button"
            tabIndex="-1"
          >
            <div className="avatarBubble">
              {profile?.avatar ? (
                <Avatar src={profile.avatar} />
              ) : (
                <FontAwesomeIcon className="walletIcon" icon={faWallet} />
              )}
            </div>
            <span>
              {profile?.playerName
                ? profile.playerName
                : `${account.slice(0, 4)}...${account.slice(-4)}`}
            </span>

            <ExpandMoreIcon />
          </div>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <WalletUserMenuItem
              hasLowBnbBalance={hasLowBnbBalance}
              onPresentWalletModal={onPresentWalletModal}
            />
            <UserMenuItem as="button" onClick={handleLogOut}>
              <Flex
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                Disconnect
                <LogoutIcon className="logoutIcon" />
              </Flex>
            </UserMenuItem>
          </Popover>
        </>
      ) : (
        <Button
          onClick={openConnectModal}
          className={classes.connetWalletButton}
        >
          Connect
        </Button>
      )}
    </>
  );
};

export default WalletSection;
