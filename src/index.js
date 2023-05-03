import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Web3ReactProvider } from '@web3-react/core';
import { ModalProvider } from '@pancakeswap/uikit';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { ToastContainer } from 'react-toastify';
import { ResetCSS } from '@pancakeswap/uikit';

import App from './App';
import report from './report';
import AppModal from './components/AppModal';
import { MuiTheme as ThemeProvider } from './theme';
import { getLibrary } from './utils/web3React';
import { PRE } from './hooks';
import configureStore from './redux/store';
import { ThemeContextProvider } from './contexts/ThemeContext';

//  ** Import scss
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/swiper.min.css';
import 'swiper/components/navigation/navigation.min.css';
import './assets/sass/index.scss';

const renderApp = (preloadedStates) => {
  const store = configureStore(preloadedStates);
  ReactDOM.render(
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeContextProvider>
        <ThemeProvider>
          <Provider store={store.store}>
            <PersistGate persistor={store.persistor}>
              <ModalProvider>
                <ResetCSS />
                <App />
              </ModalProvider>
              <AppModal />
              {/* <DetectPlatform /> */}
            </PersistGate>
          </Provider>
        </ThemeProvider>
      </ThemeContextProvider>
      <ToastContainer position="top-right" />
    </Web3ReactProvider>,
    document.getElementById('app-root')
  );
  report();
};

(async () => renderApp(await PRE.sessionCheck()))();
