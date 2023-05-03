import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';

import Header from './Header';
import useStyles from '../assets/styles';

const BaseLayout = ({ children, wipeSignatureAndReRequest }) => {
  const classes = useStyles.base();

  useEffect(() => {
    window.addEventListener('load', async () => {
      if (window.ethereum) {
        window.ethereum.on('chainChanged', (/* _chainId */) =>
          window.location.reload());

        window.ethereum.on('accountsChanged', (/* accounts */) => {
          window.location.reload();
        });
      }
    });
  }, []);
  return (
    <>
      <Header wipeSignatureAndReRequest={wipeSignatureAndReRequest} />

      <main className={isMobile === true ? classes.mContent : classes.content}>
        {children}
      </main>
      {/* <footer>
        <hr className={classes.socialBorder} />

        <div className={classes.socials}>
          <div>Follow Us</div>

          <div>
            <a
              href="https://t.me/HiFiGamingSocietyPlatform"
              target="_blank"
              rel="nofollow noreferrer"
              className={`${classes.socialIconLink} telegram}`}
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
              className={`${classes.socialIconLink} medium}`}
            >
              <i className="fab fa-medium" />
            </a>
            <a
              href="https://twitter.com/HiFiDeFi"
              target="_blank"
              rel="nofollow noreferrer"
              className={`${classes.socialIconLink} twitter}`}
            >
              <i className="fab fa-twitter" />
            </a>

            <a
              href="https://www.youtube.com/channel/UCLKLaa_XiXZ4uacfGkunMaw"
              target="_blank"
              rel="nofollow noreferrer"
              className={`${classes.socialIconLink} youtube}`}
            >
              <i className="fab fa-youtube" />
            </a>
          </div>
        </div>
      </footer> */}
    </>
  );
};

export default BaseLayout;
