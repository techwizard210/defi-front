/* eslint-disable react/destructuring-assignment */
import { useState, useEffect, Suspense, useCallback } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
import DataTable from 'react-data-table-component';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useWeb3React } from '@web3-react/core';

import Spinner from '../../../components/Spinner';
import { walletAuthFetchWithSigPrompt } from '../../../helpers/apiFetchWrappers';
import ScholarOfferDialog from './ScholarOfferDialog';
import GuildInviteDialog from './GuildInviteDialog';
import SingleActionModal from '../../../components/SingleActionModal';

const Notifications = (props) => {
  const { wipeSignatureAndReRequest } = props;
  const [playerNotifications, setPlayerNotifications] = useState(null);
  const [playerNotificationsFetched, setPlayerNotificationsFetched] =
    useState(false);

  const { account } = useWeb3React();
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleModalOpen = async (modalName, notification) => {
    if (notification) {
      setSelectedNotification(notification);
    }
    setOpenModal(modalName);
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const notificationResp = await walletAuthFetchWithSigPrompt(
        `Notifications`,
        'GET',
        null,
        account,
        null,
        true,
        null
      );

      if (notificationResp) {
        setPlayerNotifications(notificationResp.notifications);
        setPlayerNotificationsFetched(true);

        profile.notificationCount = notificationResp.notifications.length;
        dispatch({ type: 'PROFILE', payload: profile });
      }
    } catch (error) {
      console.log('Unable to fetch notification');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, dispatch]);

  const handleModalClose = async () => {
    setOpenModal(null);
    fetchNotifications();
  };

  const deleteAllNotifications = useCallback(async () => {
    try {
      const options = {
        mode: 'cors',
      };

      const deletedResponse = await walletAuthFetchWithSigPrompt(
        `Notifications/DeleteAll`,
        'DELETE',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        null
      );

      if (deletedResponse?.success) {
        handleModalClose();
      }
    } catch (error) {
      console.log('Unable to fetch notification');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, dispatch]);

  const deleteNotification = async () => {
    try {
      const options = {
        mode: 'cors',
      };

      const deletedResponse = await walletAuthFetchWithSigPrompt(
        `Notifications?id=${selectedNotification?.id}`,
        'DELETE',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        null
      );
      if (deletedResponse?.success) {
        handleModalClose();
      }
    } catch (error) {
      console.log('failed to delete notification');
    }
  };

  const [openScholarOffer, setOpenScholarOffer] = useState(false);

  const handleScholarOfferClose = async () => {
    setOpenScholarOffer(false);
    fetchNotifications();
  };

  const handleScholarOfferOpen = async (notification) => {
    setSelectedNotification(notification);
    setOpenScholarOffer(true);
  };

  const [openGuildInvite, setOpenGuildInvite] = useState(false);

  const handleGuildInviteClose = async () => {
    setOpenGuildInvite(false);
    fetchNotifications();
  };

  const handleGuildInviteOpen = async (notification) => {
    setSelectedNotification(notification);
    setOpenGuildInvite(true);
  };

  useEffect(() => {
    async function init() {
      await fetchNotifications();
    }
    if (account) {
      init();
    }
  }, [account, fetchNotifications]);

  const notificationItem = (notification) => {
    return (
      <Grid
        key={uuid_v4()}
        item
        className="notification"
        container
        lg={12}
        md={12}
        sm={12}
        xs={12}
      >
        <Grid item lg={2} md={2} sm={2} xs={2} className="date">
          {notification.raisedAtUtcReadable}
        </Grid>
        <Grid item lg={2} md={2} sm={2} xs={2} className="subject">
          {notification.subject}
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={6} className="message">
          {notification.message}
        </Grid>
        <Grid item lg={2} md={2} sm={2} xs={2} className="action">
          <Button
            onClick={() => handleModalOpen('DeleteNotification', notification)}
            className="close"
          >
            Delete
          </Button>
          {notification.type === 20 && (
            <Button onClick={() => handleScholarOfferOpen(notification)}>
              View Offer
            </Button>
          )}
          {notification.type === 30 && (
            <Button onClick={() => handleGuildInviteOpen(notification)}>
              View Invite
            </Button>
          )}
        </Grid>
      </Grid>
    );
  };

  const columns = [
    {
      name: 'Date',
      selector: (c) => c.raisedAtUtcReadable,
      center: true,
      cell: (row) => <div>{row.raisedAtUtcReadable}</div>,
    },
    {
      name: 'Subject',
      selector: (c) => c.subject,
      center: true,
      cell: (row) => <div>{row.subject}</div>,
    },
    {
      name: 'Message',
      selector: (c) => c.message,
      center: true,
      cell: (row) => <div>{row.message}</div>,
    },
    {
      name: '',
      center: true,
      cell: (row) => (
        <>
          <Button
            onClick={() => handleModalOpen('DeleteNotification', row)}
            className="close"
          >
            Delete
          </Button>
          {row.type === 20 && (
            <Button onClick={() => handleScholarOfferOpen(row)}>
              View Offer
            </Button>
          )}
          {row.type === 30 && (
            <Button onClick={() => handleGuildInviteOpen(row)}>
              View Invite
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <BrowserView className="notifications">
        <Typography
          component="div"
          gutterBottom
          className="TextColorGrey heading"
        >
          Notifications
          {playerNotificationsFetched && playerNotifications?.length > 0 && (
            <Button
              onClick={() => handleModalOpen('DeleteAll')}
              className="close deleteAll"
            >
              Delete All
            </Button>
          )}
        </Typography>
        <div className="notificationList noMax">
          <Grid item container spacing={1}>
            {!account && (
              <Typography
                component="div"
                className="TextColorGrey connectWalletWarning noMoreMissions"
              >
                Please connect your wallet to view your notifications
              </Typography>
            )}

            {account && !playerNotificationsFetched && (
              <Suspense fallback={<Spinner />} />
            )}

            {account &&
              playerNotificationsFetched &&
              playerNotifications?.length === 0 && (
                <Typography
                  component="div"
                  className="TextColorGrey noNotification"
                >
                  You don&apos;t have any notifications...
                </Typography>
              )}

            {playerNotificationsFetched &&
              playerNotifications?.length > 0 &&
              playerNotifications.map((notification) =>
                notificationItem(notification)
              )}
          </Grid>
        </div>
      </BrowserView>

      <MobileView className="notifications mobile">
        <div className="notificationList noMax">
          <Grid item container spacing={1}>
            {!account && (
              <Typography
                component="div"
                className="TextColorGrey connectWalletWarning noMoreMissions"
              >
                Please connect your wallet to view your notifications
              </Typography>
            )}

            {account && !playerNotificationsFetched && (
              <Suspense fallback={<Spinner />} />
            )}
            {account &&
              playerNotificationsFetched &&
              playerNotifications?.length > 0 && (
                <DataTable
                  columns={columns}
                  data={playerNotifications}
                  pagination
                  theme="solarized"
                  highlightOnHover
                  noDataComponent={
                    <div className="noContracts">No guild notifications...</div>
                  }
                />
              )}
          </Grid>
        </div>
      </MobileView>

      {selectedNotification && selectedNotification.type === 20 && (
        <ScholarOfferDialog
          open={openScholarOffer}
          handleClose={handleScholarOfferClose}
          offerId={selectedNotification.notifyingRecordId}
          wipeSignatureAndReRequest={wipeSignatureAndReRequest}
        />
      )}
      {selectedNotification && selectedNotification.type === 30 && (
        <GuildInviteDialog
          open={openGuildInvite}
          handleClose={handleGuildInviteClose}
          inviteId={selectedNotification.notifyingRecordId}
          wipeSignatureAndReRequest={wipeSignatureAndReRequest}
        />
      )}

      <SingleActionModal
        open={openModal === 'DeleteNotification'}
        handleClose={handleModalClose}
        messageWording="Are you sure you wish to delete this notification?"
        action={deleteNotification}
        modalTitle="Delete Notification"
        actionWording="Delete"
      />

      <SingleActionModal
        open={openModal === 'DeleteAll'}
        handleClose={handleModalClose}
        messageWording="Are you sure you want to delete all notifications?"
        action={deleteAllNotifications}
        modalTitle="Delete All Notifications"
        actionWording="Delete"
      />
    </>
  );
};

export default Notifications;
