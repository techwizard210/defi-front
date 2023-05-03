import { v4 as uuid_v4 } from 'uuid';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
// import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@mui/material/Link';

import { useWeb3React } from '@web3-react/core';

import useStyles from '../../assets/styles';

import Stake from '../../assets/img/StakeRewards/stake.png';

const StakeList = ({ stakeToken, earnApr, minForEarn }) => {
  const { account, chainId } = useWeb3React();
  const classes = useStyles.stakelist();

  return (
    <>
      <Grid className="staking">STAKING</Grid>
      <Grid container spacing={2}>
        <Grid item lg={4} md={4} sm={12} />
        <Grid
          item
          lg={4}
          md={4}
          sm={12}
          key={uuid_v4()}
          className={classes.stake}
        >
          <Paper className={classes.stakepaper}>
            <div>
              <img alt="EARN" src={Stake} className={classes.stakeimg} />
            </div>
            <Typography
              paragraph
              variant="h5"
              component="h2"
              className={classes.staketitle}
            >
              EARN
            </Typography>
            <Typography paragraph className={classes.headlineContent}>
              {earnApr ? `${earnApr}%` : '-'} APR*
            </Typography>
            <Typography paragraph className={classes.content1}>
              Want to earn HiFi from playing our games?
            </Typography>
            <Typography paragraph className={classes.stakecontent2}>
              {`Stake a minimum of ${minForEarn} HiFi to start earning today!`}
            </Typography>
            <Typography paragraph className={classes.stakecontent2}>
              Withdraw at any time.
            </Typography>
            <Typography paragraph className={classes.asteriskContent}>
              <Link
                href="https://hifigamingsociety.medium.com/2b76ed432067"
                underline="none"
                target="_blank"
                rel="noreferrer"
              >
                *Read more about the qualifying conditions
              </Link>
            </Typography>
            <div className={classes.stakeFooter} />
            <div className={classes.stakeFooterButtonWrapper}>
              <Button
                variant="contained"
                className={classes.stakeBtn}
                disabled={
                  !account ||
                  chainId !== parseInt(process.env.REACT_APP_CHAIN_ID, 10)
                }
                onClick={(e) => stakeToken(e, 'EARN')}
              >
                Stake / UnStake
              </Button>
            </div>
          </Paper>
        </Grid>
        <Grid item lg={4} md={4} sm={12} />
      </Grid>
    </>
  );
};

export default StakeList;
