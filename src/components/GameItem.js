import { Grid } from '@material-ui/core';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import MouseIcon from '@material-ui/icons/Mouse';

const GameItem = ({ item, ActiveGame }) => {
  return (
    <Grid className="game-holder">
      <Grid className="game-image-wrapper">
        <Grid className="game-image-holder">
          <Grid className="game-image-overlay">
            {item?.keyboard && <DesktopMacIcon />}
            {item?.joystick && <SportsEsportsIcon />}
            {item?.mouse && <MouseIcon />}
          </Grid>
          <Grid
            className="game-image-bg"
            style={{
              backgroundImage: `url(${process.env.REACT_APP_API_URL}/${item.img})`,
            }}
          />
          <Grid className="game-action gameActionIcon">
            <p className="playBtn" onClick={() => ActiveGame(item)}>
              Play the Game
            </p>
          </Grid>
          <Grid className="game-info">
            <span className="game-name">
              <span>{item.title}</span>
            </span>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GameItem;
