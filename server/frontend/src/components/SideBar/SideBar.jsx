import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import BusinessIcon from '@mui/icons-material/Business';
import MailIcon from '@mui/icons-material/Mail';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const icons = {
    Home: <HomeIcon sx={{ color: 'white' }} />,
    Inbox: <InboxIcon sx={{ color: 'white' }} />,
    Dealerships: <BusinessIcon sx={{ color: 'white' }} />,
    Cars: <DirectionsCarFilledIcon sx={{ color: 'white' }} />,
  };

  const routes = {
    Home: "/",
    Inbox: "/inbox",
    Dealerships: "/dealers",
    Cars: "/cars",
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List style={{ marginTop: "100px", backgroundColor: "#1c273c" }}>
        {['Home', 'Inbox', 'Dealerships', 'Cars'].map((text) => (
          <Link to={routes[text]} key={text} style={{ textDecoration: 'none', color: 'white' }}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {icons[text]}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ color: 'white' }} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider sx={{ borderColor: 'white' }} />
      <List style={{ backgroundColor: "#1c273c" }}>
        {['E-Mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon sx={{ color: 'white' }} /> : <MailIcon sx={{ color: 'white' }} />}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 250, boxSizing: 'border-box', backgroundColor: "#1c273c", color: 'white' },
      }}
    >
      {DrawerList}
    </Drawer>
  );
}

export default Sidebar;

