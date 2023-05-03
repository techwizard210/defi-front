import { v4 as uuid_v4 } from 'uuid';

// ** Import Material-Ui Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';

import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const LevelTrackDialog = (props) => {
  const { open, handleClose, levelTrack, currentLevel } = props;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      className="levelTrackModal"
    >
      <DialogTitle id="max-width-dialog-title" style={{ textAlign: 'center' }}>
        Level Rewards
      </DialogTitle>
      <DialogContent className="body">
        <Grid container>
          {levelTrack?.length > 0 &&
            levelTrack.map((level) => (
              <Grid
                key={uuid_v4()}
                item
                container
                lg={12}
                md={12}
                sm={12}
                xs={12}
              >
                <Grid
                  key={uuid_v4()}
                  item
                  lg={2}
                  md={2}
                  sm={2}
                  xs={2}
                  className="progressColumn"
                >
                  <div
                    className={`progressLight ${
                      currentLevel >= level.level ? 'active' : ''
                    }`}
                  >
                    <div className="progressBobble" />
                  </div>
                </Grid>
                <Grid
                  key={uuid_v4()}
                  item
                  lg={10}
                  md={10}
                  sm={10}
                  xs={10}
                  className={`levelInfoColumn ${
                    currentLevel >= level.level ? 'active' : ''
                  }`}
                >
                  <Grid item lg={12} md={12} sm={12} xs={12} className="level">
                    Level {level.level}
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12} className="xpReq">
                    XP Required: {level.xpRequirement}
                  </Grid>
                  {level.perks?.length > 0 && (
                    <Grid
                      item
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className="perks"
                    >
                      <>
                        Perks
                        {level.perks?.length > 0 &&
                          level.perks.map((perk) => (
                            <Grid
                              key={uuid_v4()}
                              item
                              lg={12}
                              md={12}
                              sm={12}
                              xs={12}
                              className="perk"
                            >
                              <PersonAddAltIcon className="icon" />
                              <span className="description">
                                {perk.description}
                              </span>
                            </Grid>
                          ))}
                      </>
                    </Grid>
                  )}
                  <hr />
                </Grid>
              </Grid>
            ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LevelTrackDialog;
