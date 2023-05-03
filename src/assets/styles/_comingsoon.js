import { makeStyles } from '@material-ui/styles';

// const defaultBg = 'rgba(228, 228, 228, 0.05)'

const useStyles = makeStyles((theme) => ({
  CompGroupImage: {
    padding: '3%',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },
  versusImage: {
    width: '50%',
    height: '100%',
    borderRadius: theme.spacing(4, 4, 0, 4),
  },
  versusPlayIcon: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    width: theme.spacing(8),
    height: theme.spacing(8),
    background: 'rgba(27, 29, 33, .85)',
    '&:hover': {
      background: '#ed51a3',
    },
  },
  CompGroupVersus: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(8, 0),
  },
  ComBtn: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '12px',
    height: theme.spacing(5),
    padding: theme.spacing(0, 5),
    background: 'linear-gradient(rgb(33, 18, 62) 0%, rgb(10, 1, 38) 100%)',
    color: 'rgb(255, 255, 255)',
    outline: '0px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease 0s',
    flex: '0 0 250px',
    borderRadius: theme.spacing(1),
    border: '1px solid #5e2fbe',
    '& .MuiButton-label': {
      textTransform: 'none',
    },
    '&:hover': {
      background: 'linear-gradient(rgb(65, 35, 123) 0%, rgb(20, 2, 75) 100%)',
    },
  },
  SecondCustomBtn: {
    width: theme.spacing(15),
  },
  ThirdCustomBtn: {
    width: theme.spacing(40),
  },
  ComActiveBtn: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '12px',
    height: '40px',
    padding: '0px 40px',
    background: 'linear-gradient(rgb(109, 58, 206) 0%, rgb(32, 2, 125) 100%)',
    color: 'rgb(255, 255, 255)',
    outline: '0px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease 0s',
    flex: '0 0 250px',
    borderRadius: '8px',
    border: '1px solid #5e2fbe',
  },
  customSubTitle: {
    fontSize: '0.8125rem',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  versusWork: {
    fontSize: theme.spacing(2),
    margin: theme.spacing(0, 7),
    cursor: 'pointer',
  },
  FinalResult: {
    display: 'flex',
    justifyContent: 'center',
  },
  rankList: {
    height: theme.spacing(75),
    overflow: 'auto',
    backgroundColor: '#183254',
    '& .Mui-selected': {
      backgroundColor: '#008077',
      '& span': {
        color: '#eee',
      },
    },
  },
  ClipyBar: {
    height: '4px',
    margin: '2px 0',
    // background: '#ed51a3',
    background: '#008077',
    clipPath: 'polygon(25% 0%, 100% 0, 100% 50%, 100% 100%, 25% 100%, 0% 50%)',
  },
  ListRankItem: {
    width: '10%',
    '& span': {
      color: '#009878',
    },
  },
  ListAvatarItem: {
    width: '10%',
  },
  ListNameItem: {
    width: '50%',
    '& span': {
      fontSize: '18px',
    },
  },
  ListStakeItem: {
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

  PeopleRanking: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    textAlign: 'center',
    padding: '0 3%',
  },
  RankName: {
    fontSize: '18px',
  },
  Stake: {
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
    margin: theme.spacing(4, 0),
  },

  FirstRankArea: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'flex-end',
    width: '30%',
    '& .Ranking': {
      height: theme.spacing(30),
    },
  },
  SecondRankArea: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'flex-end',
    width: '30%',
    '& .Ranking': {
      height: theme.spacing(25),
    },
  },
  ThirdRankArea: {
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

  opponentRoot: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(3),
  },
  subOppointment: {
    background: 'rgba(0,0,0,.24)',
    height: theme.spacing(57),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    clipPath: 'polygon(0 0, 100% 0%, 100% 95%, 50% 100%, 0 95%)',
    paddingBottom: theme.spacing(5),
    cursor: 'pointer',
    borderRadius: theme.spacing(2),
  },
  TopImage: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  MinusHeight: {
    height: '92px',
  },
  MinusTopMargin: {
    marginTop: '-10px',
  },
  LevelMainTitle: {
    textAlign: 'center',
    fontSize: '23px',
    fontWeight: '700',
    background: '-webkit-linear-gradient(#fcf8e6, #d1b467)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  LevelMiddleTitle1: {
    fontSize: '17px',
    textAlign: 'center',
  },
  LevelMiddleTitle2: {
    fontSize: '17px',
    textAlign: 'center',
  },
  AvartarVs: {
    position: 'relative',
    height: theme.spacing(9),
    aliginItems: 'center',
  },
  vsAvartarMenu: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  avartarBackgroundBtn: {
    background: '#787883',
  },
  MainUserAvatarTwo: {
    width: theme.spacing(9),
  },
  MainUserAvatarThree: {
    width: theme.spacing(7),
  },
  MainUserAvatarFour: {
    width: theme.spacing(5),
  },
  MainVsVar: {
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    top: '5px',
    left: '0',
    width: '100%',
  },
  JoinChallengebtnParent: {
    display: 'flex',
    justifyContent: 'center',
  },
  JoinChallengebtn: {
    width: theme.spacing(15),
    height: theme.spacing(4),
    borderRadius: theme.spacing(2),
    textTransform: 'none',
    backgroundColor: '#352460',
    '&:hover': {
      backgroundColor: '#ed51a3',
    },
  },

  subOppointmentBottom: {
    background: '#161521',
    marginTop: '-24px',
    height: theme.spacing(15),
    width: 'calc(100% - 8px)',
    marginLeft: '4px',
    borderRadius: theme.spacing(0, 0, 2, 2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  freeChallenge: {
    background: 'linear-gradient(#02cf75, #00e9a2, #17c1aa)',
    '& button': {
      background: 'linear-gradient(#17c1aa, #00e9a2, #02cf75)',
    },
  },
  FeeChallenge: {
    background: 'linear-gradient(#c9c597, #dfc871, #bb983d)',
    '& button': {
      background: 'linear-gradient(#bb983d, #dfc871, #c9c597)',
    },
  },
  FreeFeeBoth: {
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    height: theme.spacing(6),
    borderRadius: theme.spacing(3),
    '& button': {
      color: 'black',
      marginLeft: theme.spacing(1),
      borderRadius: theme.spacing(3),
      height: theme.spacing(5),
    },
    '& div': {
      color: 'black',
      textAlign: 'center',
      width: 'calc(100% - 80px)',
    },
  },

  RewardAmount: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px',
    '& .RewardTitle': {
      background: '-webkit-linear-gradient(#fcf8e6, #d1b467)',
      textAlign: 'center',
      fontWeight: '700',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    '& .RealRewardAmount': {
      fontSize: '25px',
      background: '-webkit-linear-gradient(#fcf8e6, #d1b467)',
      textAlign: 'center',
      fontWeight: '700',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    '& .RewardTitleGold': {
      fontWeight: '700',
      color: 'black',
    },
    '& .RealRewardAmountGold': {
      fontSize: '25px',
      fontWeight: '700',
      color: 'black',
    },
  },
}));

export default useStyles;
