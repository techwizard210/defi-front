import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  itemCard: {
    borderRadius: '24px',
  },
  currentlyActive: {
    border: '3px solid green',
  },
  currentlyActiveHeader: {
    padding: '8px',
    marginTop: '5px',
    marginBottom: '10px',
  },
  boostHeading: {
    marginBottom: '40px',
  },
  boostWarning: {
    color: '#CB3A4D',
    fontSize: '14px',
  },
}));

export default useStyles;
