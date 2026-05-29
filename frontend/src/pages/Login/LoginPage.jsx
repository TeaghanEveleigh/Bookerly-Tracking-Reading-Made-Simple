import { useState } from 'react';
import {
  Box, Container, Paper, Tabs, Tab, TextField, Button,
  Typography, Alert, CircularProgress, Divider, InputAdornment,
  IconButton,
} from '../../../node_modules/@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState(0); // 0 = Sign In, 1 = Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignUp = tab === 1;

  const handleSubmit = async () => {
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // TODO: These call your backend via AuthContext → userApi.js
      // Login: POST /user/login    { email, password } → { success, token }
      // Signup: POST /user/signup  { email, password } → { success, token }
      const result = isSignUp
        ? await signup(email, password)
        : await login(email, password);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error ?? 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect to the server. Is your backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: 'background.default', p: 2 }}
    >
      <Container maxWidth="xs">
        {/* Logo */}
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}  >
          <MenuBookIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h5" fontWeight={700} color="primary">
            BookApp
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your personal reading companion
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setError(''); }}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          <Box p={3} display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6" fontWeight={600}>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </Typography>

            {error && <Alert severity="error" sx={{ py: 0 }}>{error}</Alert>}

            <TextField
              label="Email address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="email"
              autoFocus
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {isSignUp && (
              <TextField
                label="Confirm password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="new-password"
              />
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
              size="large"
              sx={{ mt: 1 }}
            >
              {loading
                ? <CircularProgress size={22} color="inherit" />
                : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>

            <Divider>
              <Typography variant="caption" color="text.secondary">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </Typography>
            </Divider>

            <Button
              variant="text"
              fullWidth
              onClick={() => { setTab(isSignUp ? 0 : 1); setError(''); }}
            >
              {isSignUp ? 'Sign In instead' : 'Create an account'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
