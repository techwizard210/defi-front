import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { isMobile } from 'react-device-detect';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import { useWeb3React } from '@web3-react/core';

import useStyles from '../../../../assets/styles';

import { walletAuthFetchWithSigPrompt } from '../../../../helpers/apiFetchWrappers';

import { firestorage } from '../../../../firebase';
import 'firebase/auth';

import avatar from '../../../../assets/img/placeholderAvatar.png';

const readDataUrl = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // async event handlers
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const Settings = (props) => {
  const { wipeSignatureAndReRequest } = props;

  const classes = useStyles.profile();

  const [base64, setBase64] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [guildSettings, setGuildSettings] = useState({});
  const [cleanGuildProfile, setCleanGuildProfile] = useState({});
  const [errMsg, setErrorMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [style, setStyle] = useState({ display: 'none' });
  const [greyStyle, setGreyStyle] = useState({ opacity: 1 });
  const [pendingChanges, setPendingChanges] = useState(false);

  const { account } = useWeb3React();

  let fileRef = useRef();

  const handleSelectedPhoto = async (event) => {
    const target = event.currentTarget;
    const file = target.files.item(0);

    readDataUrl(file).then((dataUrl) => {
      setImageFile(file);
      setBase64(dataUrl);
      setFileName(target.files[0].name);
      setPendingChanges(true);
    });
  };

  const updateGuild = async () => {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const options = {
        mode: 'cors',
        body: JSON.stringify(guildSettings),
      };
      const settingsResp = await walletAuthFetchWithSigPrompt(
        `GuildManagement/UpdateSettings`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        headers
      );
      if (settingsResp) {
        if (settingsResp.success) {
          toast.success('Guild settings updated!');
        } else {
          toast.error(settingsResp.error);
        }
      }
    } catch (error) {
      console.log('Unable to update guild settings');
    }
  };

  const cancelUpdateGuild = async () => {
    setImageFile(null);
    setBase64(null);
    setFileName(null);
    setGuildSettings(cleanGuildProfile);
    setPendingChanges(false);
  };

  const handleUpdateGuild = async () => {
    if (base64 !== null) {
      await firestorage
        .ref()
        .child(`images/profile_${fileName}`)
        .put(imageFile);
      // eslint-disable-next-line no-unused-vars
      const downloadURL = await firestorage
        .ref('images')
        .child(`profile_${fileName}`)
        .getDownloadURL();
      const profile = guildSettings;
      profile.image = downloadURL;
      setGuildSettings(profile);
    }

    await updateGuild();
    setPendingChanges(false);

    setErrorMsg('Successfully updated guild.');
    setOpenSnackbar(true);
  };

  const handleChangePhotoButton = (e) => {
    e.preventDefault();
    fileRef.click();
  };

  const handleRef = (input) => {
    fileRef = input;
  };

  const handleSnackBarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const fetchGuildData = async () => {
      const resp = await walletAuthFetchWithSigPrompt(
        'GuildManagement/Settings',
        'GET',
        walletAuthFetchWithSigPrompt,
        account,
        null,
        false,
        null
      );
      const profile = resp;
      if (profile) {
        setGuildSettings(profile);
        setCleanGuildProfile(profile);
      }
    };

    async function init() {
      await fetchGuildData();
    }
    if (account) {
      init();
    }
  }, [account]);

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleSnackBarClose}
      >
        <Alert severity="success" variant="outlined">
          {errMsg}
        </Alert>
      </Snackbar>

      <Grid container className={`profileSection ${isMobile ? 'mobile' : ''}`}>
        <Grid container item lg={12} md={12} sm={12} xs={12}>
          <Grid container item lg={2} md={2} sm={4} xs={6}>
            Name
          </Grid>
          <Grid container item lg={10} md={10} sm={8} xs={6}>
            <TextField
              className="userName"
              type="text"
              inputProps={{ maxLength: 20 }}
              fullWidth
              value={guildSettings.name || ''}
              onChange={(event) => {
                setGuildSettings({
                  ...guildSettings,
                  name: event.target.value,
                });
                setPendingChanges(true);
              }}
            />
          </Grid>
        </Grid>

        <Grid container item lg={12} md={12} sm={12} xs={12}>
          <Grid container item lg={2} md={2} sm={4} xs={6}>
            Image
          </Grid>
          <Grid container item lg={10} md={10} sm={8} xs={6}>
            <Grid
              item
              lg={3}
              md={3}
              sm={3}
              xs={3}
              className="profilePictureSection"
            >
              <div
                className="profilePictureWrapper"
                onMouseEnter={() => {
                  setStyle({ display: 'block' });
                  setGreyStyle({ opacity: 0.3 });
                }}
                onMouseLeave={() => {
                  setStyle({ display: 'none' });
                  setGreyStyle({ opacity: 1 });
                }}
              >
                {base64 && (
                  <img
                    src={base64}
                    alt="avatar"
                    onClick={handleChangePhotoButton}
                    className={classes.userAvatar}
                    style={greyStyle}
                  />
                )}
                {!base64 && (
                  <img
                    src={
                      guildSettings.image ? `${guildSettings.image}` : avatar
                    }
                    alt="avatar"
                    onClick={handleChangePhotoButton}
                    className={classes.userAvatar}
                    style={greyStyle}
                  />
                )}
                <div
                  role="button"
                  tabIndex="0"
                  style={style}
                  className="invisibleFloatyDivvy"
                  onClick={handleChangePhotoButton}
                >
                  <FontAwesomeIcon icon={faCamera} />
                </div>
                <input
                  ref={handleRef}
                  style={{ display: 'none' }}
                  id="avatar"
                  name="avatar"
                  type="file"
                  onChange={handleSelectedPhoto}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>

        <Grid container item lg={12} md={12} sm={12} xs={12}>
          <Grid container item lg={2} md={2} sm={4} xs={6}>
            ShortCode
          </Grid>
          <Grid container item lg={10} md={10} sm={8} xs={6}>
            <TextField
              className="userName"
              type="text"
              inputProps={{ maxLength: 5 }}
              fullWidth
              value={guildSettings.shortCode || ''}
              onChange={(event) => {
                setGuildSettings({
                  ...guildSettings,
                  shortCode: event.target.value,
                });
                setPendingChanges(true);
              }}
            />
          </Grid>
        </Grid>

        <Grid container item lg={12} md={12} sm={12} xs={12}>
          <Grid container item lg={2} md={2} sm={4} xs={6}>
            Default Commission (%)
          </Grid>
          <Grid container item lg={10} md={10} sm={8} xs={6}>
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              type="number"
              value={guildSettings.defaultCommission}
              onChange={(event) => {
                setGuildSettings({
                  ...guildSettings,
                  defaultCommission: event.target.value,
                });
                setPendingChanges(true);
              }}
              InputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                inputProps: {
                  min: 0,
                },
              }}
            />
          </Grid>
        </Grid>

        <Grid container item lg={12} md={12} sm={12} xs={12}>
          <Grid container item lg={2} md={2} sm={4} xs={6}>
            Manager Cut (%)
          </Grid>
          <Grid container item lg={10} md={10} sm={8} xs={6}>
            <TextField
              autoFocus
              margin="dense"
              fullWidth
              type="number"
              value={guildSettings.guildTax}
              onChange={(event) => {
                setGuildSettings({
                  ...guildSettings,
                  guildTax: event.target.value,
                });
                setPendingChanges(true);
              }}
              InputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                inputProps: {
                  min: 0,
                },
              }}
            />
          </Grid>
        </Grid>

        <Grid item lg={12} md={12} sm={12} xs={12}>
          {pendingChanges && (
            <>
              <Button
                variant="contained"
                className="profileButton"
                onClick={handleUpdateGuild}
              >
                Update
              </Button>
              <Button
                variant="contained"
                className="profileButton"
                onClick={cancelUpdateGuild}
              >
                Cancel
              </Button>
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Settings;
