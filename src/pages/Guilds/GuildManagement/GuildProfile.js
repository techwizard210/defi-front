import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

/* eslint-disable */

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

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

const GuildProfile = () => {
  const [base64, setBase64] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [guildProfile, setGuildProfile] = useState({});
  const [cleanGuildProfile, setCleanGuildProfile] = useState({});
  const [errMsg, setErrorMsg] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

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

  const updateGuild = async () => {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const options = {
        mode: 'cors',
        body: JSON.stringify(guildProfile),
      };
      await walletAuthFetchWithSigPrompt(
        `GuildManagement/Update`,
        'POST',
        null,
        account,
        options,
        true,
        headers
      );
    } catch (error) {
      console.log('Unable to update guild');
    }
  };

  const leaveGuild = async () => {
    try {
      const leaveGuildResp = await walletAuthFetchWithSigPrompt(
        `GuildManagement/LeaveGuild`,
        'POST',
        null,
        account,
        null,
        false,
        null
      );

      if (leaveGuildResp.success) {
        toast.success('Successfully left guild');
      } else {
        toast.error('Failed to leave guild');
      }
    } catch (error) {
      toast.error('Failed to leave guild');
    }
  };

  const cancelUpdateGuild = async () => {
    setImageFile(null);
    setBase64(null);
    setFileName(null);
    setGuildProfile(cleanGuildProfile);
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
      const profile = guildProfile;
      profile.avatar = downloadURL;
      setGuildProfile(profile);
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
        'GuildManagement/Manage',
        'GET',
        walletAuthFetchWithSigPrompt,
        account,
        null,
        false,
        null
      );
      const profile = resp;
      if (profile) {
        setGuildProfile(profile);
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

  const GuildInfoSection = (iconClass, title, value) => (
    <Grid
      item
      container
      lg={3}
      md={3}
      sm={3}
      xs={3}
      className="guildInfoSection"
    >
      <Grid item container lg={12} md={12} sm={12} xs={12}>
        <Grid item container lg={3} md={3} sm={3} xs={3}>
          <div className="infoIconWrapper">
            <i className={`fa-solid ${iconClass}`} />
          </div>
        </Grid>
        <Grid
          item
          container
          lg={9}
          md={9}
          sm={9}
          xs={9}
          className="infoValueWrapper"
        >
          <Grid item lg={12} md={12} sm={12} xs={12} className="infoTitle">
            {title}
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12} className="infoValue">
            {value}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

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
          lg={2}
          md={2}
          sm={2}
          xs={2}
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
                src={guildProfile.image ? `${guildProfile.image}` : avatar}
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
        <Grid item lg={10} md={10} sm={10} xs={10}>
          <div className="profileDetailsWrapper">
            <Grid
              item
              container
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="detailRowValue userName"
            >
              {' '}
              <Grid
                item
                lg={8}
                md={8}
                sm={8}
                xs={8}
                className="detailRowValue userRole"
              >
                {guildProfile?.name} [{guildProfile?.shortCode}]
              </Grid>
              <Grid
                item
                lg={4}
                md={4}
                sm={4}
                xs={4}
                className="detailRowValue userRole"
              >
                <Button onClick={leaveGuild}>Leave Guild</Button>
              </Grid>
            </Grid>
            <Grid
              item
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="detailRowValue userRole"
            >
              <span class="label">Current Role:</span>
              <span class="value">{guildProfile.role}</span>
            </Grid>
            <Grid
              item
              container
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="detailRowValue"
            >
              {GuildInfoSection(
                'fa-users',
                'Members',
                guildProfile.memberCount
              )}
              {GuildInfoSection(
                'fa-user-astronaut',
                'NFTs',
                guildProfile.nftCount
              )}
              {GuildInfoSection(
                'fa-user-graduate',
                'Scholars',
                guildProfile.scholarCount
              )}
              {GuildInfoSection(
                'fa-user-graduate',
                'Scholar Slots',
                guildProfile.scholarSlotCount
              )}
            </Grid>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default GuildProfile;
