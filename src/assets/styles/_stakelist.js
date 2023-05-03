import { makeStyles } from '@material-ui/styles';

// const defaultborderColor = 'rgba(128, 129, 145, 0.1)'
const defaultColor = '#ed51a3';

const useStyles = makeStyles((theme) => ({
  // Main
  stake: {
    textAlign: 'center',
    padding: '24px 10px !important',
    width: '100%',
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
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  stakeFooter: {
    height: '150px',
    width: '100%',
  },
  stakeFooterButtonWrapper: {
    position: 'absolute',
    bottom: '35px',
    width: '100%',
  },
  stakeimg: {
    display: 'inline-block',
    height: '100%',
    width: '60%',
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
  headlineContent: {
    color: '#ed51a3',
    fontSize: '23px',
    top: '-17px',
    position: 'relative',
    marginBottom: '0',
  },
  asteriskContent: {
    color: '#808191',
    fontSize: '12px',
    bottom: '-17px',
    position: 'relative',
    marginBottom: '0',
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
