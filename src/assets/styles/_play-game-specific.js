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
    display: 'inline-block',
    textAlign: 'right',
  },
  leaderboardPodium: {
    backgroundSize: '478px',
    width: '478px',
    height: '495px',
    backgroundRepeat: 'no-repeat',
    backgroundPositionY: 'bottom',
    margin: 'auto',
  },
  podiumBronze: {
    width: '100%',
    textAlign: 'center',
    marginTop: '45%',
    fontFamily: 'Poppins, Aldrich',
    marginLeft: '1px',

    '& div': {
      fontFamily: 'Poppins, Aldrich',
      marginBottom: '3px',
    },
    '& div.UserName': {
      fontSize: '17px',
      marginBottom: '17px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      lineHeight: '21px',
    },

    '& div.podiumFlag': {
      marginTop: '31px',
      position: 'relative',
      left: '2px',
      '& img': {
        width: '46px',
      },
    },
  },
  podiumSilver: {
    width: '100%',
    textAlign: 'center',
    marginTop: '20%',
    fontFamily: 'Poppins, Aldrich',
    marginLeft: '-4px',

    '& div': {
      fontFamily: 'Poppins, Aldrich',
      marginBottom: '3px',
    },
    '& div.UserName': {
      fontSize: '17px',
      marginBottom: '17px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      lineHeight: '21px',
    },

    '& div.podiumFlag': {
      marginTop: '32px',
      left: '-2px',
      position: 'relative',
      '& img': {
        width: '46px',
      },
    },
  },
  podiumGold: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Poppins, Aldrich',
    top: '-66px',
    position: 'relative',

    '& div': {
      fontFamily: 'Poppins, Aldrich',
    },
    '& div.UserName': {
      fontSize: '17px',
      marginBottom: '17px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      lineHeight: '21px',
    },

    '& div.podiumFlag': {
      marginTop: '46px',
      '& img': {
        width: '46px',
      },
    },
  },
  podiumAvatarWrapper: {
    marginBottom: '10px',
  },
  podiumAvatar: {
    margin: 'auto',
    height: '60px',
    width: '63px',
    borderRadius: '50%',
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
