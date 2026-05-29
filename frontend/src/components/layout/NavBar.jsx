import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box,
  Avatar, Menu, MenuItem, Divider, Tooltip,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavBar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const navLinks = [
    { label: 'Home', path: '/', icon: <HomeIcon fontSize="small" /> },
    { label: 'Search', path: '/search', icon: <SearchIcon fontSize="small" /> },
    { label: 'Library', path: '/library', icon: <LocalLibraryIcon fontSize="small" /> },
  ];

  const handleLogout = async () => {
    setAnchorEl(null);
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Toolbar>
        {/* Logo */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: 'pointer', mr: 4 }}
          onClick={() => navigate('/')}
        >
          <MenuBookIcon color="primary" />
          <Typography variant="h6" fontWeight={700} color="primary">
            BookApp
          </Typography>
        </Box>

        {/* Nav links — only shown when authenticated */}
        {isAuthenticated && (
          <Box display="flex" gap={1} flexGrow={1}>
            {navLinks.map(({ label, path, icon }) => (
              <Button
                key={path}
                startIcon={icon}
                onClick={() => navigate(path)}
                color={location.pathname === path ? 'primary' : 'inherit'}
                variant={location.pathname === path ? 'contained' : 'text'}
                size="small"
              >
                {label}
              </Button>
            ))}
          </Box>
        )}

        <Box flexGrow={1} />

        {/* User menu */}
        {isAuthenticated ? (
          <>
            <Tooltip title={user?.email}>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14 }}>
                  {user?.email?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem disabled>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button variant="contained" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
