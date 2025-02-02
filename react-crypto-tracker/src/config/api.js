import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key

// Create axios instance with default config
export const coinGeckoApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CoinGecko-Api-Key': API_KEY,
  },
  timeout: 10000, // 10 seconds timeout
});

// Add response interceptor for error handling
coinGeckoApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 429) {
      // Rate limit exceeded, wait for a bit and retry
      await new Promise(resolve => setTimeout(resolve, 2000));
      return coinGeckoApi(error.config);
    }
    return Promise.reject(error);
  }
);

export const CoinList = (currency) =>
  `${API_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;

export const SingleCoin = (id) =>
  `${API_URL}/coins/${id}`;

export const HistoricalChart = (id, days = 365, currency) =>
  `${API_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

export const TrendingCoins = (currency) =>
  `${API_URL}/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;
