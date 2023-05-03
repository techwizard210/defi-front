import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  // Chain Rewards
  chainrewards: {
    backgroundColor: 'rgba(0,0,0,.24)',
    padding: theme.spacing(5),
    borderRadius: theme.spacing(4),
  },
  chain: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimimg: {
    position: 'relative',
    width: '100%',
    height: '100%',
    left: '17%',
  },
  imgparent: {
    zIndex: 1,
  },
  claim: {
    maxWidth: '46%',
    backgroundColor: '#C14BFF',
    backgroundImage: `linear-gradient(10deg, #C14BFF, #5C8FFF)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing(3),
    padding: '5%',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '.9rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '2rem',
    },
  },
}));

export default useStyles;
