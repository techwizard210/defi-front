import { useState } from 'react';
import { v4 as uuid_v4 } from 'uuid';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/styles';

import { isMobile } from 'react-device-detect';
import hifidefi from '../assets/img/tabIcons/hifidefi.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  tabButtons: {
    backgroundColor: 'rgba(0,0,0,.24)',
    width: '62px',
    height: '62px',
    flex: '0 0 auto',
    color: '#fff',
    overflow: 'visible',
    fontSize: '1.3928571428571428rem',
    textAlign: 'center',
    transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    borderRadius: '50%',
    minWidth: 'auto',
    margin: theme.spacing(0, 2, 0, 0),
    padding: theme.spacing(2),
    '& img': {
      width: theme.spacing(3),
    },
    '& .before': {
      transition: 'opacity .3s .2s,transform .3s .2s',
    },
    '& .after': {
      fontSize: '14px',
      position: 'absolute',
      width: '100%',
      opacity: 0,
      transform: 'rotate( 180deg )',
      transition: 'opacity .3s .2s,transform .3s .2s',
    },
    '&:hover': {
      '& .before': {
        transform: 'rotate(1turn)',
      },
    },
  },
  appbarHeader: {
    boxShadow: 'none',
    '& .Mui-selected': {
      color: '#fff',
      boxShadow: 'inset 0 0 0 2px #f9bb22',
    },
  },
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}));

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const tabButtonData = [
  {
    icon: hifidefi,
    type: 'All',
    keyValue: 'all',
    showMobile: false,
  },
  {
    icon: hifidefi,
    type: 'Monkeys',
    keyValue: 'monkeys',
    showMobile: false,
  },
  {
    icon: hifidefi,
    type: 'Jenga',
    keyValue: 'jenga',
    showMobile: false,
  },
  {
    icon: hifidefi,
    type: 'HTML',
    keyValue: 'web',
    showMobile: false,
  },
  {
    icon: hifidefi,
    type: 'High Score',
    keyValue: 'compete',
    showMobile: false,
  },
];

export default function ScrollableTabsButtonForce({ typeChangeHandle }) {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    typeChangeHandle(tabButtonData[newValue].keyValue);
  };

  const tabsToShow = tabButtonData.filter((tab) => tab.showMobile === isMobile);

  return (
    <AppBar position="static" color="default" className={classes.appbarHeader}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="on"
        indicatorColor="primary"
        textColor="primary"
        aria-label="scrollable force tabs"
      >
        {tabsToShow.map((item, index) => {
          return (
            <Tooltip title={item.type} aria-label="add" key={uuid_v4()}>
              <Tab
                className={classes.tabButtons}
                icon={
                  <img
                    src={item.icon}
                    alt={`Icon ${index}`}
                    className="before"
                  />
                }
                {...a11yProps(index)}
                key={uuid_v4()}
              />
            </Tooltip>
          );
        })}
      </Tabs>
    </AppBar>
  );
}
