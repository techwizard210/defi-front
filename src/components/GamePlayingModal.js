import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

import useStyles from '../assets/styles';
import logo from '../assets/img/Logos/logo.png';

const GamePlayingModal = (props) => {
  const classes = useStyles.modal();

  const { isOpen, handleClose } = props;

  const body = (
    <div className={classes.paper}>
      <h2 id="simple-modal-title">You are already playing a game!</h2>
      <div className={classes.logoWrap}>
        <img src={logo} alt="avatar" className={logo} />
      </div>
      <div className={classes.buttonWrap}>
        <Button variant="contained" color="primary" onClick={handleClose}>
          Back to Home
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
};

export default GamePlayingModal;
