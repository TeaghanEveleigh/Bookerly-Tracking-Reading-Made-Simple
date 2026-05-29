import { Box } from '@mui/material';
import NavBar from './NavBar';

const PageLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <NavBar />
      {/* Offset for fixed AppBar (64px default MUI Toolbar height) */}
      <Box component="main" sx={{ mt: '64px', flexGrow: 1, px: { xs: 2, md: 4 }, py: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default PageLayout;
