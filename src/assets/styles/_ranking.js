import { makeStyles } from '@material-ui/styles';

const defaultBg = 'rgba(228, 228, 228, 0.05) !important';

const useStyles = makeStyles((theme) => ({
  rankList: {
    height: theme.spacing(50),
    overflow: 'auto',
    overflowX: 'hidden',
    backgroundColor: '#183254',
    borderRadius: '24px',
    border: '2px solid #77dcd0',
    boxShadow: '0 0 15px #77dcd0',
    '& .Mui-selected': {
      backgroundColor: '#008077',
      '& span': {
        color: '#eee',
      },
    },
    '&::-webkit-scrollbar': {
      width: '10px',
      background: 'initial',
    },
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)',
    },
  },
  ClipyBar: {
    height: '4px',
    margin: '2px 0',
    background: '#008077',
    clipPath: 'polygon(25% 0%, 100% 0, 100% 50%, 100% 100%, 25% 100%, 0% 50%)',
  },
  ListRankItem: {
    width: '10%',
    minWidth: '56px',
    flex: 'none',
    '& span': {
      color: '#009878',
    },
  },
  ListAvatarItem: {
    width: '10%',
  },
  ListCupItem: {
    width: '10%',
    '& img': {
      width: '25px',
    },
  },
  userAddress: {
    width: '50%',
    '& span': {
      fontSize: '18px',
    },
  },
  amount: {
    width: '15%',
    '& span': {
      fontSize: '20px',
    },
  },
  ListTimeItem: {
    width: '20%',
    '& span': {
      fontSize: '13px',
    },
  },
  ComRealRaning: {
    padding: '3%',
    display: 'flex',
  },
  ComWholeRaning: {
    padding: '3%',
  },
  UserAddress: {
    fontSize: '18px',
  },
  Reword: {
    fontSize: '20px',
    color: 'grey',
  },
  RealRanking: {
    backgroundColor: '#008177',
    borderRadius: '20px 20px 0 0',
    color: '#173254',
    fontSize: '64px',
    fontWeight: 'bolder',
  },
  RankImageAvatar: {
    width: '50%',
    margin: theme.spacing(3, 0),
  },
  RankArea1: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'flex-end',
    width: '30%',
    '& .Ranking': {
      height: theme.spacing(30),
    },
  },
  RankArea2: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'flex-end',
    width: '30%',
    '& .Ranking': {
      height: theme.spacing(25),
    },
  },
  RankArea3: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'flex-end',
    width: '30%',
    '& .Ranking': {
      height: theme.spacing(20),
    },
  },
  betweenbar: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'flex-end',
    width: '5%',
  },
  BetWeenFirstBar: {
    clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0% 100%)',
    backgroundColor: '#008177',
    height: theme.spacing(10),
  },
  BetWeenSecondBar: {
    clipPath: 'polygon(0 0, 100% 15%, 100% 100%, 0% 100%)',
    backgroundColor: '#008177',
    height: theme.spacing(10),
  },
  btnGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '100%',
  },
  btn: {
    width: theme.spacing(20),
    height: theme.spacing(7),
    borderRadius: theme.spacing(2),
    textTransform: 'none',
    background: 'rgba(0,0,0,.24)',
    '&:hover': {
      backgroundColor: '#ed51a3',
    },
  },
  btnHoverColor: {
    backgroundColor: '#ed51a3',
  },
  filter: {
    position: 'relative',
    backgroundColor: defaultBg,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      // marginLeft: theme.spacing(1),
      width: 'auto',
    },
    display: 'flex',
    justifyContent: 'space-between',
    height: theme.spacing(9),
    padding: theme.spacing(0, 4),
    borderRadius: theme.spacing(2),
  },
  marginTop: {
    marginTop: `${theme.spacing(3)}px !important`,
  },
  marginBottom5: {
    marginBottom: `${theme.spacing(5)}px !important`,
  },
  marginBottom10: {
    marginBottom: `${theme.spacing(10)}px !important`,
  },
  marginBottom15: {
    marginBottom: `${theme.spacing(15)}px !important`,
  },
  highScore: {
    fontSize: '60px',
    fontFamily: theme.typography.custom.arcade,
    color: theme.palette.custom.brillRoseColor,
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadow: `0px 0px 12px ${theme.palette.custom.brillRoseColor}, 4px 4px 5px #77dcd0`,
  },
  reputation: {
    fontFamily: theme.typography.custom.arcade,
    color: theme.palette.custom.brillRoseColor,
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadow: `0px 0px 12px ${theme.palette.custom.brillRoseColor}`,
    [theme.breakpoints.down('sm')]: {
      fontSize: '25px',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '40px',
    },
    marginTop: '10px',
  },
  childFilter: {
    fontSize: '25px',
    fontFamily: theme.typography.custom.arcade,
    color: theme.palette.custom.brillRoseColor,
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadow: `0px 0px 12px ${theme.palette.custom.brillRoseColor}`,
  },
  flexend: {
    justifyContent: 'flex-end',
  },
  avatarWidth: {
    width: '50px',
  },
}));

export default useStyles;
