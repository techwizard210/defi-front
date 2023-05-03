import { makeStyles } from '@material-ui/styles';

const defaultborderColor = 'rgba(128, 129, 145, 0.1)';
// const defaultColor = '#ed51a3'
// const defaultColorGrey = '#575863'

const useStyles = makeStyles((theme) => ({
  // Main
  root: {
    flexGrow: 1,
    padding: '10px',
  },
  checkavatarm: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },

  // Tabs
  mycustomtabs: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    '& .MuiTab-wrapper': {
      fontSize: theme.spacing(3),
      textTransform: 'capitalize',
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#eee',
    },
  },

  // Profile
  profile: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileimg: {
    width: theme.spacing(22),
    height: theme.spacing(20),
  },

  profileresults: {
    '&:first-child': {
      marginBottom: theme.spacing(3),
    },
  },

  // Result1
  result1title: {
    padding: theme.spacing(0, 3, 0, 3),
    fontSize: '1.5rem',
    color: '#8B97AF',
  },
  result1score: {
    padding: theme.spacing(0, 3, 0, 3),
    fontSize: theme.spacing(5),
    fontFamily: 'cursive',
  },

  // Result2
  result2: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: '3%',
  },
  result2title: {
    color: '#8B97AF',
    padding: theme.spacing(3, 3, 0, 3),
    display: 'flex',
    alignItems: 'center',
    fontSize: theme.spacing(3),
  },
  result2score: {
    padding: theme.spacing(0, 3, 0, 3),
    fontSize: theme.spacing(5),
    fontWeight: theme.spacing(80),
  },
  result2process: {
    padding: theme.spacing(0, 3, 3, 3),
    '& .MuiLinearProgress-root': {
      clipPath: 'polygon(15% 0%, 85% 0%, 100% 50%, 85% 100%, 15% 100%, 0% 50%)',
    },
  },
  perscore: {
    borderRight: `1px solid ${defaultborderColor}`,
    '&:last-child': {
      border: 'none',
    },
  },

  // Recently played
  RecentlyPlayedCardWrapper: {
    width: '95%',
    border: '1px solid #a4a4aa',
  },
  RecentlyTitle: {
    fontSize: '3rem',
  },
  recentlyimglist: {
    display: 'flex',
  },
  recentlygameimg: {
    width: '100%',
    height: theme.spacing(20),
    marginRight: theme.spacing(3),
  },
  rewardAvailableHeading: {
    color: '#ed51a3',
    fontWeight: '700',
  },

  // Headline Figures
  headlineFigureCardWrapper: {
    width: '95%',
    border: '1px solid #a4a4aa',
  },
  headlineFigureCardContent: {
    padding: '9px',
    paddingTop: '6px',
    backgroundColor: 'rgb(79 82 155)',
  },
  headlineFiguresTitle: {
    fontSize: '24px',
  },
  headlineFigureValue: {
    textAlign: 'right',
    paddingRight: '15px',
    fontSize: '40px',
    position: 'relative',
  },
  sectionDividerHeading: {
    fontSize: '34px',
    fontWeight: '500',
  },
  headlineRule: {
    marginBottom: '40px',
    width: '80%',
  },
  rewardLevel: {
    float: 'right',
  },
  miningRewards: {
    backgroundColor: 'rgba(0,0,0,.24)',
    padding: theme.spacing(5),
    borderRadius: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default useStyles;
