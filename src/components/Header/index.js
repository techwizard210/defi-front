/* jshint esversion: 6 */
import { BrowserView, MobileView } from 'react-device-detect';
import { useSelector } from 'react-redux';

// ** Import Material-Ui Components & Icons
import AppBar from '@material-ui/core/AppBar';
import CardContent from '@material-ui/core/CardContent';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import PersonIcon from '@mui/icons-material/Person';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faHandHoldingUsd,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';

import 'firebase/firestore';

import useStyles from '../../assets/styles';
import { History } from '../../theme';

import Logo from '../../assets/img/logo.png';
import Bonzai from '../../assets/img/Headerbtns/bonzai.png';
import WalletSection from './WalletSection';
import MobileNavigation from './MobileNavigation';

const Header = (props) => {
  const classes = useStyles.header();

  const profile = useSelector((state) => state.profile);

  const pageName = History.location.pathname.split('/');
  pageName.splice(0, 1);

  // ** Declare States

  const gotoPage = (page) => {
    History.push(`/${page}`);
  };

  // ** Render Components
  return (
    <>
      <BrowserView>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Button
              className={classes.achieve}
              onClick={() => gotoPage('browse-games')}
            >
              <img src={Logo} alt="logo" />
            </Button>
            <Button
              className={classes._header}
              onClick={() => gotoPage('browse-games')}
            >
              <div
                className={`${
                  pageName[0] === 'browse-games' ? classes.selectedHeader : ''
                } ${classes.headerIcon}`}
              >
                <div>
                  <VideogameAssetIcon fontSize="large" />
                </div>
                <div style={{ marginTop: '-6px' }}>
                  <span style={{ fontFamily: "'Poppins', Aldrich" }}>
                    Games
                  </span>
                </div>
              </div>
            </Button>
            <Button
              className={classes._header}
              onClick={() => {
                gotoPage('dashboard');
              }}
            >
              <div
                className={`${
                  pageName[0] === 'dashboard' ? classes.selectedHeader : ''
                } ${classes.headerIcon}`}
              >
                <div>
                  <PersonIcon fontSize="large" />
                </div>
                <div style={{ marginTop: '-6px' }}>
                  <span style={{ fontFamily: "'Poppins', Aldrich" }}>
                    Profile
                  </span>
                </div>
              </div>
            </Button>
            <Button
              className={classes._header}
              onClick={() => gotoPage('guilds')}
            >
              <div
                className={`${
                  pageName[0] === 'guilds' ? classes.selectedHeader : ''
                } ${classes.headerIcon}`}
              >
                <div style={{ fontSize: '26px' }}>
                  <FontAwesomeIcon icon={faShieldAlt} />
                </div>
                {/* <div>
                  <LeaderboardIcon fontSize="large" />
                </div> */}
                <div style={{ marginTop: '-4px' }}>
                  <span style={{ fontFamily: "'Poppins', Aldrich" }}>
                    Guilds
                  </span>
                </div>
              </div>
            </Button>

            <Button
              className={classes._header}
              onClick={() => gotoPage('game-farms')}
            >
              <div
                className={`${
                  pageName[0] === 'game-farms' ? classes.selectedHeader : ''
                } ${classes.headerIcon}`}
              >
                <div>
                  <img src={Bonzai} alt="farms" style={{ marginTop: '-4px' }} />
                </div>
                <div style={{ marginTop: '-23px' }}>
                  <span style={{ fontFamily: "'Poppins', Aldrich" }}>
                    Farms
                  </span>
                </div>
              </div>
            </Button>
            <Button
              className={classes._header}
              onClick={() => gotoPage('competitions')}
            >
              <div
                className={`${
                  pageName[0] === 'competitions' ? classes.selectedHeader : ''
                } ${classes.headerIcon}`}
              >
                <div style={{ fontSize: '26px' }}>
                  <FontAwesomeIcon icon={faTrophy} />
                </div>
                <div style={{ marginTop: '-4px' }}>
                  <span style={{ fontFamily: "'Poppins', Aldrich" }}>
                    Compete
                  </span>
                </div>
              </div>
            </Button>
            <Button
              className={classes._header}
              onClick={() => gotoPage('stake-rewards')}
            >
              <div
                className={`${
                  pageName[0] === 'stake-rewards' ? classes.selectedHeader : ''
                } ${classes.headerIcon}`}
              >
                <div style={{ fontSize: '26px' }}>
                  <FontAwesomeIcon icon={faHandHoldingUsd} />
                </div>
                <div style={{ marginTop: '-4px' }}>
                  <span style={{ fontFamily: "'Poppins', Aldrich" }}>
                    Staking
                  </span>
                </div>
              </div>
            </Button>
            <Button
              className={classes._header}
              onClick={() => {
                gotoPage('nfts');
              }}
            >
              <div
                className={`${
                  pageName[0] === 'nfts' ? classes.selectedHeader : ''
                } ${classes.headerIcon}`}
              >
                <div style={{ fontSize: '26px' }}>
                  {/* <i className="fa-solid fa-clipboard-user" /> */}
                  <AssignmentIndRoundedIcon
                    sx={{ fontSize: '30px', marginTop: '7px' }}
                  />
                </div>
                <div style={{ marginTop: '-12px' }}>
                  <span style={{ fontFamily: "'Poppins', Aldrich" }}>NFTs</span>
                </div>
              </div>
            </Button>

            <IconButton />
            <CardContent />
            <div className={classes.spacing} />
            {profile?.playerId && (
              <>
                {profile?.notificationCount > 0 && (
                  <div
                    role="button"
                    tabIndex={0}
                    className={classes.notifications}
                    onClick={() => gotoPage('dashboard?tab=notifications')}
                  >
                    {profile?.notificationCount}{' '}
                    <span className={classes.notificationCount}>
                      <i className="fa fa-envelope" />
                    </span>
                  </div>
                )}

                <div
                  role="button"
                  tabIndex={0}
                  className={classes.merits}
                  onClick={() => gotoPage('dashboard')}
                >
                  {profile?.tokenType === 1
                    ? 'Daily Merits'
                    : 'Daily Raffle Tickets'}
                  <span className={classes.tokenCount}>
                    {Math.min(profile?.tokenCount, 5)} / 5
                  </span>
                </div>
              </>
            )}
            <WalletSection {...props} />
          </Toolbar>
        </AppBar>
      </BrowserView>
      <MobileView>
        <AppBar position="static" className={classes.mAppBar}>
          <Toolbar className={classes.toolbar}>
            <Grid container>
              {profile?.playerId && (
                <>
                  <Grid item xs={4} className={classes.mHeaderHifi}>
                    {profile?.notificationCount > 0 && (
                      <div
                        role="button"
                        tabIndex={0}
                        className={classes.notifications}
                        onClick={() => gotoPage('dashboard?tab=notifications')}
                      >
                        {profile?.notificationCount}{' '}
                        <span className={classes.notificationCount}>
                          <i className="fa fa-envelope" />
                        </span>
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={8} className={classes.mHeaderHifi}>
                    <div
                      className={`${classes.merits} ${classes.mobileMerits}`}
                      onClick={() => gotoPage('dashboard')}
                      role="button"
                      tabIndex={0}
                    >
                      {profile?.tokenType === 1
                        ? 'Daily Merits'
                        : 'Daily Raffle Tickets'}
                      <span className={classes.tokenCount}>
                        {Math.min(profile?.tokenCount, 5)} / 5
                      </span>
                    </div>
                  </Grid>
                </>
              )}

              <Grid item xs={4} className={`${classes.mHeaderHifi} mobileNav`}>
                <MobileNavigation />
              </Grid>
              <Grid
                item
                xs={4}
                className={`${classes.mHeaderHifi} ${classes.allignCenter} hifiIcon`}
              >
                <Button
                  className={classes.achieve}
                  onClick={() => gotoPage('browse-games')}
                >
                  <img src={Logo} alt="logo" />
                </Button>
              </Grid>

              <Grid
                item
                xs={4}
                className={`${classes.mHeaderAvatar} hifiWalletSection`}
              >
                <WalletSection {...props} />
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </MobileView>
    </>
  );
};

export default Header;
