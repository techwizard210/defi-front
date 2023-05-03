import { Suspense } from 'react';
import { Router } from 'react-router-dom';

import Spinner from './components/Spinner';
import Routes from './Routes';
import { History } from './theme';

const AppRouter = () => {
  return (
    <Router history={History}>
      <Suspense fallback={<Spinner />}>
        <Routes />
      </Suspense>
    </Router>
  );
};
export default AppRouter;
