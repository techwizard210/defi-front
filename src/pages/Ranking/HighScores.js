import { useState, useEffect, Suspense } from 'react';
import { useWeb3React } from '@web3-react/core';
import { v4 as uuid_v4 } from 'uuid';
import clsx from 'clsx';
import _ from 'lodash';

// ** Import Material-Ui Components
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Spinner from '../../components/Spinner';

// ** Import Assets
import useStyles from '../../assets/styles';
import gold from '../../assets/img/Cup/goldcup.png';
import silver from '../../assets/img/Cup/silvercup.png';
import bronze from '../../assets/img/Cup/bronzecup.png';

import { db } from '../../firebase';

const HighScores = () => {
  const classes = useStyles.ranking();
  const { chainId } = useWeb3React();

  const [highScoreData, setHighScoreData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userMapperData, setUserMapperData] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await db.collection('users').get();
      const userMapper = {};
      response.docs.forEach((doc) => {
        const localDoc = doc.data();
        userMapper[localDoc.address] = localDoc.name ?? localDoc.address;
      });

      setUserMapperData(userMapper);
    };
    const fetchHighScores = () => {
      fetch(`HighScore`)
        .then((response) => response.json())
        .then((highscores) => {
          const orderedScores = _.orderBy(highscores, ['score'], ['desc']);
          setHighScoreData(orderedScores);
        });
    };
    if (chainId) {
      fetchHighScores();
      fetchUsers();
    }
  }, [chainId]);

  const handleListItemClick = (event, index) => setSelectedIndex(index);

  return (
    <Grid container justifyContent="center">
      <Grid item className={clsx(classes.marginBottom5)} />
      <Grid item lg={11} md={11} sm={12} xs={12}>
        <List dense className={classes.rankList}>
          {highScoreData.length < 1 && <Suspense fallback={<Spinner />} />}
          {highScoreData.length > 0 &&
            userMapperData &&
            highScoreData.map((data, index) => {
              return (
                <List
                  key={uuid_v4()}
                  component="nav"
                  aria-label="main mailbox folders"
                >
                  <ListItem
                    button
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(event, index)}
                  >
                    {index === 0 && (
                      <ListItemIcon className={classes.ListCupItem}>
                        <img src={gold} alt="gold" />
                      </ListItemIcon>
                    )}
                    {index === 1 && (
                      <ListItemIcon className={classes.ListCupItem}>
                        <img src={silver} alt="silver" />
                      </ListItemIcon>
                    )}
                    {index === 2 && (
                      <ListItemIcon className={classes.ListCupItem}>
                        <img src={bronze} alt="bronze" />
                      </ListItemIcon>
                    )}
                    {index > 2 && (
                      <ListItemText
                        primary={index + 1}
                        className={classes.ListRankItem}
                      />
                    )}
                    <ListItemIcon
                      key={uuid_v4()}
                      className={classes.userAddress}
                    >
                      {userMapperData[data.walletId]}
                    </ListItemIcon>
                    <ListItemIcon
                      key={uuid_v4()}
                      className={classes.ListAvatarItem}
                    >
                      {data.game}
                    </ListItemIcon>
                    <ListItemIcon key={uuid_v4()} className={classes.amount}>
                      {data.score}
                    </ListItemIcon>
                  </ListItem>
                </List>
              );
            })}
        </List>
      </Grid>
    </Grid>
  );
};

export default HighScores;
