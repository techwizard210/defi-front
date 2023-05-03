import { useState, useEffect } from 'react';
import { isChrome, isFirefox } from 'react-device-detect';

import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

import useStyles from '../assets/styles';
import logo from '../assets/img/Logos/logo.png';

const DetectPlatform = () => {
  const classes = useStyles.modal();
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    if (!isChrome && !isFirefox) {
      setIsBrowser(true);
    }
  }, []);
  const handleClose = () => {
    setIsBrowser(false);
  };

  const body = (
    <div className={classes.paper}>
      <div className={classes.logoWrap}>
        <img src={logo} alt="avatar" className={logo} />
      </div>
      <div id="simple-modal-title">
        <h2>Welcome to HiFi Gaming Society!</h2>
        <br />
        <h3>
          We are compatible with Chrome and Firefox browsers and Metamask and
          Trustwallet Dapps.
        </h3>
        <br />
        <h3>Have a nice day!</h3>
        <br />
      </div>
      <div className={classes.buttonWrap}>
        <Button variant="contained" color="primary" onClick={handleClose}>
          OK
        </Button>
      </div>
      {/* <p id="simple-modal-description"></p> */}
    </div>
  );

  return (
    <div>
      <Modal
        open={isBrowser}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
};

export default DetectPlatform;
