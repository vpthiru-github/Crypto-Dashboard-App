import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingCoins } from "../../config/api";
import { CryptoState } from "../../CryptoContext";
import { numberWithCommas } from "../CoinsTable";
import coinGeckoApi from '../../config/coinGeckoApi';
import { Box } from "@mui/material";

const CarouselItem = styled(Link)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
  textTransform: "uppercase",
  color: "white",
  textDecoration: "none",
  padding: "0 10px",
  width: "25%",
  '&:hover': {
    transform: 'scale(1.05)',
    transition: 'transform 0.3s ease-in-out'
  }
});

const TrendingContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  width: "100%",
  height: "100%",
  padding: "20px 0",
});

const Carousel = () => {
  const [trending, setTrending] = useState([]);
  const { currency, symbol } = CryptoState();

  const fetchTrendingCoins = async () => {
    try {
      const { data } = await coinGeckoApi.get(TrendingCoins(currency));
      setTrending(data.slice(0, 4)); // Only take first 4 coins
    } catch (error) {
      console.error("Error fetching trending coins:", error);
      setTrending([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchTrendingCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  return (
    <TrendingContainer>
      {trending.map((coin) => {
        const profit = coin?.price_change_percentage_24h >= 0;

        return (
          <CarouselItem key={coin.id} to={`/coins/${coin.id}`}>
            <img
              src={coin?.image}
              alt={coin.name}
              height="80"
              style={{ marginBottom: 10 }}
            />
            <span>
              {coin?.symbol}
              &nbsp;
              <span
                style={{
                  color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                  fontWeight: 500,
                }}
              >
                {profit && "+"}
                {coin?.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </span>
            <span style={{ fontSize: 22, fontWeight: 500 }}>
              {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
            </span>
          </CarouselItem>
        );
      })}
    </TrendingContainer>
  );
};

export default Carousel;
