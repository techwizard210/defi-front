/* jshint esversion: 6 */
import { useState } from 'react';
import { useSelector } from 'react-redux';

// ** Import Material-Ui Components & Icons

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

import PersonIcon from '@mui/icons-material/Person';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faBars,
  faHandHoldingUsd,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';

import Bonzai from '../../assets/img/Headerbtns/bonzai.png';
import useStyles from '../../assets/styles';
import { History } from '../../theme';

const MobileNavigation = () => {
  const classes = useStyles.header();

  // ** Declare States
  const [showMenu, setShowMenu] = useState(false);
  const profile = useSelector((state) => state.profile);

  const gotoPage = (page) => {
    History.push(`/${page}`);
  };

  const navClick = (page) => {
    setShowMenu(false);
    gotoPage(page);
  };

  // ** Render Components
  return (
    <nav>
      <div className={classes.mobileNavLines}>
        <FontAwesomeIcon icon={faBars} onClick={() => setShowMenu(!showMenu)} />
      </div>

      {showMenu && (
        <div
          role="button"
          tabIndex={0}
          className={classes.mobileMenuMask}
          onClick={() => setShowMenu(!showMenu)}
        />
      )}
      {showMenu && (
        <Box
          sx={{ bgcolor: 'background.paper' }}
          className={`${classes.mobileMenu} ${
            profile?.playerId ? classes.mobileLoggedIn : null
          }`}
        >
          <nav>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  className={classes.mHeader}
                  onClick={() => navClick('browse-games')}
                >
                  <ListItemIcon>
                    <VideogameAssetIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <span className={classes.menuFont}>Games</span>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  className={classes.mHeader}
                  onClick={() => navClick('dashboard')}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText>
                    <span className={classes.menuFont}>Profile</span>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  className={classes.mHeader}
                  onClick={() => navClick('guilds')}
                >
                  <ListItemIcon>
                    <div className={classes.mobileFontAwesomeMenuOption}>
                      <FontAwesomeIcon icon={faShieldAlt} />
                    </div>
                  </ListItemIcon>
                  <ListItemText>
                    <span className={classes.menuFont}>Guilds</span>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  className={classes.mHeader}
                  onClick={() => navClick('competitions')}
                >
                  <ListItemIcon>
                    <div className={classes.mobileFontAwesomeMenuOption}>
                      <FontAwesomeIcon icon={faTrophy} />
                    </div>
                  </ListItemIcon>
                  <ListItemText>
                    <span className={classes.menuFont}>Competitions</span>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  className={classes.mHeader}
                  onClick={() => navClick('game-farms')}
                >
                  <ListItemIcon>
                    <img
                      src={Bonzai}
                      alt="farms"
                      className={classes.mobileBonzai}
                    />
                  </ListItemIcon>
                  <ListItemText>
                    <span className={classes.menuFont}>Farms</span>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  className={classes.mHeader}
                  onClick={() => navClick('stake-rewards')}
                >
                  <ListItemIcon>
                    <div className={classes.mobileFontAwesomeMenuOption}>
                      <FontAwesomeIcon icon={faHandHoldingUsd} />
                    </div>
                  </ListItemIcon>
                  <ListItemText>
                    <span className={classes.menuFont}>Staking</span>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  className={classes.mHeader}
                  onClick={() => navClick('nfts')}
                >
                  <ListItemIcon>
                    <div className={classes.mobileFontAwesomeMenuOption}>
                      <i className="fa-solid fa-clipboard-user" />
                    </div>
                  </ListItemIcon>
                  <ListItemText>
                    <span className={classes.menuFont}>NFTs</span>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
        </Box>
      )}
    </nav>
  );
};

export default MobileNavigation;
