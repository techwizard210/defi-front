import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  padMeUp: {
    padding: '10px',
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  mContent: {
    marginTop: '110px',
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  socials: {
    textAlign: 'center',
    fontSize: '20px',
    fontFamily: 'Poppins',

    '& div': {
      fontFamily: 'Poppins',
      padding: '10px',
    },
  },

  socialIconLink: {
    padding: '5px',
  },

  socialBorder: {
    width: '50%',
    margin: 'auto',
  },
}));

export default useStyles;
