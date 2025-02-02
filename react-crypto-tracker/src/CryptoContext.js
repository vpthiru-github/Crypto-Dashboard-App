import React, { createContext, useContext, useEffect, useState } from "react";
import coinGeckoApi from "./config/coinGeckoApi";
import { CoinList } from "./config/api";
import authService from './services/authService';
import watchlistService from './services/watchlistService';

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const fetchCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await coinGeckoApi.get(CoinList(currency));
      setCoins(data);
    } catch (error) {
      console.error("Error fetching coins:", error);
      setError("Unable to fetch cryptocurrency data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWatchlist = async () => {
    if (user) {
      try {
        const data = await watchlistService.getWatchlist();
        setWatchlist(data);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    }
  };

  const addToWatchlist = async (coinId) => {
    if (!user) {
      setAlert({
        open: true,
        message: "Please login to add to watchlist",
        type: "error",
      });
      return;
    }

    try {
      await watchlistService.addToWatchlist(coinId);
      setAlert({
        open: true,
        message: "Coin added to watchlist!",
        type: "success",
      });
      await fetchWatchlist();
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || "Error adding coin to watchlist",
        type: "error",
      });
    }
  };

  const removeFromWatchlist = async (coinId) => {
    try {
      await watchlistService.removeFromWatchlist(coinId);
      setAlert({
        open: true,
        message: "Coin removed from watchlist!",
        type: "success",
      });
      await fetchWatchlist();
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || "Error removing coin from watchlist",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
  }, [currency]);

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  useEffect(() => {
    const userData = authService.getCurrentUser();
    if (userData && userData.user) {
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [user]);

  const value = {
    currency,
    setCurrency,
    symbol,
    coins,
    setCoins,
    loading,
    setLoading,
    error,
    setError,
    fetchCoins,
    user,
    setUser,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    alert,
    setAlert,
  };

  return <Crypto.Provider value={value}>{children}</Crypto.Provider>;
};

export default CryptoContext;

export const CryptoState = () => {
  const context = useContext(Crypto);
  if (context === undefined) {
    throw new Error("useCrypto must be used within a CryptoProvider");
  }
  return context;
};
