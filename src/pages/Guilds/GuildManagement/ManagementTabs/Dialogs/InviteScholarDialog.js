import { v4 as uuid_v4 } from 'uuid';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';

// ** Import Material-Ui Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';

import { walletAuthFetchWithSigPrompt } from '../../../../../helpers/apiFetchWrappers';
import avatar from '../../../../../assets/img/placeholderAvatar.png';
import DebounceInput from '../../../../../components/DebounceInput';

const InviteScholarDialog = (props) => {
  const { open, handleClose, wipeSignatureAndReRequest } = props;

  const { account } = useWeb3React();

  const [players, setPlayers] = useState(null);
  const [filteredPlayers, setFilteredPlayers] = useState(null);
  const [playersFetched, setPlayersFetched] = useState(null);
  const [playerName, setPlayerName] = useState(null);

  const inviteScholar = async (player) => {
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

      const resp = await walletAuthFetchWithSigPrompt(
        `Scholarship/InvitePlayer`,
        'POST',
        null,
        account,
        options,
        false,
        headers
      );

      if (resp.success) {
        toast.success('Scholar invite sent');
      } else {
        toast.error(resp.error);
      }
      handleClose();
    } catch (error) {
      console.log(`Failed to invite scholar: ${error.message}`);
    }
  };

  useEffect(() => {
    const getAvailablePlayers = async () => {
      try {
        const resp = await walletAuthFetchWithSigPrompt(
          `GuildManagement/GetAvailablePlayers?freeOnly=true`,
          'GET',
          wipeSignatureAndReRequest,
          account,
          null,
          false,
          null
        );

        setPlayers(resp);
        setPlayersFetched(true);
      } catch (error) {
        console.log('failed to fetch available Scholars');
      }
    };

    async function init() {
      await getAvailablePlayers();
    }
    if (account) {
      init();
    }
  }, [account, wipeSignatureAndReRequest]);

  useEffect(() => {
    if (players?.length > 0) {
      if (playerName) {
        const localFilteredPlayers = players.filter(
          (player) =>
            player.playerName &&
            player.playerName.toLowerCase().includes(playerName.toLowerCase())
        );
        setFilteredPlayers(localFilteredPlayers.slice(0, 10));
      } else {
        setFilteredPlayers(players.slice(0, 10));
      }
    } else {
      setFilteredPlayers(null);
    }
  }, [playerName, players]);

  const playerResult = (player) => (
    <Grid item container lg={12} md={12} sm={12} xs={12} key={uuid_v4()}>
      <Grid item container lg={2} md={2} sm={2} xs={2}>
        <img
          src={player.avatar ? `${player.avatar}` : avatar}
          alt="avatar"
          style={{ width: '100%' }}
        />
      </Grid>
      <Grid item container lg={8} md={8} sm={8} xs={8}>
        {player.playerName}
      </Grid>
      <Grid item container lg={2} md={2} sm={2} xs={2}>
        <Button onClick={() => inviteScholar(player)}>Invite</Button>
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
      className="createGuildModal"
    >
      <DialogTitle id="max-width-dialog-title" style={{ textAlign: 'center' }}>
        Invite Scholar
      </DialogTitle>
      <DialogContent className="body">
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <DebounceInput
              name="playerName"
              onChange={(e) => setPlayerName(e.target.value)}
              label="Player Name"
              defaultValue={playerName}
              type="text"
            />
          </Grid>

          <Grid item lg={12} md={12} sm={12} xs={12}>
            {playersFetched &&
              filteredPlayers?.length > 0 &&
              filteredPlayers.map((player) => playerResult(player))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={inviteScholar} color="primary">
          Invite
        </Button>
        <Button onClick={handleClose} color="primary" className="close">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteScholarDialog;
