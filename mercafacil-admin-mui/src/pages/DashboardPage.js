import React, { useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Toolbar, Typography, Button 
} from '@mui/material';
import { 
  Menu as MenuIcon, Dashboard as DashboardIcon, Store as StoreIcon, 
  ShoppingBag as ShoppingBagIcon, TwoWheeler as BikeIcon, 
  AttachMoney as MoneyIcon, Logout as LogoutIcon 
} from '@mui/icons-material';

const drawerWidth = 240;

export default function DashboardPage() {
  const { signOut, auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const menuItems = [
    { text: 'Visão Geral', icon: <DashboardIcon />, path: '/' },
    { text: 'Mercados', icon: <StoreIcon />, path: '/markets' },
    { text: 'Produtos', icon: <ShoppingBagIcon />, path: '/products' },
    { text: 'Motoristas', icon: <BikeIcon />, path: '/drivers' },
    { text: 'Financeiro', icon: <MoneyIcon />, path: '/payouts' },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" noWrap>Mercafácil</Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" display="block" color="textSecondary">
          {auth.user?.name || 'Admin'}
        </Typography>
        <Button 
          variant="outlined" color="error" startIcon={<LogoutIcon />} fullWidth 
          onClick={() => { signOut(); navigate('/login'); }} sx={{ mt: 1 }}
        >
          Sair
        </Button>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">Painel Administrativo</Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(!mobileOpen)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent" open
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}