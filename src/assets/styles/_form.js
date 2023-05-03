import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
}));

export default useStyles;
