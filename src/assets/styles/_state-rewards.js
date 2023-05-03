import { makeStyles } from '@material-ui/styles';

// const defaultborderColor = 'rgba(128, 129, 145, 0.1)'
const defaultColor = '#ed51a3';

const useStyles = makeStyles((theme) => ({
  // Main
  root: {
    flexGrow: 1,
    padding: '10px',
  },
  titleFont: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: defaultColor,
  },
  marginTop: {
    marginTop: theme.spacing(8),
  },

  // Stake List
  maintitle: {
    color: '#eee',
  },
  stake: {
    textAlign: 'center',
    padding: '24px 10px !important',
  },
  staketitle: {
    color: '#eee',
    fontSize: '3rem',
    padding: theme.spacing(4),
    [theme.breakpoints.up('md')]: {
      padding: '0',
    },
  },
  stakepaper: {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(4, 1, 4, 1),
    textAlign: 'center',
    color: defaultColor,
    background: 'rgba(0,0,0,.24)',
  },
  stakeimg: {
    display: 'inline-block',
    height: '100%',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: '0 20%',
    },
    [theme.breakpoints.up('md')]: {
      padding: '2%',
    },
    [theme.breakpoints.up('lg')]: {
      padding: '0 20%',
    },
  },
  content1: {
    color: '#808191',
    [theme.breakpoints.down('sm')]: {
      padding: '0',
    },
    [theme.breakpoints.up('md')]: {
      padding: '0',
    },
    [theme.breakpoints.up('lg')]: {
      padding: '0px 18%',
    },
  },
  stakecontent2: {
    color: '#808191',
    [theme.breakpoints.down('sm')]: {
      marginTop: '0',
    },
    [theme.breakpoints.up('md')]: {
      marginTop: '0',
    },
    [theme.breakpoints.up('lg')]: {
      marginTop: theme.spacing(3),
    },
  },
  stakeBtn: {
    fontSize: theme.spacing(2),
    height: theme.spacing(9),
    backgroundColor: '#3F8CFF',
    borderRadius: theme.spacing(2),
    padding: '35px',
    color: '#eee',
    '&:hover': {
      backgroundColor: 'rgba(53, 130, 245, .8)',
    },
  },
}));

export default useStyles;
