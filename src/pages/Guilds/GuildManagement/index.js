import { useEffect, useState, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { isMobile } from 'react-device-detect';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import { walletAuthFetchWithSigPrompt } from '../../../helpers/apiFetchWrappers';
import GuildProfile from '../GuildProfile';
import Dashboard from '../Dashboard';
import Members from './ManagementTabs/Members/Members';
import Scholars from './ManagementTabs/Scholars/Scholars';
import GuildNFTs from './ManagementTabs/GuildNFTs';
import Notifications from './ManagementTabs/Notifications';
import Settings from './ManagementTabs/Settings';

const GuildManagement = (props) => {
  const { wipeSignatureAndReRequest } = props;

  const [selectedTab, setSelectedTab] = useState(0);
  const [permissions, setPermissions] = useState(null);

  const { account, chainId } = useWeb3React();

  const handleTabChange = (event, tab) => {
    setSelectedTab(tab);
  };

  const getGuildData = useCallback(async () => {
    try {
      const permissionsResp = await walletAuthFetchWithSigPrompt(
        `GuildManagement/Permissions`,
        'GET',
        wipeSignatureAndReRequest,
        account,
        null,
        false,
        null
      );

      setPermissions(permissionsResp);
    } catch (error) {
      console.log('failed to fetch permissions');
    }
  }, [account, wipeSignatureAndReRequest]);

  useEffect(() => {
    getGuildData();
  }, [account, chainId, getGuildData, wipeSignatureAndReRequest]);

  const TabSection = () => {
    return (
      <>
        <Tabs
          value={selectedTab}
          indicatorColor="primary"
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : undefined}
          centered={!isMobile}
        >
          {permissions?.dashboardPermissions && <Tab label="Dashboard" />}

          {permissions?.membersPermissions && <Tab label="Members" />}
          {permissions?.scholarsPermissions && <Tab label="Scholars" />}
          {permissions?.scholarManagementPermissions && (
            <Tab label="Scholar Management" />
          )}
          {permissions?.notificationsPermissions && (
            <Tab label="Notifications" />
          )}
          {permissions?.settingsPermissions && <Tab label="Settings" />}
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
    <div className={`guildManagement ${isMobile ? 'mobile' : ''}`}>
      <GuildProfile />
      <TabSection />
      {permissions?.dashboardPermissions && (
        <TabPanel value={selectedTab} index={0}>
          <Dashboard />
        </TabPanel>
      )}
      {permissions?.membersPermissions && (
        <TabPanel value={selectedTab} index={1}>
          <Members />
        </TabPanel>
      )}
      {permissions?.scholarsPermissions && (
        <TabPanel value={selectedTab} index={2}>
          <Scholars />
        </TabPanel>
      )}
      {permissions?.scholarManagementPermissions && (
        <TabPanel value={selectedTab} index={3}>
          <GuildNFTs />
        </TabPanel>
      )}
      {permissions?.notificationsPermissions && (
        <TabPanel value={selectedTab} index={4}>
          <Notifications />
        </TabPanel>
      )}
      {permissions?.settingsPermissions && (
        <TabPanel value={selectedTab} index={5}>
          <Settings />
        </TabPanel>
      )}
    </div>
  );
};

export default GuildManagement;
