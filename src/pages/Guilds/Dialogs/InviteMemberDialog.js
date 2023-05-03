import { v4 as uuid_v4 } from 'uuid';
import { useEffect, useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import { isMobile } from 'react-device-detect';

// ** Import Material-Ui Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';

import { walletAuthFetchWithSigPrompt } from '../../../helpers/apiFetchWrappers';
import avatar from '../../../assets/img/placeholderAvatar.png';
import DebounceInput from '../../../components/DebounceInput';

const cleanQuery = {
  Name: null,
  FullEarner: null,
  OrderByField: 'Name',
  OrderByDirection: 'asc',
  ResultsPerPage: 20,
  PageNo: 1,
};

const InviteMemberDialog = (props) => {
  const { open, handleClose, wipeSignatureAndReRequest } = props;

  const { account } = useWeb3React();

  const [totalPlayers, setTotalPlayers] = useState(null);
  const [players, setPlayers] = useState(null);
  const [playersFetched, setPlayersFetched] = useState(null);
  const [playerName, setPlayerName] = useState(null);

  const getAvailablePlayers = useCallback(async () => {
    try {
      const query = cleanQuery;
      query.Name = playerName;
      const options = {
        mode: 'cors',
        body: JSON.stringify(query),
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const resp = await walletAuthFetchWithSigPrompt(
        'GuildManagement/GetAvailablePlayers',
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        true,
        headers
      );

      setPlayers(resp.items);
      setTotalPlayers(resp.totalRecords);
      setPlayersFetched(true);
    } catch (error) {
      console.log('failed to fetch available players');
    }
  }, [account, playerName, wipeSignatureAndReRequest]);

  const inviteMember = async (player) => {
    try {
      const scholarOffer = {
        PlayerId: player.playerId,
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const options = {
        mode: 'cors',
        body: JSON.stringify(scholarOffer),
      };
      const inviteResponse = await walletAuthFetchWithSigPrompt(
        'GuildManagement/Invite',
        'POST',
        null,
        account,
        options,
        false,
        headers
      );

      if (inviteResponse) {
        if (inviteResponse.success) {
          toast.success('Guild invite sent');
          getAvailablePlayers();
        } else {
          toast.error(inviteResponse.error);
        }
      }
    } catch (error) {
      console.log(`Failed to invite member: ${error.message}`);
    }
  };

  useEffect(() => {
    async function init() {
      await getAvailablePlayers();
    }
    if (account) {
      init();
    }
  }, [account, getAvailablePlayers, wipeSignatureAndReRequest]);

  useEffect(() => {
    getAvailablePlayers();
  }, [getAvailablePlayers, playerName]);

  const playerResult = (player) => (
    <Grid
      item
      container
      lg={12}
      md={12}
      sm={12}
      xs={12}
      key={uuid_v4()}
      className="playerWrapper"
    >
      <Grid item container lg={2} md={2} sm={2} xs={2} className="image">
        <img src={player.avatar ? `${player.avatar}` : avatar} alt="avatar" />
      </Grid>
      <Grid item container lg={8} md={8} sm={8} xs={8} className="name">
        {player.playerName}
        {player.guildName && <> | {player.guildName}</>}
      </Grid>
      <Grid item container lg={2} md={2} sm={2} xs={2} className="invite">
        {!player.guildId && !player.hasPendingInvite && (
          <Button onClick={() => inviteMember(player)}>Invite</Button>
        )}
        {player.guildId && (
          <span className="ineligible">Already in a guild</span>
        )}
        {player.hasPendingInvite && <span className="ineligible">Invited</span>}
      </Grid>
    </Grid>
  );

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      className={`guildManagementModal inviteModal ${isMobile ? 'mobile' : ''}`}
    >
      <DialogTitle id="max-width-dialog-title" style={{ textAlign: 'center' }}>
        Invite Member
      </DialogTitle>
      <DialogContent className="body">
        <Grid container>
          <Grid
            item
            container
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className="searchNameWrapper"
          >
            <Grid item lg={12} md={12} sm={12} xs={12} className="label">
              Search for player
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <DebounceInput
                name="playerName"
                onChange={(e) => setPlayerName(e.target.value)}
                label="Player Name"
                defaultValue={playerName}
                type="text"
                fullWidth
                autoFocus
              />
            </Grid>
          </Grid>

          <Grid
            item
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className="playerListWrapper"
          >
            {playersFetched &&
              players?.length > 0 &&
              players.map((player) => playerResult(player))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12} className="totalPlayers">
            {playersFetched && totalPlayers && (
              <>Total players matching: {totalPlayers}</>
            )}
          </Grid>
        </Grid>
        <Button onClick={handleClose} color="primary" className="close">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteMemberDialog;
