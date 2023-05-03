import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  mobileNavLines: {
    paddingTop: '17px',
    fontSize: '30px',
  },

  mobileMenuMask: {
    background: '#000000b5',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 50,
  },

  mobileMenu: {
    position: 'fixed',
    zIndex: 50,
    left: '0',
    top: '96px',
    width: '100%',
    backgroundColor: '#272a54',
    padding: '20px',
    marginTop: '15px',
  },

  mobileLoggedIn: {
    top: '126px',
  },

  menuFont: {
    fontFamily: "'Poppins', Aldrich",
  },

  mobileFontAwesomeMenuOption: {
    fontSize: '20px',
    paddingLeft: '1px',
  },

  mobileBonzai: {
    marginTop: '-2px',
    width: '40px',
    left: '-7px',
    position: 'relative',
    marginBottom: '-6px',
  },

  allignCenter: {
    textAlign: 'center',
  },

  mobileMerits: {
    marginRight: 0,
  },
}));

export default useStyles;
