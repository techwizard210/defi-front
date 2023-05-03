import { useState, useEffect, useRef } from 'react';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import { useWeb3React } from '@web3-react/core';

// ** Import Assets
import useStyles from '../../../assets/styles';

import { firestorage } from '../../../firebase';
import 'firebase/auth';

import { walletAuthFetchWithSigPrompt } from '../../../helpers/apiFetchWrappers';
import avatar from '../../../assets/img/placeholderAvatar.png';

// import { getEarningSettings } from '../helpers/databaseHelpers';

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

const Profile = () => {
  const [base64, setBase64] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [cleanUserProfile, setCleanUserProfile] = useState({});
  const [errMsg, setErrorMsg] = useState('');
  const [openSnackbar, setOpenSnakbar] = useState(false);

  const [style, setStyle] = useState({ display: 'none' });
  const [greyStyle, setGreyStyle] = useState({ opacity: 1 });
  const [pendingChanges, setPendingChanges] = useState(false);

  const { account } = useWeb3React();

  let fileRef = useRef();

  const classes = useStyles.profile();

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

  const updateProfile = async () => {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const options = {
        mode: 'cors',
        body: JSON.stringify(userProfile),
      };
      const syncResponse = await walletAuthFetchWithSigPrompt(
        `Player/SyncUser`,
        'POST',
        null,
        account,
        options,
        true,
        headers
      );

      return syncResponse.success;
    } catch (error) {
      return false;
    }
  };

  const cancelUpdateProfile = async () => {
    setImageFile(null);
    setBase64(null);
    setFileName(null);
    setUserProfile(cleanUserProfile);
    setPendingChanges(false);
  };

  const handleUpdateProfile = async () => {
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
      const profile = userProfile;
      profile.avatar = downloadURL;
      setUserProfile(profile);
    }

    const updatedSuccess = await updateProfile();

    setPendingChanges(false);
    if (updatedSuccess) {
      setErrorMsg('Successfully updated profile.');
    } else {
      setErrorMsg('Failed to updated profile.');
    }

    setOpenSnakbar(true);
  };

  const handleChangePhotoButton = (e) => {
    e.preventDefault();
    fileRef.click();
  };

  const handleRef = (input) => {
    fileRef = input;
  };

  const handleSnackBarClose = () => {
    setOpenSnakbar(false);
  };

  useEffect(() => {
    const fetchAllData = async () => {
      const resp = await walletAuthFetchWithSigPrompt(
        'Player/FetchProfile',
        'GET',
        walletAuthFetchWithSigPrompt,
        account,
        null,
        false,
        null
      );
      const profile = resp;
      if (profile) {
        setUserProfile(profile);
        setCleanUserProfile(profile);
      }
    };

    async function init() {
      await fetchAllData();
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

      <Grid container className="profileSection">
        <Grid
          item
          lg={4}
          md={4}
          sm={4}
          xs={4}
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
                src={userProfile.avatar ? `${userProfile.avatar}` : avatar}
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
        <Grid item lg={8} md={8} sm={8} xs={8}>
          <div className="profileDetailsWrapper">
            <Grid
              item
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="detailRowValue"
            >
              <TextField
                className="userName"
                type="text"
                inputProps={{ maxLength: 12 }}
                fullWidth
                value={userProfile.playerName || ''}
                onChange={(event) => {
                  setUserProfile({
                    ...userProfile,
                    playerName: event.target.value,
                  });
                  setPendingChanges(true);
                }}
              />
              {pendingChanges && (
                <>
                  <Button
                    variant="contained"
                    className="profileButton"
                    onClick={handleUpdateProfile}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    className="profileButton"
                    onClick={cancelUpdateProfile}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Grid>

            <Grid
              container
              item
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="profileDetailRow"
            >
              <Grid
                item
                lg={12}
                md={12}
                sm={12}
                xs={12}
                className="detailRowValue"
              >
                <Stack direction="row" spacing={1} className="chips">
                  {userProfile.earnStake > 0 && (
                    <Tooltip title="Full earnings enabled - you have staked to EARN">
                      <Chip label="HiFiver" className="hifiverChip" />
                    </Tooltip>
                  )}
                  {userProfile?.nftOwner && (
                    <Tooltip title="Full earnings enabled - you own an 'Into the HiFiverse' NFT">
                      <Chip label="NFT Owner" className="nftOwnerChip" />
                    </Tooltip>
                  )}
                  {userProfile?.scholar && (
                    <Tooltip title="You are currently engaged in a scholarship contract with a guild">
                      <Chip label="Scholar" className="scholarChip" />
                    </Tooltip>
                  )}
                  {userProfile.earnStake === 0 &&
                    !userProfile.nftOwner &&
                    !userProfile.scholar && (
                      <Chip label="Free Gamer" className="freeGamerChip" />
                    )}
                </Stack>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
