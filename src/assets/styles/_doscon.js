import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  dosplayer: {
    '& canvas': {
      width: '800px',
      height: '700px',
    },
  },
}));

export default useStyles;
