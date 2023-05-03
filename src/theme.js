// ** Import Headers
import { useEffect } from 'react';

import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { CssBaseline } from '@material-ui/core';
import { createBrowserHistory } from 'history';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Routes from './config/routes.json';
import Mode from './config/theme.json';

// ** Declare Theme Provider
export const MuiTheme = ({ children }) => {
  const storedMode = sessionStorage.getItem('themeMode');
  const themeMode = storedMode || 'dark';
  const theme = createTheme(Mode[themeMode]);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

// ** Declare Style Provider
export const Styles = ({ children }) => {
  return (
    <>
      {children}
      <CssBaseline />
    </>
  );
};

// ** Declare Route Provider
export const To = (pageName) => {
  // document.title = Routes[pageName].title;
  return {
    exact: true,
    path: Routes[pageName].path,
  };
};

// ** Declare Notification Provider
export const NotificationProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    const alert = (message, variant) => {
      enqueueSnackbar(message, { variant });
    };
    window.alert = alert;
  }, [enqueueSnackbar]);
  return <>{children}</>;
};

// ** Declare Auth Provider
export const AuthProvider = ({ children }) => {
  const isSession = useSelector((state) => state.auth.isSession);
  const history = useHistory();
  useEffect(() => {
    if (history.location.pathname === '/') {
      if (isSession) {
        if (sessionStorage.getItem('rememberMe') === 'true') {
          history.push('/dashboard');
          window.location.reload();
        }
      }
    } else if (!isSession) {
      history.push('/');
      window.location.reload();
    }
  }, [isSession, history]);
  return children;
};

// ** Declare History As Global
export const History = createBrowserHistory({
  basename: '',
  forceRefresh: false,
});

// ** Declare Check Response Func
export const checkResponse = (response) => {
  switch (response) {
    case 'success': {
      alert('Successful', 'success');
      break;
    }
    case 'exist': {
      alert('Alredy Exist', 'info');
      break;
    }
    case 'not found': {
      alert('Email or Password is incorrect.', 'error');
      break;
    }
    case 'block': {
      alert('You are blocked by admin', 'warning');
      break;
    }
    case 'error': {
      alert('Something went wrong!', 'error');
      break;
    }
    default: {
      alert(response.toString(), 'error');
    }
  }
};
