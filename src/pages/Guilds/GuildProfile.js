import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useWeb3React } from '@web3-react/core';
import { useParams } from 'react-router-dom';
import { BrowserView, MobileView } from 'react-device-detect';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { History } from '../../theme';

// ** Import Assets
import useStyles from '../../assets/styles';

import { walletAuthFetchWithSigPrompt } from '../../helpers/apiFetchWrappers';
import avatar from '../../assets/img/placeholderAvatar.png';
import SingleActionModal from '../../components/SingleActionModal';

const GuildProfile = () => {
  const [guildProfile, setGuildProfile] = useState({});

  const [greyStyle] = useState({ opacity: 1 });

  const { account } = useWeb3React();

  const classes = useStyles.profile();

  const { id } = useParams();

  const [openModal, setOpenModal] = useState(null);

  const handleModalOpen = async (modalName) => {
    setOpenModal(modalName);
  };

  const handleModalClose = async () => {
    setOpenModal(null);
  };

  const fetchGuildData = useCallback(async () => {
    const url = id ? `Guild/${id}/Profile` : 'GuildManagement/Profile';
    const resp = await walletAuthFetchWithSigPrompt(
      url,
      'GET',
      walletAuthFetchWithSigPrompt,
      account,
      null,
      true,
      null
    );

    if (resp) {
      if (resp.error) {
        History.push('/Guilds');
      }
      setGuildProfile(resp);
    }
  }, [account, id]);

  const requestJoin = async () => {
    try {
      const joinGuildResp = await walletAuthFetchWithSigPrompt(
        `Guild/${id}/JoinRequest`,
        'POST',
        null,
        account,
        null,
        false,
        null
      );

      if (joinGuildResp.success) {
        toast.success('Join request submitted!');
        fetchGuildData();
      } else {
        toast.error(`Failed to submit join request ${joinGuildResp.message}`);
      }
    } catch (error) {
      toast.error('Failed to submit join request');
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
        handleModalClose();
        History.push('/Guilds');
      } else {
        toast.error('Failed to leave guild');
      }
    } catch (error) {
      toast.error('Failed to leave guild');
    }
  };

  const disbandGuild = async () => {
    try {
      const leaveGuildResp = await walletAuthFetchWithSigPrompt(
        `GuildManagement/DisbandGuild`,
        'POST',
        null,
        account,
        null,
        false,
        null
      );

      if (leaveGuildResp.success) {
        toast.success('Successfully disbanded guild');
        handleModalClose();
        History.push('/Guilds');
      } else {
        toast.error('Failed to disband guild');
      }
    } catch (error) {
      toast.error('Failed to disband guild');
    }
  };

  useEffect(() => {
    async function init() {
      await fetchGuildData();
    }

    if (!id) {
      if (account) {
        init();
      }
    } else {
      init();
    }
  }, [account, fetchGuildData, id]);

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
        <Grid item container lg={3} md={3} sm={4} xs={4}>
          <div className="infoIconWrapper">
            <i className={`fa-solid ${iconClass}`} />
          </div>
        </Grid>
        <Grid
          item
          container
          lg={9}
          md={9}
          sm={8}
          xs={8}
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
      <BrowserView>
        <Grid container className="profileSection">
          <Grid
            item
            lg={2}
            md={2}
            sm={2}
            xs={2}
            className="profilePictureSection"
          >
            <div className="profilePictureWrapper">
              <img
                src={guildProfile.image ? `${guildProfile.image}` : avatar}
                alt="avatar"
                className={classes.userAvatar}
                style={greyStyle}
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
                className="detailRowValue"
              >
                {' '}
                <Grid item lg={8} md={8} sm={12} xs={12} className="userName">
                  {guildProfile?.name} [{guildProfile?.shortCode}]
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12} className="userRole">
                  {account && guildProfile?.active && (
                    <>
                      {guildProfile?.role == null &&
                        !guildProfile?.hasPendingRequest && (
                          <Button onClick={requestJoin}>Join Request</Button>
                        )}

                      {guildProfile?.hasPendingRequest && (
                        <span className="pendingJoinRequest">
                          Join Request Pending
                        </span>
                      )}
                      {guildProfile?.role &&
                        guildProfile?.role !== 'Leader' && (
                          <Button onClick={() => handleModalOpen('LeaveGuild')}>
                            Leave Guild
                          </Button>
                        )}

                      {guildProfile?.role &&
                        guildProfile?.role === 'Leader' &&
                        guildProfile?.scholarCount === 0 &&
                        guildProfile?.memberCount === 1 && (
                          <Button
                            onClick={() => handleModalOpen('DisbandGuild')}
                          >
                            Disband Guild
                          </Button>
                        )}
                    </>
                  )}
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
                <span className="label">Current Role:</span>
                <span className="value">{guildProfile.role}</span>
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
      </BrowserView>
      <MobileView>
        <Grid container className="profileSection mobile">
          <Grid
            item
            lg={2}
            md={2}
            sm={2}
            xs={2}
            className="profilePictureSection"
          >
            <div className="profilePictureWrapper">
              <img
                src={guildProfile.image ? `${guildProfile.image}` : avatar}
                alt="avatar"
                className={classes.userAvatar}
                style={greyStyle}
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
                className="detailRowValue"
              >
                {' '}
                <Grid item lg={8} md={8} sm={12} xs={12} className="userName">
                  {guildProfile?.name} [{guildProfile?.shortCode}]
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12} className="userRole">
                  {account && guildProfile?.active && (
                    <>
                      {guildProfile?.role == null &&
                        !guildProfile?.hasPendingRequest && (
                          <Button onClick={requestJoin}>Join Request</Button>
                        )}

                      {guildProfile?.hasPendingRequest && (
                        <span className="pendingJoinRequest">
                          Join Request Pending
                        </span>
                      )}
                      {guildProfile?.role &&
                        guildProfile?.role !== 'Leader' && (
                          <Button onClick={() => handleModalOpen('LeaveGuild')}>
                            Leave Guild
                          </Button>
                        )}

                      {guildProfile?.role &&
                        guildProfile?.role === 'Leader' &&
                        guildProfile?.scholarCount === 0 &&
                        guildProfile?.memberCount === 1 && (
                          <Button
                            onClick={() => handleModalOpen('DisbandGuild')}
                          >
                            Disband Guild
                          </Button>
                        )}
                    </>
                  )}
                </Grid>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12} className="userRole">
                <span className="label">Current Role:</span>
                <span className="value">{guildProfile.role}</span>
              </Grid>
            </div>
          </Grid>
          <Grid
            item
            container
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className="detailRowValue topMargin"
          >
            {GuildInfoSection('fa-users', 'Members', guildProfile.memberCount)}
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
        </Grid>
      </MobileView>

      <SingleActionModal
        open={openModal === 'LeaveGuild'}
        handleClose={handleModalClose}
        messageWording="Are you sure you want to leave this guild? - any scholarships you have will be terminated"
        action={leaveGuild}
        modalTitle="Leave Guild"
        actionWording="Leave Invite"
        actionClass="close"
      />

      <SingleActionModal
        open={openModal === 'DisbandGuild'}
        handleClose={handleModalClose}
        messageWording="Are you sure you want to disband this guild?"
        action={disbandGuild}
        modalTitle="Disband Guild"
        actionWording="Disband"
        actionClass="close"
      />
    </>
  );
};

export default GuildProfile;
