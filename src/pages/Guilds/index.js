import { useState } from 'react';

import { isMobile } from 'react-device-detect';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import GuildList from './GuildList';

import Tavern from './Tavern';

const GuildsDashboard = () => {
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
          <Tab label="Guilds" />
          <Tab label="Tavern" />
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
        className="statsWrapper"
      >
        {selectedTab === index && <Box>{children}</Box>}
      </div>
    );
  }

  return (
    <div className={`guildsDashboard ${isMobile ? 'mobile' : ''}`}>
      <div className="heading">Guilds Hub</div>

      <TabSection />

      <TabPanel value={selectedTab} index={0}>
        <GuildList />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <Tavern />
      </TabPanel>
    </div>
  );
};

export default GuildsDashboard;
