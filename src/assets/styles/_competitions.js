import { makeStyles } from '@material-ui/styles';

// const defaultBg = 'rgba(228, 228, 228, 0.05)'

const useStyles = makeStyles((theme) => ({
  CompetitionsHeading: {
    fontFamily: 'arcade-interlaced',
    textAlign: 'center',
    color: '#ed51a3',
    marginBottom: '10px',
    marginTop: '10px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '25px',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '40px',
    },
  },
  CompSectionHeader: {
    padding: '20px',
    '& span': {
      fontSize: '29px',
      fontFamily: 'Poppins',
      fontWeight: '600',
    },
  },
  CompWrapper: {
    borderRadius: '12px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    marginBottom: '40px',
    backgroundAttachment: 'unset',
  },
  CompContent: {
    backgroundColor: 'white',
    color: 'black',
  },
  CompActions: {
    backgroundColor: 'white',
    color: 'black',
  },
  CompTitle: {
    fontFamily: 'Poppins',
    fontSize: '20px',
    fontWeight: '600',
    padding: '5px',
    color: 'white',

    [theme.breakpoints.down('sm')]: {
      fontSize: '25px',
      marginBottom: '10px',
      paddingLeft: '0px',
    },
  },
  CompLogo: {
    width: '100%',
    border: '3px solid yellow',
  },
  CompActiveDates: {
    textAlign: 'right',
    position: 'relative',
    color: 'white',
    fontSize: '20px',
    padding: '3px',
    borderRadius: '5px',
    paddingLeft: '9px',
    paddingRight: '9px',
    fontFamily: 'poppins',
    fontWeight: '600',

    [theme.breakpoints.down('sm')]: {
      textAlign: 'left',
      paddingLeft: '0px',
    },
  },
  CompSignUpButton: {
    float: 'right',
    position: 'relative',
    background: 'green',
    color: 'white',
    padding: '10px',
    fontSize: '20px',
    '& span': {
      fontFamily: 'Poppins',
    },
  },
  ViewStandingsButtonWrapper: {
    textAlign: 'center',
  },
  CompStandingsButton: {
    position: 'relative',
    background: 'green',
    color: 'white',
    padding: '10px',
    fontSize: '20px',
    '& span': {
      fontFamily: 'Poppins',
    },
  },
  perGameContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  CompGamesWrapper: {
    marginTop: '10px',
  },
  leaderboardPodiumWrapper: {
    marginTop: '10px',
  },
  leaderboardPodium: {
    backgroundSize: '250px',
    width: '250px',
    height: '285px',
    backgroundRepeat: 'no-repeat',
    backgroundPositionY: 'bottom',
    margin: 'auto',
  },
  podiumBronze: {
    marginTop: '60%',
    marginLeft: '1px',

    '& div': {
      marginBottom: '3px',
    },

    '& div.podiumFlag': {
      marginTop: '31px',
      left: '2px',
    },
  },
  podiumSilver: {
    marginTop: '30%',
    marginLeft: '-4px',

    '& div': {
      marginBottom: '3px',
    },

    '& div.podiumFlag': {
      marginTop: '32px',
      left: '-2px',
    },
  },
  podiumGold: {
    top: '-25px',

    '& div.podiumFlag': {
      marginTop: '46px',
    },
  },
  podiumPosition: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Poppins, Aldrich',
    position: 'relative',
    color: 'white',

    '& div': {
      fontFamily: 'Poppins, Aldrich',
    },
    '& div.podiumFlag': {
      position: 'relative',
      '& img': {
        width: '46px',
      },
    },
  },
  podiumUserName: {
    fontSize: '17px',
    marginBottom: '6px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    lineHeight: '21px',
    maxHeight: '21px',
  },
  podiumAvatarWrapper: {
    marginBottom: '10px',
  },
  podiumAvatar: {
    margin: 'auto',
    height: '33px',
    width: '35px',
  },
  PrizePoolHeading: {
    marginBottom: '10px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '18px',
    },

    '& span': {
      fontSize: '31px',
      fontFamily: 'Poppins',
      color: 'gold',
      fontWeight: '600',
    },
  },
  PrizeRow: {
    marginTop: '18px',
    fontWeight: '600',
    '& span': {
      fontFamily: 'Poppins',
      fontSize: '30px',
      color: 'white',

      '&.first': {
        color: 'gold',
      },
      '&.second': {
        color: 'silver',
      },
      '&.third': {
        color: '#b73636;',
      },
    },
  },
  CompGamesHeader: {
    textAlign: 'right',
    position: 'relative',
    color: 'white',
    fontSize: '20px',
    padding: '3px',
    borderRadius: '5px',
    paddingLeft: '9px',
    paddingRight: '9px',
    fontFamily: 'poppins',
    fontWeight: '600',

    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      paddingLeft: '0px',
      marginTop: '18px',
    },
  },
  EnrolledText: {
    float: 'right',
    padding: '10px',
    color: 'white',
    marginRight: '20px',
    fontSize: '20px',
    fontFamily: 'Poppins',
    background: 'red',
    borderRadius: '12px',
  },
  CompInfoHeading: {
    marginBottom: '10px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '18px',
    },

    '& span': {
      fontSize: '31px',
      fontFamily: 'Poppins',
      color: 'white',
      fontWeight: '600',
    },
  },
  CompInfoRow: {
    marginTop: '18px',
    fontWeight: '600',
    '& span': {
      fontFamily: 'Poppins',
      fontSize: '19px',
      color: 'white',
    },
  },
}));

export default useStyles;
