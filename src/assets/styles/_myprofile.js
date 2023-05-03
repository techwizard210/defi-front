import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  marginTop2: {
    marginTop: theme.spacing(2),
  },
  marginBottom5: {
    marginBottom: theme.spacing(5),
  },
  editProfile: {
    fontSize: '36px',
    // fontFamily: theme.typography.custom.arcade,
    // color: theme.palette.custom.brillRoseColor,
    color: 'white',
    fontWeight: 700,
  },
  profileDesc: {
    fontSize: '22px',
    // fontFamily: theme.typography.custom.arcade,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  inputField: {
    color: 'white',
    marginBottom: theme.spacing(5),
    '& input': {
      fontSize: '16px',
      fontWeight: 500,
    },
    '& label': {
      fontSize: '17px',
      fontWeight: 900,
      color: 'white',
    },
  },
  updateProfileBtn: {
    backgroundColor: '#3F8CFF',
    color: 'white',
    fontSize: '15px',
    fontWeight: 900,
    borderRadius: '12px',
    textTransform: 'none',
  },
  userAvatar: {
    width: '100px',
    borderRadius: '50px',
  },
}));

export default useStyles;
