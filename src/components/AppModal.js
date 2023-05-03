import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

import TermsService from './TermsService';
import useStyles from '../assets/styles';
import logo from '../assets/img/Logos/logo.png';

const AppModal = () => {
  const classes = useStyles.modal();
  const dispatch = useDispatch();
  const [isNew, setIsNew] = useState(false);
  const [termsService, setTermsService] = useState(false);
  const isNewUser = useSelector((state) => state.auth.isNewUser);

  if (isNewUser === true) {
    setIsNew(true);
    dispatch({ type: 'NEW_USER', payload: false });
  }
  const handleClose = () => {
    setIsNew(false);
  };

  const showTermsService = () => {
    setTermsService(true);
  };

  const body = (
    <div className={classes.paper}>
      <h2 id="simple-modal-title">Welcome to HiFi Gaming Society!</h2>
      <div className={classes.logoWrap}>
        <img src={logo} alt="avatar" className={logo} />
      </div>
      <div className={classes.buttonWrap}>
        <Button variant="contained" color="primary" onClick={showTermsService}>
          Continue
        </Button>
      </div>
    </div>
  );

  const terms = (
    <div className={classes.terms_paper}>
      <div className="terms-service">Terms of Service</div>
      <div className={classes.termsWrap}>
        <TermsService />
      </div>
      <div className={classes.buttonWrap}>
        <Button variant="contained" color="primary" onClick={handleClose}>
          Accept
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={isNew}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {termsService ? terms : body}
      </Modal>
    </div>
  );
};

export default AppModal;
