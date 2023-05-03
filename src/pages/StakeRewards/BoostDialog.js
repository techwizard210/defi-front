import { useState, useEffect } from 'react';
import { v4 as uuid_v4 } from 'uuid';
import clsx from 'clsx';
import { DateTime } from 'luxon';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';

import { useWeb3React } from '@web3-react/core';

import { toast } from 'react-toastify';

// ** Import gif files
import cart from '../../assets/img/Browse/cart.png';
import BitcoinXTCGIF from '../../assets/img/gifs/BitcoinXTCGIF.gif';
import AnonXTCGIF from '../../assets/img/gifs/AnonXTCGIF.gif';
import TeslaXTCGIF from '../../assets/img/gifs/TeslaXTCGIF.gif';

import {
  getGameFactoryContractInstance,
  approveTokenToContract,
  _isValidChainId,
} from '../../helpers';

import { getBoostItemStatus } from '../../helpers/boostHelpers';

import { myfirebase, db } from '../../firebase';
import useStyles from '../../assets/styles';
import { BoostEnabled } from '../../constants';
import CountdownTimer from '../../components/CountdownTimer';

const BoostDialog = (props) => {
  const classes = useStyles.browseGame();
  const boostDialogClasses = useStyles.boostDialog();

  const [goldAmountToSell, setGoldAmountToSell] = useState(0);
  const [silverAmountToSell, setSilverAmountToSell] = useState(0);
  const [bronzeAmountToSell, setBronzeAmountToSell] = useState(0);
  const [boostExpiryDates, setBoostExpiryDates] = useState([]);
  const [boostActiveStatuses, setBoostActiveStatuses] = useState([]);
  const [boostActive, setBoostActive] = useState();

  const { account, chainId } = useWeb3React();

  const { open, state, handleBoostClose, setLoading } = props;

  const boostData = [
    {
      image: BitcoinXTCGIF,
      title: 'GOLD',
      ids: 'gold-amount',
      value: goldAmountToSell,
      handleChange: setGoldAmountToSell,
      level: 1,
      levelWording: 'L5: Game Master',
      rewardLevel: 5,
    },
    {
      image: AnonXTCGIF,
      title: 'SILVER',
      ids: 'silver-amount',
      value: silverAmountToSell,
      handleChange: setSilverAmountToSell,
      level: 2,
      levelWording: 'L4: Power User!',
      rewardLevel: 4,
    },
    {
      image: TeslaXTCGIF,
      title: 'BRONZE',
      ids: 'bronze-amount',
      value: bronzeAmountToSell,
      handleChange: setBronzeAmountToSell,
      level: 3,
      levelWording: 'L3: Early Adopter',
      rewardLevel: 3,
    },
  ];

  const buyItem = async (e, item) => {
    e.preventDefault();
    if (!BoostEnabled) return;

    const alertString = `Please confirm increase of staking to "${item.levelWording}"
If you confirm, you will receive a prompt requiring the confirmation in your web wallet.`;
    if (!window.confirm(alertString)) return;

    if (!account || !chainId || !(await _isValidChainId())) {
      toast.error(`Unsupported network. Please Change Network`);
      return;
    }
    setLoading(true);

    try {
      const factoryContract = getGameFactoryContractInstance();
      await approveTokenToContract(10000, state.userAddress);
      await factoryContract.methods
        .stakeForBoost(item.level)
        .send({ from: state.userAddress });

      toast.success(
        `Congratulations! You bought ${item.levelWording} successfully`
      );
    } catch (err) {
      toast.error(err.message ? err.message : `Transaction Failed`);
      setLoading(false);
      return;
    }
    try {
      let res = {};
      res = await db
        .collection('users')
        .where('address', '==', state.userAddress)
        .get();

      const userID = res.docs.map((doc) => doc.id);

      const fbUser = myfirebase.auth().currentUser;

      if (userID[0] !== null && userID[0] !== undefined) {
        await db
          .collection('users')
          .doc(userID[0])
          .update({
            stakedLevel: 6 - item.level,
            uid: fbUser.uid,
          });
      }

      const data = {
        address: state.userAddress,
        amount: Number(state.itemPrice[item.level - 1] * 0.95),
        startDate: DateTime.local().setZone('UTC-6').toISODate(),
        endDate: DateTime.local()
          .plus({ days: 21 })
          .setZone('UTC-6')
          .toISODate(),
        boostItem: item.level,
      };
      await db.collection('boostPurchases').add(data);

      window.location.reload();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchBoostExpiryData = async () => {
      const bronzeBoostStatus = await getBoostItemStatus(3, account);
      if (bronzeBoostStatus.activeStatus) {
        setBoostActive(true);
      }
      const silverBoostStatus = await getBoostItemStatus(2, account);
      if (silverBoostStatus.activeStatus) {
        setBoostActive(true);
      }
      const goldBoostStatus = await getBoostItemStatus(1, account);
      if (goldBoostStatus.activeStatus) {
        setBoostActive(true);
      }

      setBoostExpiryDates([
        goldBoostStatus.expiryDate,
        silverBoostStatus.expiryDate,
        bronzeBoostStatus.expiryDate,
      ]);
      setBoostActiveStatuses([
        goldBoostStatus.activeStatus,
        silverBoostStatus.activeStatus,
        bronzeBoostStatus.activeStatus,
      ]);
    };
    if (account || (account && open)) {
      fetchBoostExpiryData();
    }
  }, [account, open]);

  return (
    <Dialog
      scroll="body"
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleBoostClose}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogContent>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          className={`${classes.padding} activeCard`}
        >
          <Grid
            item
            lg={12}
            md={12}
            sm={12}
            xs={12}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            className={`${boostDialogClasses.boostHeading} boost`}
          >
            BOOST
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            sm={12}
            xs={12}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            className={boostDialogClasses.boostHeading}
          >
            <Box color="primary.contrastText" textAlign="center">
              Power up with a boost item to earn higher rewards!
              <br />
              <br />
              Boost items last for 30 days before expiring
            </Box>
          </Grid>
          {boostData.map((item, index) => (
            <Grid
              item
              xl={4}
              lg={4}
              md={4}
              sm={12}
              xs={12}
              key={uuid_v4()}
              className={classes.paddingItem}
            >
              <Card className={boostDialogClasses.itemCard}>
                <Grid
                  container
                  className={`${classes.fchild} ${
                    boostActiveStatuses && boostActiveStatuses[item.level - 1]
                      ? boostDialogClasses.currentlyActive
                      : ''
                  }`}
                >
                  {/* {boostActiveStatuses && boostActiveStatuses[item.level - 1] && (
                    <Grid
                      item
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <h2 className={boostDialogClasses.currentlyActiveHeader}>
                        Currently Active
                      </h2>
                    </Grid>
                  )} */}
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <CardMedia
                      className={classes.media}
                      image={item.image}
                      title={item.title}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <CardContent>
                      <Box
                        className={classes.defaultFontSize}
                        style={{ textAlign: 'center' }}
                      >
                        {Number(+state.itemPrice[index]).toLocaleString()} HiFi
                      </Box>
                      <Box
                        style={{ textAlign: 'center', paddingTop: '20px' }}
                        className={clsx(
                          classes.defaultColor,
                          classes.defaultFontSize
                        )}
                      >
                        {item.levelWording}
                      </Box>
                    </CardContent>
                  </Grid>
                  <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    className={boostDialogClasses.boostWarning}
                  >
                    {boostActiveStatuses &&
                      boostActiveStatuses[item.level - 1] && (
                        <div style={{ textAlign: 'center' }}>
                          <h1 className="text-center mt-3">Expires in: </h1>
                          <h1 className="text-center mt-3">
                            <CountdownTimer
                              expiryDateProp={boostExpiryDates[item.level - 1]}
                              callback={() =>
                                setBoostActiveStatuses([false, false, false])
                              }
                            />
                          </h1>
                        </div>
                      )}
                    {!boostActive &&
                      boostActiveStatuses[item.level - 1] != null &&
                      !boostActiveStatuses[item.level - 1] && (
                        <Button
                          component="span"
                          className={classes.gpButton}
                          onClick={(e) => buyItem(e, item)}
                          disabled={boostActive || boostActive === null}
                        >
                          <img
                            src={cart}
                            alt="cart"
                            style={{ height: '20px', marginRight: '5px' }}
                          />
                          BUY ITEM
                        </Button>
                      )}
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBoostClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BoostDialog;
