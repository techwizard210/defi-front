import { isMobile } from 'react-device-detect';

// ** Import Material-Ui Components

import { Grid } from '@material-ui/core';

import MemberList from './MemberList';
import PendingInviteList from './PendingInviteList';

const Members = (props) => {
  const { wipeSignatureAndReRequest } = props;

  return (
    <div className={`members ${isMobile ? 'mobile' : ''}`}>
      <Grid container>
        <Grid item lg={4} md={4} sm={12} xs={12} className="pendingInvitesList">
          <PendingInviteList
            wipeSignatureAndReRequest={wipeSignatureAndReRequest}
          />
        </Grid>
        <Grid item lg={8} md={8} sm={12} xs={12} className="membersList">
          <MemberList wipeSignatureAndReRequest={wipeSignatureAndReRequest} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Members;
