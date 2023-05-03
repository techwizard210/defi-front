import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  mobileModal: {
    zIndex: '50000001 !important',
  },
  paper: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    width: 500,
    backgroundColor: '#2D3E5E',
    borderRadius: '4px',
    boxShadow: theme.shadows[5],
    padding: '30px 60px',
    textAlign: 'center',
  },
  terms_paper: {
    top: '10%',
    bottom: '10%',
    left: 'calc(50vw - 16px)',
    transform: 'translate(-50%, 0%)',
    position: 'absolute',
    width: 'calc(100vw - 32px)',
    maxWidth: '1200px',
    backgroundColor: '#2D3E5E',
    borderRadius: '4px',
    boxShadow: theme.shadows[5],
    padding: '30px 60px',
  },
  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    margin: '30px 0',
  },
  logo: {
    width: '120px',
  },
  buttonWrap: {
    display: 'flex',
    justifyContent: 'center',
  },
  termsWrap: {
    overflowY: 'scroll',
    height: 'calc(100% - 166px)',
    marginBottom: '30px',
  },
}));

export default useStyles;
