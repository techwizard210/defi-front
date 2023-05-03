import { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// ** Import Assets
import useStyles from '../../assets/styles';

import Rewards from './Rewards/Rewards';

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const classes = useStyles.profile();

  const handleTabChange = (event, tab) => {
    setSelectedTab(tab);
  };

  const TabSection = () => {
    return (
      <>
        <Grid container>
          <Grid item lg={12} sm={12} xs={12}>
            <Tabs
              value={selectedTab}
              indicatorColor="primary"
              onChange={handleTabChange}
              centered
            >
              <Tab label="Pending Rewards" />
              {/* <Tab label="Character Sheet" />
              <Tab label="Earnings" /> */}
            </Tabs>
          </Grid>
        </Grid>
      </>
    );
  };

  function TabPanel(tabPanelProps) {
    const { children, index } = tabPanelProps;

    return (
      <div
        role="tabpanel"
        hidden={selectedTab !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
      >
        {selectedTab === index && <Box>{children}</Box>}
      </div>
    );
  }

  return (
    <Box className={`${classes.root} adminScreen`}>
      <TabSection />

      <TabPanel value={selectedTab} index={0}>
        <Rewards />
      </TabPanel>

      {/* <TabPanel value={selectedTab} index={2}>
        <Earnings />
      </TabPanel> */}
    </Box>
  );
};

export default Profile;
