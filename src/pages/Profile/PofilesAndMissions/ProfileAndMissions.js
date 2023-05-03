import Grid from '@material-ui/core/Grid';

import Missions from './Missions';
import Profile from './Profile';

const ProfileAndMissions = () => {
  return (
    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
      <Grid container spacing={1} className="miningRewards">
        <Grid item container spacing={1}>
          <Profile />
          <Missions />
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfileAndMissions;
