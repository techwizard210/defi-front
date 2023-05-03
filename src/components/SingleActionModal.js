// ** Import Material-Ui Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const SingleActionModal = (props) => {
  const {
    open,
    handleClose,
    messageWording,
    action,
    modalTitle,
    actionWording,
    actionClass,
  } = props;

  const executeAction = async () => {
    action();
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      className="profileModal"
    >
      <DialogTitle id="max-width-dialog-title" style={{ textAlign: 'center' }}>
        {modalTitle}
      </DialogTitle>
      <DialogContent className="body">{messageWording}</DialogContent>
      <DialogActions>
        <Button
          onClick={executeAction}
          color="primary"
          className={actionClass ?? 'accept'}
        >
          {actionWording}
        </Button>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SingleActionModal;
