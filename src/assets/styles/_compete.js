import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  gameHeading: {
    fontFamily: 'Poppins, Aldrich',
    fontSize: '38px',
    marginBottom: '25px',
  },
  tabWrapper: {
    padding: '24px',
    background: 'rgba(0,0,0,.24)',
  },
  playTab: {
    marginTop: theme.spacing(2),
  },
  playInfo: {},
  playInfoRow: {
    fontFamily: 'Poppins, Aldrich',
  },
  playGameWindow: {
    marginTop: theme.spacing(2),
  },
  leaderboardTab: {
    marginTop: theme.spacing(2),
  },
  leaderboardPodiumWrapper: {
    height: '400px',
    display: 'inline-block',
    textAlign: 'right',
    marginTop: '30px',
  },
  leaderboardPodium: {
    backgroundSize: '375px',
    width: '375px',
    height: '375px',
    backgroundRepeat: 'no-repeat',
    margin: 'auto',
  },
  leaderboardList: {
    marginTop: theme.spacing(2),
  },
  leaderboardRankItem: {
    width: '10%',
    minWidth: '56px',
    flex: 'none',
    '& span': {
      color: '#009878',
    },
  },
  leaderboardAvatarItem: {
    width: '10%',
  },
  leaderboardCupItem: {
    width: '10%',
    '& img': {
      width: '25px',
    },
  },
  leaderboardUserAddress: {
    width: '50%',
    overflow: 'hidden',
    padding: '2px',
    '& span': {
      fontSize: '18px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  },
  leaderboardScore: {
    width: '15%',
    textAlign: 'center',
    padding: '2px',
    '& span': {
      fontSize: '20px',
    },
  },
  leaderboardTimeItem: {
    width: '15%',
    textAlign: 'right',
    padding: '5px',
    '& span': {
      fontSize: '13px',
    },
  },
}));

export default useStyles;
