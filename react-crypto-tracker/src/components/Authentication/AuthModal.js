import React, { useState } from 'react';
import {
  Modal,
  Box,
  Button,
  Tab,
  Tabs,
  AppBar,
  TextField,
  Typography,
} from '@mui/material';
import authService from '../../services/authService';
import { CryptoState } from '../../CryptoContext';
import './AuthModal.css';

const AuthModal = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const { setAlert, setUser } = CryptoState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setError('');
  };

  const handleSubmit = async () => {
    if (value === 0) { // Login
      if (!email || !password) {
        setError('Please fill all fields');
        return;
      }
      try {
        const data = await authService.login(email, password);
        if (data.success) {
          setUser({
            token: data.token,
            user: {
              name: data.user.name,
              email: data.user.email,
              id: data.user.id
            }
          });
          setAlert({
            open: true,
            message: 'Login Successful!',
            type: 'success',
          });
          handleClose();
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Something went wrong');
      }
    } else { // Register
      if (!email || !password || !name || !confirmPassword) {
        setError('Please fill all fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      try {
        const data = await authService.register(name, email, password);
        if (data.success) {
          setUser({
            token: data.token,
            user: {
              name: data.user.name,
              email: data.user.email,
              id: data.user.id
            }
          });
          setAlert({
            open: true,
            message: 'Registration Successful!',
            type: 'success',
          });
          handleClose();
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Something went wrong');
      }
    }
  };

  return (
    <>
      <Button
        variant="contained"
        className="login-button"
        onClick={handleOpen}
      >
        Login
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="auth-modal"
        aria-describedby="authentication modal"
      >
        <Box className="modal-container">
          <AppBar
            position="static"
            className="modal-tabs"
          >
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              className="tabs-container"
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
          </AppBar>

          <Box className="form-container">
            {value === 1 && (
              <TextField
                variant="outlined"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                className="input-field"
              />
            )}
            <TextField
              variant="outlined"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              className="input-field"
            />
            <TextField
              variant="outlined"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              fullWidth
              className="input-field"
            />
            {value === 1 && (
              <TextField
                variant="outlined"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                fullWidth
                className="input-field"
              />
            )}
            <Button
              variant="contained"
              size="large"
              className="submit-button"
              onClick={handleSubmit}
            >
              {value === 0 ? 'Login' : 'Register'}
            </Button>
            {error && (
              <Typography
                className="error-message"
              >
                {error}
              </Typography>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AuthModal;
