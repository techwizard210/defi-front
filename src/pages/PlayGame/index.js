import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  Suspense,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import { v4 as uuid_v4 } from 'uuid';

// ** Import Material-Ui Components
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { useWeb3React } from '@web3-react/core';

// ** Import MobileView
import { BrowserView, MobileView } from 'react-device-detect';
import 'firebase/firestore';

// ** Import Assets
import useStyles from '../../assets/styles';
// ** Import SVG Icons
import PlayIcon from '../../assets/icons/play.svg';

import StartMainImage from '../../assets/img/start.png';

import { _isValidChainId } from '../../helpers/index';
import { walletAuthFetchWithSigPrompt } from '../../helpers/apiFetchWrappers';

// ** Import Components
import Spinner from '../../components/Spinner';

// **  Import contract DATA
import { getCookie } from '../../helpers';

import Leaderboard from './Leaderboard';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const PlayGame = (props) => {
  const { wipeSignatureAndReRequest } = props;
  const { gameId } = useParams();
  // ** Define Maintainers
  const classes = useStyles.playGame();
  const playGameSpecificClasses = useStyles.playGameSpecific();

  const dosclass = useStyles.doscon();
  const modalclasses = useStyles.modal();

  const _isMounted = useRef(true); // Initial value _isMounted = true
  const profile = useSelector((state) => state.profile);

  const { account, chainId } = useWeb3React();

  const signature = getCookie(`base64Sig-${account}`);

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [keyOpen, setKeyOpen] = useState(false);
  const [confirm_open, confirm_setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [timeCounter, setTimeCounter] = useState('00:00:00');
  const [lastIdletime, setLastIdletime] = useState(null);
  const [elapsedTimeIntervalRef, setElapsedTimeIntervalRef] = useState('');
  const [control, setControl] = useState('key');
  const minimumTimeToPlay = process.env.REACT_APP_MINIMUM_PLAY_FOR_REWARD;

  const [currentGame, setCurrentGame] = useState(null);
  const [keyImage, setKeyImage] = useState(null);
  const [fetchingGame, setFetchingGame] = useState(false);

  const [sessionId, setSessionId] = useState(null);

  // Stores the elapsed time hours, minutes and seconds details on pause
  const storeElapsedTimeOnPause = () => {
    // Break down elapsed time from display test
    const brokenDownElapsedTime = timeCounter.split(':');

    // Convert list to numbers
    const brokenDownElapsedTimeAsNumbers = brokenDownElapsedTime.map(
      (numberAsString) => parseInt(numberAsString, 10)
    );
    const hours =
      brokenDownElapsedTimeAsNumbers.length === 3
        ? brokenDownElapsedTimeAsNumbers[0]
        : 0;
    const minutes =
      brokenDownElapsedTimeAsNumbers.length === 3
        ? brokenDownElapsedTimeAsNumbers[1]
        : brokenDownElapsedTimeAsNumbers[0];
    const seconds =
      brokenDownElapsedTimeAsNumbers.length === 3
        ? brokenDownElapsedTimeAsNumbers[2]
        : brokenDownElapsedTimeAsNumbers[1];
    return parseInt(hours, 10) * 60 * 60 + parseInt(minutes, 10) * 60 + seconds;
  };

  const getElapsedTime = (startTime) => {
    // Record end time
    const endTime = new Date();
    // Compute time difference in milliseconds
    let timeDiff = endTime.getTime() - startTime;
    // Convert time difference from milliseconds to seconds
    timeDiff /= 1000;
    // Extract integer seconds that dont form a minute using %
    const seconds = Math.floor(timeDiff % 60); // ignoring uncomplete seconds (floor)
    // Pad seconds with a zero if neccessary
    const secondsAsString = seconds < 10 ? `0${seconds}` : `${seconds}`;
    // Convert time difference from seconds to minutes using %
    timeDiff = Math.floor(timeDiff / 60);
    // Extract integer minutes that don't form an hour using %
    const minutes = timeDiff % 60; // no need to floor possible incomplete minutes, becase they've been handled as seconds
    // Pad minutes with a zero if neccessary
    const minutesAsString = minutes < 10 ? `0${minutes}` : `${minutes}`;
    // Convert time difference from minutes to hours
    timeDiff = Math.floor(timeDiff / 60);
    // Extract integer hours that don't form a day using %
    const hours = timeDiff % 24; // no need to floor possible incomplete hours, becase they've been handled as seconds
    // Convert time difference from hours to days
    timeDiff = Math.floor(timeDiff / 24);
    // The rest of timeDiff is number of days
    const days = timeDiff;

    const totalHours = hours + days * 24; // add days to hours
    const totalHoursAsString =
      totalHours < 10 ? `0${totalHours}` : `${totalHours}`;

    return totalHoursAsString === '00'
      ? `${minutesAsString}:${secondsAsString}`
      : `${totalHoursAsString}:${minutesAsString}:${secondsAsString}`;
  };

  /** Pauses stopwatch */
  const pauseTimeCounter = () => {
    // Clear interval
    if (typeof elapsedTimeIntervalRef !== 'undefined') {
      clearInterval(elapsedTimeIntervalRef);
      setElapsedTimeIntervalRef(undefined);
    }
    // Store the elapsed time on pause
    return storeElapsedTimeOnPause();
  };

  const confirmHandleClickOpen = () => {
    confirm_setOpen(true);
  };

  const playGame = async (callBack) => {
    if (!account) {
      toast.error('Please connect your wallet.');
      return;
    }
    setLoading(true);

    if (!account || !chainId || !(await _isValidChainId())) {
      toast.error('Unsupported Network. Please change the network BSC Testnet');
      setLoading(false);
      return;
    }

    if (currentGame.highScoreCompatible) {
      const localSignature = getCookie(`signature-${account}`);
      if (!localSignature || localSignature === '') {
        wipeSignatureAndReRequest(
          () => {
            setLoading(false);
            callBack();
          },
          () => {
            setLoading(false);
            console.log('error');
          }
        );

        return;
      }
    }

    callBack();
  };

  const continueGameHandle = async () => {
    const startedTime = new Date();
    let interval = null;

    interval = setInterval(() => {
      // Compute the elapsed time & display
      let gamestartTime = 0;
      if (lastIdletime !== null) {
        gamestartTime = startedTime.getTime() - lastIdletime + 1000 * 60;
        setLastIdletime(null);
      } else {
        gamestartTime = startedTime.getTime();
      }
      setTimeCounter(getElapsedTime(gamestartTime)); // pass the actual record start time
      // Improvement: Can Stop elapsed time and resert when a maximum elapsed time
      //              has been reached.
    }, 1000);
    setElapsedTimeIntervalRef(interval);

    const options = {
      mode: 'cors',
      body: JSON.stringify({ gameId, walletId: account }),
    };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const sessionIdResp = await walletAuthFetchWithSigPrompt(
      'Play/StartGame',
      'POST',
      wipeSignatureAndReRequest,
      account,
      options,
      true,
      headers
    );
    if (sessionIdResp) {
      setSessionId(sessionIdResp.sessionId);
    }

    setKeyOpen(false);
    setOpen(true);
    setTimeout(() => {
      if (document.querySelector('.gameframe')) {
        document.querySelector('.gameframe').focus();
      }
    }, 5000);
  };

  const browserPlayGame = async () => {
    await playGame(() => {
      setLoading(false);
      setKeyOpen(true);
      dispatch({
        type: 'ADD_HISTORY',
        payload: currentGame,
      });
    });
  };

  const mobilePlayGame = async () => {
    await playGame(() => {
      setLoading(false);
      setOpen(true);
      continueGameHandle();
      dispatch({
        type: 'ADD_HISTORY',
        payload: currentGame,
      });
    });
  };

  // Confirm To Close Game Play
  const confirm_handleClose = () => {
    confirm_setOpen(false);
  };

  // Close Game Play
  const handleClose = async () => {
    const totalPlayedTime = pauseTimeCounter();
    setOpen(false);
    confirm_setOpen(false);

    if (account) {
      const options = {
        mode: 'cors',
        body: JSON.stringify({ sessionId, walletId: account }),
      };
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const finishGameResponse = await walletAuthFetchWithSigPrompt(
        'Play/FinishGame',
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        true,
        headers
      );

      if (
        finishGameResponse &&
        finishGameResponse.tokenCount !== profile?.tokenCount &&
        profile?.tokenCount !== 5
      ) {
        profile.tokenCount = finishGameResponse.tokenCount;
        profile.tokenType = finishGameResponse.tokenType;

        dispatch({ type: 'PROFILE', payload: profile });
      }
    }

    if (totalPlayedTime < Number(minimumTimeToPlay) * 60) {
      toast.error(
        `Sorry! Please play for at least ${minimumTimeToPlay} minutes for the play session to be eligible for the daily mission.`
      );
    }
  };

  const fetchCurrentGame = useCallback(async () => {
    const getGameFromApi = async () => {
      if (!fetchingGame) {
        setFetchingGame(true);
        const url = `GameManagement/GetGame/${gameId}`;
        try {
          const game = await walletAuthFetchWithSigPrompt(
            url,
            'GET',
            wipeSignatureAndReRequest,
            account,
            null,
            true,
            null
          );

          setCurrentGame(game);
          setKeyImage(
            `${process.env.REACT_APP_API_URL}/${game.keyboardControlsImage}`
          );
        } catch (error) {
          console.log('Failed to fetch game');
        }
      }
    };

    await getGameFromApi();
  }, [account, fetchingGame, gameId, wipeSignatureAndReRequest]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (gameId) {
      fetchCurrentGame();
    }

    return () => {
      _isMounted.current = false;
    };
  }, [fetchCurrentGame, gameId]);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const TabSection = () => {
    return (
      <>
        <Grid container>
          <Grid item lg={12} sm={12} xs={12} className={classes.mycustomtabs}>
            <Grid
              item
              lg={12}
              md={12}
              sm={12}
              xs={12}
              container
              direction="row"
              className={playGameSpecificClasses.gameHeading}
            >
              {currentGame?.title}
            </Grid>
            <Tabs
              value={value}
              indicatorColor="primary"
              onChange={handleChange}
              aria-label="disabled tabs example"
            >
              <Tab
                label="Play"
                className={playGameSpecificClasses.playInfoRow}
              />
              {currentGame && currentGame.highScoreCompatible && (
                <Tab
                  label="High Scores"
                  className={playGameSpecificClasses.playInfoRow}
                />
              )}
            </Tabs>
          </Grid>
        </Grid>
      </>
    );
  };

  function TabPanel(tabPanelProps) {
    const { children, index } = tabPanelProps;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {value === index && (
          <Box className={playGameSpecificClasses.tabWrapper}>{children}</Box>
        )}
      </div>
    );
  }

  const PublisherInfoRow = (info) => {
    // eslint-disable-next-line no-shadow
    const { label, value } = info;
    return (
      <Grid container spacing={5} key={uuid_v4()}>
        <Grid item xs={12} sm={3} lg={3}>
          <span className={playGameSpecificClasses.playInfoRow}>{label}</span>
        </Grid>
        <Grid item xs={12} sm={9} lg={9}>
          <span className={playGameSpecificClasses.playInfoRow}>{value}</span>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <BrowserView>
        {!keyOpen && !open && (
          <>
            <div
              style={{
                position: 'absolute',
                width: '95vw',
                height: '77vh',
                zIndex: '-1',
              }}
            >
              <div
                style={{
                  backgroundImage: `url(${
                    currentGame?.img
                      ? `${process.env.REACT_APP_API_URL}/${currentGame.img}`
                      : StartMainImage
                  })`,
                }}
              />
            </div>
            <Box>
              <TabSection />
              <TabPanel value={value} index={0}>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={6}
                    className={playGameSpecificClasses.playInfo}
                  >
                    {currentGame ? (
                      <>
                        {currentGame?.additionalInfo?.length > 0 &&
                          currentGame.additionalInfo.map((info) =>
                            PublisherInfoRow(info)
                          )}

                        {currentGame?.additionalInfo?.length > 0 ? (
                          PublisherInfoRow({
                            label: 'Info',
                            value: currentGame.description,
                          })
                        ) : (
                          <CardContent className={classes.mContent}>
                            <Typography
                              variant="h4"
                              className={classes.mCurrentTitle}
                            >
                              {currentGame.description}
                            </Typography>
                          </CardContent>
                        )}
                      </>
                    ) : (
                      <>{fetchingGame && <Suspense fallback={<Spinner />} />}</>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={6}
                    className={classes.parentVideo}
                  >
                    <Card className={classes.root}>
                      <Box className={classes.overlayPanel}>
                        <CardMedia
                          className={classes.media}
                          image={
                            currentGame?.img
                              ? `${process.env.REACT_APP_API_URL}/${currentGame.img}`
                              : StartMainImage
                          }
                          component="div"
                          title="Live Game"
                        />

                        <Box className={classes.overlay}>
                          <IconButton
                            className={classes.playButton}
                            onClick={browserPlayGame}
                          >
                            {isLoading ? (
                              <CircularProgress color="secondary" />
                            ) : (
                              <img src={PlayIcon} alt="PlayIcon Icon" />
                            )}
                          </IconButton>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              {currentGame?.highScoreCompatible && (
                <TabPanel value={value} index={1}>
                  <Leaderboard
                    currentGame={currentGame}
                    wipeSignatureAndReRequest={wipeSignatureAndReRequest}
                  />
                </TabPanel>
              )}
            </Box>
          </>
        )}

        {currentGame && (
          <>
            <Dialog
              disableEscapeKeyDown
              fullScreen
              open={keyOpen}
              TransitionComponent={Transition}
            >
              <AppBar className={classes.appBar}>
                <Toolbar className={classes.headerTitle}>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={async () => {
                      setKeyOpen(false);
                    }}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <Box className={classes.keyControlContent}>
                {currentGame?.joystickImage === undefined ? (
                  <img
                    alt={`${currentGame?.title}`}
                    src={keyImage}
                    className={classes.keyControlImage}
                  />
                ) : (
                  <>
                    <Button
                      onClick={() =>
                        setControl(control === 'key' ? 'joy' : 'key')
                      }
                      className={classes.controlButton}
                    >
                      {control === 'joy' ? 'Joy Stick' : 'Key Control'}
                    </Button>
                    <img
                      alt={`${currentGame?.title}`}
                      src={
                        control === 'key'
                          ? currentGame?.joystickImage
                          : keyImage
                      }
                      className={classes.keyControlImage}
                    />
                  </>
                )}
                <Button
                  onClick={continueGameHandle}
                  className={classes.keyControlButton}
                >
                  Play
                </Button>
              </Box>
            </Dialog>
          </>
        )}
        <Dialog
          disableEscapeKeyDown
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar className={classes.headerTitle}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  confirmHandleClickOpen();
                }}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <span className="text-center">{currentGame?.title}</span>
              <span className="text-center">{timeCounter}</span>
            </Toolbar>
          </AppBar>
          {currentGame && currentGame.gameType !== 4 && (
            <Box className={clsx(classes.gameContent, dosclass.dosplayer)}>
              <iframe
                className="gameframe"
                title={currentGame.title}
                src={`${process.env.REACT_APP_API_URL}/Games/${
                  currentGame.baseFilePath
                }?walletId=${account}&signature=${signature}&game=${
                  currentGame.bundleUrl
                }${
                  currentGame.runFile ? `&runfile=${currentGame.runFile}` : ''
                }`}
                width="100%"
                height="100%"
              />
            </Box>
          )}
          {currentGame && currentGame.gameType === 4 && (
            <Box className={clsx(classes.gameContent, dosclass.dosplayer)}>
              <iframe
                className="gameframe"
                title={currentGame.title}
                src={currentGame.baseFilePath}
                width="100%"
                height="100%"
              />
            </Box>
          )}
        </Dialog>
        <Dialog
          disableEscapeKeyDown
          open={confirm_open}
          onClose={confirm_handleClose}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            Confirm
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you ready to exit the game? Your gameplay time must exceed{' '}
              {minimumTimeToPlay} minutes to earn rewards.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={confirm_handleClose} color="secondary">
              No
            </Button>
            <Button
              onClick={handleClose}
              color="secondary"
              className="playgame-close-button"
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </BrowserView>
      <MobileView>
        {!keyOpen && !open && (
          <>
            <Box>
              <Grid container spacing={4}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  lg={12}
                  className={classes.parentVideo}
                >
                  <Card className={classes.mRoot}>
                    <Box className={classes.overlayPanel}>
                      <CardMedia
                        className={classes.media}
                        image={
                          currentGame?.img
                            ? `${process.env.REACT_APP_API_URL}/${currentGame.img}`
                            : StartMainImage
                        }
                        title="Live Game"
                        component="div"
                      >
                        <Box className={classes.overlay}>
                          <IconButton
                            className={classes.playButton}
                            onClick={mobilePlayGame}
                          >
                            {isLoading ? (
                              <CircularProgress color="secondary" />
                            ) : (
                              <img src={PlayIcon} alt="PlayIcon Icon" />
                            )}
                          </IconButton>
                        </Box>
                      </CardMedia>
                    </Box>
                    <CardContent className={classes.mContent}>
                      {currentGame ? (
                        <CardContent className={classes.mContent}>
                          <Typography
                            variant="h4"
                            className={classes.mCurrentTitle}
                          >
                            {currentGame.description}
                          </Typography>
                        </CardContent>
                      ) : (
                        <>
                          {fetchingGame && <Suspense fallback={<Spinner />} />}
                        </>
                      )}
                    </CardContent>

                    {currentGame?.highScoreCompatible && (
                      <Leaderboard
                        currentGame={currentGame}
                        wipeSignatureAndReRequest={wipeSignatureAndReRequest}
                      />
                    )}
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </>
        )}

        <Dialog
          className={modalclasses.mobileModal}
          disableEscapeKeyDown
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <AppBar className={classes.appBar}>
            <Toolbar className={classes.headerTitle}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  confirmHandleClickOpen();
                }}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <span className="text-center">{currentGame?.title}</span>
              <span className="text-center">{timeCounter}</span>
            </Toolbar>
          </AppBar>
          {currentGame && currentGame.gameType !== 4 && (
            <Box className={clsx(classes.gameContent, dosclass.dosplayer)}>
              <iframe
                className="gameframe"
                title={currentGame.title}
                src={`${process.env.REACT_APP_API_URL}/Games/${
                  currentGame.baseFilePath
                }?walletId=${account}&signature=${signature}&game=${
                  currentGame.bundleUrl
                }${
                  currentGame.runFile ? `&runfile=${currentGame.runFile}` : ''
                }`}
                width="100%"
                height="100%"
              />
            </Box>
          )}
          {currentGame && currentGame.gameType === 4 && (
            <Box className={clsx(classes.gameContent, dosclass.dosplayer)}>
              <iframe
                className="gameframe"
                title={currentGame.title}
                src={currentGame.baseFilePath}
                width="100%"
                height="100%"
              />
            </Box>
          )}
        </Dialog>
        <Dialog
          className={modalclasses.mobileModal}
          disableEscapeKeyDown
          open={confirm_open}
          onClose={confirm_handleClose}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            Confirm
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you ready to exit the game? Your gameplay time must exceed{' '}
              {minimumTimeToPlay} minutes to earn rewards.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={confirm_handleClose} color="secondary">
              No
            </Button>
            <Button
              onClick={handleClose}
              color="secondary"
              className="playgame-close-button"
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </MobileView>
    </>
  );
};

export default PlayGame;
