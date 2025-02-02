import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';

// Create axios instance with default config
const coinGeckoApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Add response interceptor for error handling and rate limiting
coinGeckoApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 429) {
      // Rate limit exceeded, wait for a bit and retry
      await new Promise(resolve => setTimeout(resolve, 5000));
      return coinGeckoApi(error.config);
    }
    return Promise.reject(error);
  }
);

export default coinGeckoApi;
