import { isMobile } from 'react-device-detect';

// ** Import Material-Ui Components

import { Grid } from '@material-ui/core';

import PendingInviteList from './PendingInviteList';
import ScholarList from './ScholarList';

const Scholars = (props) => {
  const { wipeSignatureAndReRequest } = props;

  return (
    <div className={`scholars ${isMobile ? 'mobile' : ''}`}>
      <Grid container>
        <Grid item lg={4} md={4} sm={12} xs={12} className="pendingInvitesList">
          <PendingInviteList
            wipeSignatureAndReRequest={wipeSignatureAndReRequest}
          />
        </Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className="membersList">
          <ScholarList wipeSignatureAndReRequest={wipeSignatureAndReRequest} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Scholars;
