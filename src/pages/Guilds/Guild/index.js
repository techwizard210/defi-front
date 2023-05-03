import { useState } from 'react';
import { isMobile } from 'react-device-detect';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import GuildProfile from '../GuildProfile';
import Dashboard from '../Dashboard';
import Members from './Members';
import Settings from './Settings';

const GuildPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, tab) => {
    setSelectedTab(tab);
  };

  const TabSection = () => {
    return (
      <>
        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          onChange={handleTabChange}
          centered
        >
          <Tab label="Dashboard" />
          <Tab label="Members" />
          <Tab label="Settings" />
        </Tabs>
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
    <>
      <div className={`guildManagement ${isMobile ? 'mobile' : ''}`}>
        <GuildProfile />

        <TabSection />

        <TabPanel value={selectedTab} index={0}>
          <Dashboard />
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <Members />
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <Settings />
        </TabPanel>
      </div>
    </>
  );
};

export default GuildPage;
