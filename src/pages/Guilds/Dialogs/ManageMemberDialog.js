import { useCallback, useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';
import { v4 as uuid_v4 } from 'uuid';
import { isMobile } from 'react-device-detect';

// ** Import Material-Ui Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { walletAuthFetchWithSigPrompt } from '../../../helpers/apiFetchWrappers';

const ManageMemberDialog = (props) => {
  const { open, handleClose, wipeSignatureAndReRequest, selectedMember } =
    props;

  const { account } = useWeb3React();

  const [roleOptions, setRoleOptions] = useState(null);
  const [targetRole, setTargetRole] = useState(null);

  const handleChange = (event) => {
    setTargetRole(event.target.value);
  };

  const updateMemberRole = async () => {
    try {
      const scholarOffer = {
        TargetPlayerId: selectedMember.id,
        TargetRole: targetRole,
      };

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const options = {
        mode: 'cors',
        body: JSON.stringify(scholarOffer),
      };
      const updateMemberResp = await walletAuthFetchWithSigPrompt(
        `GuildManagement/UpdateMemberRank`,
        'POST',
        wipeSignatureAndReRequest,
        account,
        options,
        false,
        headers
      );

      if (updateMemberResp) {
        if (updateMemberResp.success) {
          toast.success('Member role updated');
          handleClose();
        } else {
          toast.error(updateMemberResp.error);
        }
      }
    } catch (error) {
      console.log('failed to update member role');
    }
  };

  const getMemberRankOptions = useCallback(async () => {
    try {
      const resp = await walletAuthFetchWithSigPrompt(
        `GuildManagement/GetMemberRankOptions`,
        'GET',
        wipeSignatureAndReRequest,
        account,
        null,
        false,
        null
      );
      setRoleOptions(resp.memberRankOptions);
    } catch (error) {
      console.log('Unable to fetch members rank options');
    }
  }, [account, wipeSignatureAndReRequest]);

  useEffect(() => {
    async function init() {
      await getMemberRankOptions();
    }
    if (account) {
      init();
    }
  }, [account, getMemberRankOptions]);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      aria-labelledby="max-width-dialog-title"
      className={`guildManagementModal assignScholarModal manageMemberModal ${
        isMobile ? 'mobile' : ''
      }`}
    >
      <DialogTitle id="max-width-dialog-title" style={{ textAlign: 'center' }}>
        Update Member
      </DialogTitle>
      <DialogContent className="body">
        <Grid container>
          <Grid item container lg={12} md={12} sm={12} xs={12} className="row">
            <Grid item lg={6} md={6} sm={6} xs={6}>
              Member Name:
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              {selectedMember?.name}
            </Grid>
          </Grid>
          <Grid item container lg={12} md={12} sm={12} xs={12} className="row">
            <Grid item lg={6} md={6} sm={6} xs={6}>
              Role
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel id="memberRoleLabel">Role</InputLabel>
                {roleOptions?.length > 0 && (
                  <Select
                    labelId="memberRoleLabel"
                    value={targetRole ?? selectedMember?.rank}
                    label="Age"
                    onChange={handleChange}
                    className="memberRoleSelect"
                  >
                    {roleOptions.map((role) => (
                      <MenuItem
                        key={uuid_v4()}
                        value={role.key}
                        className="roleOption"
                      >
                        {role.value}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={updateMemberRole} color="primary">
          Update Member
        </Button>
        <Button onClick={handleClose} color="primary" className="close">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageMemberDialog;
