import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { useLocation } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCrosshairs,
  faGamepad,
  faCoins,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

import Profile from './PofilesAndMissions/Profile';
import Missions from './PofilesAndMissions/Missions';
import Earnings from './Earnings';
import Gaming from './Gaming';
import Notifications from './Notifications/Notifications';

const tabMapper = {
  profile: 0,
  gamingStats: 1,
  earnings: 2,
  notifications: 3,
};

const ProfilePage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const { search } = useLocation();

  const { account } = useWeb3React();

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  useEffect(() => {
    const setInitialTab = async () => {
      const querySearcher = new URLSearchParams(search);
      const initialTab = querySearcher.get('tab');

      if (tabMapper[initialTab]) {
        setSelectedTab(tabMapper[initialTab]);
      }
    };

    async function init() {
      await setInitialTab();
    }
    if (account) {
      init();
    }
  }, [account, search]);

  const Options = () => {
    return (
      <div className="profileOptions">
        <div>
          <button
            type="button"
            onClick={() => handleTabChange(0)}
            className={`profileOption ${selectedTab === 0 ? 'selected' : ''}`}
          >
            Missions
            <FontAwesomeIcon icon={faCrosshairs} />
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => handleTabChange(1)}
            className={`profileOption ${selectedTab === 1 ? 'selected' : ''}`}
          >
            Gaming Stats
            <FontAwesomeIcon icon={faGamepad} />
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={() => handleTabChange(2)}
            className={`profileOption ${selectedTab === 2 ? 'selected' : ''}`}
          >
            Earnings
            <FontAwesomeIcon icon={faCoins} />
          </button>
        </div>
        <div>
          <button
            type="button"
            onClick={() => handleTabChange(3)}
            className={`profileOption ${selectedTab === 3 ? 'selected' : ''}`}
          >
            Notifications / Messages
            <FontAwesomeIcon icon={faEnvelope} />
          </button>
        </div>
      </div>
    );
  };

  function TabPanel(tabPanelProps) {
    const { children, index } = tabPanelProps;

    return (
      <div
        role="tabpanel"
        hidden={selectedTab !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {selectedTab === index && <Box>{children}</Box>}
      </div>
    );
  }

  const socials = (
    <>
      <hr />

      <div className="socials">
        <div>Follow Us</div>

        <div className="social-icons">
          <a
            href="https://t.me/HiFiGamingSocietyPlatform"
            target="_blank"
            rel="nofollow noreferrer"
            className="social-icon-link telegram"
          >
            <i className="fab fa-telegram" />
          </a>
          <a
            href="https://discord.com/invite/agDmDC4wcp"
            target="_blank"
            rel="nofollow noreferrer"
            className="social-icon-link discord"
          >
            <i className="fab fa-discord" />
          </a>
          <a
            href="https://hifigamingsociety.medium.com/"
            target="_blank"
            rel="nofollow noreferrer"
            className="social-icon-link medium"
          >
            <i className="fab fa-medium" />
          </a>
          <a
            href="https://twitter.com/HiFiDeFi"
            target="_blank"
            rel="nofollow noreferrer"
            className="social-icon-link twitter"
          >
            <i className="fab fa-twitter" />
          </a>
          <a
            href="https://www.youtube.com/channel/UCLKLaa_XiXZ4uacfGkunMaw"
            target="_blank"
            rel="nofollow noreferrer"
            className="social-icon-link youtube"
          >
            <i className="fab fa-youtube" />
          </a>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Grid
        container
        className={`profilePage ${!isMobile ? 'nonMobilePadding' : ''}`}
      >
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <div className="newEarningsInfo">
            We have moved to a new earnings model, for more details please read{' '}
            <a
              href="https://hifigamingsociety.medium.com/2b76ed432067"
              target="_blank"
              rel="nofollow noreferrer"
              className="newEarningsLink"
            >
              our latest article.
            </a>
            <br />
            <br />
            If you find yourself needing a bit of help the team are always
            available to help on our social channels listed below.
          </div>
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12}>
          <Profile />
          <Options />

          {!isMobile && socials}
        </Grid>
        <Grid item lg={9} md={9} sm={12} xs={12}>
          <TabPanel value={selectedTab} index={0}>
            <Missions />
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <Gaming />
          </TabPanel>
          <TabPanel value={selectedTab} index={2}>
            <Earnings />
          </TabPanel>
          <TabPanel value={selectedTab} index={3}>
            <Notifications />
          </TabPanel>
        </Grid>
      </Grid>
      {isMobile && socials}
    </>
  );
};

export default ProfilePage;
