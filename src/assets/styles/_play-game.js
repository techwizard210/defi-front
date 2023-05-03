import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: 'none',
    borderRadius: theme.spacing(4),
    background: 'rgba(0,0,0,.24)',
  },
  mRoot: {
    boxShadow: 'none',
    background: 'rgba(0,0,0,.24)',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  customChip: {
    background: '#FF754C !important',
    borderRadius: '8px !important',
    margin: theme.spacing(2, 0),
  },
  headerTitle: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    margin: theme.spacing(1),
    textTransform: 'none',
    [theme.breakpoints.up('xs')]: {
      backgroundColor: '#545652',
      padding: theme.spacing(1, 3),
      borderRadius: theme.spacing(2),
    },
    [theme.breakpoints.up('sm')]: {
      backgroundColor: '#545652',
    },
    [theme.breakpoints.up('md')]: {
      backgroundColor: 'transparent',
    },
    [theme.breakpoints.up('lg')]: {
      backgroundColor: 'transparent',
    },
  },
  cardActions: {
    borderTop: '1px solid rgba(228, 228, 228, .1)',
    padding: theme.spacing(5),
    [theme.breakpoints.up('xs')]: {
      justifyContent: 'space-between',
    },
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'space-between',
    },
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-start',
    },
    [theme.breakpoints.up('lg')]: {
      justifyContent: 'flex-start',
    },
  },
  overlayPanel: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    background: 'rgba(0,0,0,.1)',
    padding: theme.spacing(3),
  },
  tag: {
    background: 'rgba(0,0,0,.4)',
    position: 'absolute',
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(1),
  },
  rightTag: {
    right: theme.spacing(3),
    borderRadius: theme.spacing(0.5),
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    background: 'rgba(27, 29, 33, .85) !important',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    [theme.breakpoints.up('xs')]: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    [theme.breakpoints.up('md')]: {
      width: theme.spacing(12),
      height: theme.spacing(12),
    },
    [theme.breakpoints.up('lg')]: {
      width: theme.spacing(12),
      height: theme.spacing(12),
    },
  },
  ControlRes: {
    [theme.breakpoints.up('xs')]: {
      display: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'block',
    },
  },
  actions: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    '& button': {
      width: theme.spacing(4),
      height: theme.spacing(4),
      borderRadius: theme.spacing(0.5),
      background: 'rgba(27,29,33,0.7) !important',
      margin: theme.spacing(0, 0.5),
    },
  },
  messages: {
    position: 'absolute',
    top: theme.spacing(3),
    right: theme.spacing(3),
    [theme.breakpoints.up('xs')]: {
      display: 'block',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  parentVideo: {
    [theme.breakpoints.up('xs')]: {
      display: 'block',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'block',
    },
  },
  parentChat: {
    [theme.breakpoints.up('xs')]: {
      display: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'block',
    },
  },
  expendChat: {
    [theme.breakpoints.up('xs')]: {
      display: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'block',
    },
  },
  closeChat: {
    [theme.breakpoints.up('xs')]: {
      display: 'block',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  gameAd: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& img': {
      width: theme.spacing(25),
    },
    [theme.breakpoints.up('xs')]: {
      display: 'none',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
    },
  },
  mgameAd: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& img': {
      width: theme.spacing(25),
    },
  },
  currentTitle: {
    [theme.breakpoints.up('xs')]: {
      fontSize: '18px',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '18px',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '2rem',
    },
  },
  startcurrentTitle: {
    fontFamily: 'arcade-interlaced',
    [theme.breakpoints.up('xs')]: {
      fontSize: '18px',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '18px',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '2rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '2rem',
    },
  },
  mmainTitle: {
    textAlign: 'center',
    fontSize: '1.5rem',
  },
  mCurrentTitle: {
    [theme.breakpoints.up('xs')]: {
      fontSize: '14px',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '14px',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1.5rem',
    },
  },
  gameDescription: {
    padding: theme.spacing(1, 2),
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignSelf: 'center',
  },
  content: {
    padding: theme.spacing(4),
  },
  gameProperty: {
    padding: theme.spacing(2, 0),
    [theme.breakpoints.up('xs')]: {
      display: 'flex',
    },
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  gpButton: {
    textTransform: 'none',
    color: '#a2a3b7',
    margin: theme.spacing(0, 1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '& .dot': {
      width: theme.spacing(1),
      height: theme.spacing(1),
      borderRadius: theme.spacing(1),
    },
    '& .dot.blue': {
      background: '#0049C6',
    },
    '& .dot.green': {
      background: '#7FBA7A',
    },
    '& .dot.orange': {
      background: '#FF754C',
    },
  },
  liveChat: {
    height: '100%',
    border: '1px solid rgba(228, 228, 228, .1)',
    fontSize: theme.spacing(2),
  },
  liveChatHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3, 5),
    '& .MuiCardHeader-action': {
      margin: 0,
    },
    height: '13%',
  },

  liveChatList: {
    borderTop: '1px solid rgba(228, 228, 228, .1)',
    borderRadius: theme.spacing(4),
    height: '87%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  perpage: {
    marginBottom: theme.spacing(2),
  },
  chatContent: {
    height: '90%',
    overflow: 'auto',
  },
  chatavatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  chatavatarbtn: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    borderRadius: '50%',
  },
  formroot: {
    display: 'flex',
    boxShadow: 'none',
    borderRadius: theme.spacing(4),
    background: 'none',
  },
  inputchatroot: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  sendText: {
    height: '10%',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    backgroundColor: '#352460',
    borderRadius: theme.spacing(2),
    justifyContent: 'space-between',
  },
  sendBtn: {
    width: theme.spacing(17),
    height: theme.spacing(8),
    backgroundColor: '#FA007F',
    borderRadius: theme.spacing(2),
    textTransform: 'none',
  },
  messagebox: {
    marginBottom: theme.spacing(1),
    height: theme.spacing(7),
    backgroundColor: '#373A43',
    padding: theme.spacing(0, 3),
    alignItems: 'center',
    borderRadius: theme.spacing(0, 3, 3, 3),
    display: 'inline-flex',
    color: '#808191',
  },
  mtime: {
    marginLeft: theme.spacing(2),
    color: '#808191',
  },
  typography: {
    padding: theme.spacing(2),
  },
  permessage: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  morebtn: {
    minWidth: '0',
    padding: '0',
    borderRadius: '50%',
    backgroundColor: 'rgba(0,0,0,.24)',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },

  gameList: {
    padding: theme.spacing(5, 0),
    '& .Mui-selected': {
      background: 'rgba(0,0,0,.24)',
    },
  },
  gameTitle: {
    display: 'flex',
    padding: theme.spacing(3, 2),
    [theme.breakpoints.up('xs')]: {
      flexDirection: 'column',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'column',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'column',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  },
  cplayBtn: {
    width: theme.spacing(7),
    height: theme.spacing(5),
    textTransform: 'none',
    backgroundColor: 'rgba(0,0,0,.24)',
    '&:hover': {
      backgroundColor: '#ed51a3',
    },
  },
  bottomLine: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: theme.spacing(0.5),
    background: '#FF754C',
    width: '60%',
  },

  // Modal Dialog

  appBar: {
    position: 'relative',
    backgroundImage:
      'radial-gradient(farthest-side at 10% 0px, rgb(51, 56, 103) 20%, rgb(23, 25, 59))',
    backgroundPositionX: 'initial',
    backgroundPositionY: 'initial',
    borderBottom: '1px solid rgba(228, 228, 228, .1)',
    boxShadow:
      '0px 2px 10px -8px rgb(0 0 0 / 20%), 0px 1px 10px -8px rgb(0 0 0 / 14%), 0px 1px 10px -8px rgb(0 0 0 / 12%)',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  gameContent: {
    width: '100%',
    height: '100%',
  },
  keyControlContent: {
    width: '100%',
    height: 'calc(100% - 65px)',
    position: 'relative',
  },
  keyControlImage: {
    width: '100%',
    height: '100%',
  },
  mKeyControlImage: {
    width: '100%',
    height: '50%',
  },
  controlButton: {
    width: theme.spacing(30),
    height: theme.spacing(7),
    fontSize: theme.spacing(2),
    borderRadius: theme.spacing(2),
    position: 'absolute',
    left: '3%',
    top: '3%',
    background: 'rgba(0,0,0,.24)',
    '&:hover': {
      backgroundColor: '#ed51a3',
    },
  },
  mControlButton: {
    width: '40%',
    height: theme.spacing(7),
    fontSize: theme.spacing(2),
    borderRadius: theme.spacing(2),
    position: 'absolute',
    left: '3%',
    bottom: '3%',
    background: 'rgba(0,0,0,.24)',
    '&:hover': {
      backgroundColor: '#ed51a3',
    },
    '& .MuiButton-label': {
      fontSize: '0.8 rem',
    },
  },
  keyControlButton: {
    width: theme.spacing(30),
    height: theme.spacing(7),
    fontSize: theme.spacing(2),
    borderRadius: theme.spacing(2),
    position: 'absolute',
    right: '3%',
    top: '3%',
    background: 'rgba(0,0,0,.24)',
    '&:hover': {
      backgroundColor: '#ed51a3',
    },
  },
  mKeyControlButton: {
    width: '40%',
    height: theme.spacing(7),
    fontSize: theme.spacing(2),
    borderRadius: theme.spacing(2),
    position: 'absolute',
    right: '3%',
    bottom: '3%',
    background: 'rgba(0,0,0,.24)',
    '&:hover': {
      backgroundColor: '#ed51a3',
    },
    '& .MuiButton-label': {
      fontSize: '0.8 rem',
    },
  },

  // Mobile View
  mPlayGroup: {
    justifyContent: 'space-around',
    padding: theme.spacing(1, 0),
  },
  mPlayButton: {
    width: theme.spacing(9),
    height: theme.spacing(9),
    borderRadius: theme.spacing(1),
    backgroundColor: 'rgba(0,0,0,.24)',
  },
  mPlayTitle: {
    fontFamily: "'Poppins', Aldrich",
    textTransform: 'uppercase',
    fontWeight: 'bold',
    alignItems: 'center',
    display: 'flex',
    fontSize: '1.1rem',
  },
}));

export default useStyles;
