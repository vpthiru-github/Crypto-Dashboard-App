import React from 'react';
import {
  Drawer,
  Button,
  Avatar,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { CryptoState } from '../../CryptoContext';
import authService from '../../services/authService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import './UserSidebar.css';

export default function UserSidebar() {
  const [state, setState] = React.useState({
    right: false,
  });
  const [watchlist, setWatchlist] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { user, setAlert, setUser, currency } = CryptoState();
  const navigate = useNavigate();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const logOut = () => {
    authService.logout();
    setUser(null);
    setAlert({
      open: true,
      type: 'success',
      message: 'Logout Successful !',
    });
    toggleDrawer('right', false);
    navigate('/');
  };

  const fetchWatchlist = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = authService.getToken();
      if (!token) {
        console.error('No token found');
        setAlert({
          open: true,
          type: 'error',
          message: 'Please login again',
        });
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      // Fetch watchlist IDs from backend
      console.log('Fetching watchlist from:', 'http://localhost:5002/api/watchlist');
      const { data: watchlistIds } = await axios.get(
        'http://localhost:5002/api/watchlist',
        config
      );

      console.log('Received watchlist IDs:', watchlistIds);

      if (!watchlistIds || !Array.isArray(watchlistIds)) {
        console.error('Invalid watchlist data received:', watchlistIds);
        setWatchlist([]);
        return;
      }

      // Fetch coin details from CoinGecko for each watchlist item
      const watchlistData = await Promise.all(
        watchlistIds.map(async (coinId) => {
          try {
            console.log('Fetching data for coin:', coinId);
            const { data } = await axios.get(
              `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${currency.toLowerCase()}&include_24hr_change=true`
            );
            
            if (!data || !data[coinId]) {
              console.error('Invalid data received for coin:', coinId, data);
              return null;
            }

            return {
              id: coinId,
              price: data[coinId][currency.toLowerCase()] || 0,
              change24h: data[coinId][`${currency.toLowerCase()}_24h_change`] || 0,
            };
          } catch (error) {
            console.error(`Error fetching data for coin ${coinId}:`, error);
            return null;
          }
        })
      );

      // Filter out any null values from failed requests
      const validWatchlistData = watchlistData.filter(item => item !== null);
      console.log('Final watchlist data:', validWatchlistData);
      setWatchlist(validWatchlistData);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        authService.logout();
        setUser(null);
        setAlert({
          open: true,
          type: 'error',
          message: 'Session expired. Please login again.',
        });
      } else {
        console.error('Error details:', error.response?.data);
        setAlert({
          open: true,
          type: 'error',
          message: error.response?.data?.message || 'Error fetching watchlist',
        });
      }
      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (state.right) {
      fetchWatchlist();
    }
  }, [state.right, currency]);

  // Ensure we're getting the correct user data
  const username = user?.user?.name;
  const email = user?.user?.email;

  return (
    <div>
      <Button
        onClick={toggleDrawer('right', true)}
        className="avatar-button"
      >
        <Avatar className="small-avatar">
          {username ? username[0].toUpperCase() : "?"}
        </Avatar>
      </Button>

      <Drawer
        anchor={'right'}
        open={state['right']}
        onClose={toggleDrawer('right', false)}
      >
        <Box className="drawer-container">
          <Box className="drawer-content">
            <Avatar className="large-avatar">
              {username ? username[0].toUpperCase() : "?"}
            </Avatar>
            <Box className="user-info-container">
              <Box className="user-info-row">
                <PersonIcon className="info-icon" />
                <Typography variant="h6">
                  {username || 'Loading...'}
                </Typography>
              </Box>
              <Divider className="divider" />
              <Box className="user-info-row">
                <EmailIcon className="info-icon" />
                <Typography className="email-text">
                  {email || 'Loading...'}
                </Typography>
              </Box>
            </Box>
            
            <Divider style={{ margin: '20px 0' }} />
            
            <Typography variant="h6" style={{ marginBottom: '10px' }}>
              Watchlist
            </Typography>
            
            {loading ? (
              <CircularProgress size={30} />
            ) : (
              <List style={{ width: '100%', maxHeight: '300px', overflowY: 'auto' }}>
                {watchlist.length === 0 ? (
                  <ListItem>
                    <ListItemText primary="No coins in watchlist" />
                  </ListItem>
                ) : (
                  watchlist.map((coin) => (
                    <ListItem 
                      key={coin.id}
                      button
                      onClick={() => {
                        navigate(`/coins/${coin.id}`);
                        setState({ ...state, right: false });
                      }}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '10px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <ListItemText 
                        primary={coin.id.charAt(0).toUpperCase() + coin.id.slice(1)} 
                      />
                      <Box style={{ textAlign: 'right' }}>
                        <Typography variant="body1">
                          {currency} {coin.price.toLocaleString()}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          style={{ 
                            color: coin.change24h > 0 ? 'rgb(14, 203, 129)' : 'red',
                            fontSize: '0.8rem'
                          }}
                        >
                          {coin.change24h > 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                        </Typography>
                      </Box>
                    </ListItem>
                  ))
                )}
              </List>
            )}

            <Button
              variant="contained"
              className="logout-button"
              onClick={logOut}
              style={{ marginTop: '20px' }}
            >
              Log Out
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
}
