import { makeStyles } from '@material-ui/styles';

// const defaultborderColor = 'rgba(128, 129, 145, 0.1)'
const defaultColor = '#ed51a3';
const defaultColorGrey = '#575863';

const useStyles = makeStyles((theme) => ({
  // Main

  mingingrewards: {
    backgroundColor: 'rgba(0,0,0,.24)',
    padding: theme.spacing(5),
    borderRadius: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
  },
  TextCenter: {
    textAlign: 'center',
  },
  TextColor: {
    color: defaultColor,
  },
  itemtitle: {
    fontSize: '3rem',
    fontWeight: 600,
  },
  TextColorGrey: {
    color: defaultColorGrey,
  },
  middleTextGroup: {
    justifyContent: 'space-between',
  },
  tokenstatus: {
    backgroundColor: '#191a23',
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  fixedHeight: {
    minHeight: '45px',
  },
  miningBtns: {
    backgroundColor: '#5c5d68',
  },
  compoundButton: {
    marginRight: '10px;',
  },
  ColorStyle: {
    '& .MuiLinearProgress-root': {
      backgroundColor: '#15171f !important',
    },
    '& ..MuiLinearProgress-colorSecondary': {
      backgroundColor: '#15171f !important',
    },
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#ed51a3 !important;',
    },
  },
}));

export default useStyles;
