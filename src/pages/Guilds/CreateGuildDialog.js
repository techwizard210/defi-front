/* eslint-disable */
import { v4 as uuid_v4 } from 'uuid';
import { useEffect, useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';

// ** Import Material-Ui Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import { walletAuthFetchWithSigPrompt } from '../../helpers/apiFetchWrappers';
import { toast } from 'react-toastify';

const CreateGuildDialog = (props) => {
  const { open, handleClose, wipeSignatureAndReRequest } = props;

  const { account, chainId } = useWeb3React();

  const [guildName, setGuildName] = useState(null);
  const [shortCode, setShortCode] = useState(null);

  const createGuild = async () => {
    try {
      const createGuildReq = {
        Name: guildName,
        ShortCode: shortCode,
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const options = {
        mode: 'cors',
        body: JSON.stringify(createGuildReq),
      };
      const createGuildResponse = await walletAuthFetchWithSigPrompt(
        `GuildManagement/Create`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        headers
      );

      if (createGuildResponse) {
        if (createGuildResponse.success) {
          toast.success('Guild created successfully');
          handleClose();
        } else {
          toast.error(`Failed to create guild: ${createGuildResponse.error}`);
        }
      }
    } catch (error) {
    }
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      className="guildModal"
    >
      <DialogTitle id="max-width-dialog-title" style={{ textAlign: 'center' }}>
        Create Guild
      </DialogTitle>
      <DialogContent className="body">
        <Grid container>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Guild Name"
              fullWidth
              type="text"
              value={guildName}
              onChange={(e) => setGuildName(e.target.value)}
            />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <TextField
              margin="dense"
              label="Guild Shortcode"
              inputProps={{ maxLength: 5 }}
              fullWidth
              type="text"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={createGuild} color="primary">
          Create
        </Button>
        <Button onClick={handleClose} color="primary" className="close">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGuildDialog;
