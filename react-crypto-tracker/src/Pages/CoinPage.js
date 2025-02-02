import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import axios from "axios";
import {
  Button,
  LinearProgress,
  Typography,
  styled,
} from "@mui/material";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import { numberWithCommas } from "../components/CoinsTable";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const Container = styled('div')({
  display: "flex",
  "@media (max-width: 900px)": {
    flexDirection: "column",
    alignItems: "center",
  },
});

const Sidebar = styled('div')({
  width: "30%",
  "@media (max-width: 900px)": {
    width: "100%",
  },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 25,
  borderRight: "2px solid grey",
});

const MarketData = styled('div')({
  alignSelf: "start",
  padding: 25,
  paddingTop: 10,
  width: "100%",
  "@media (max-width: 900px)": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  "@media (max-width: 400px)": {
    alignItems: "start",
  },
});

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();

  const { currency, symbol, user, watchlist, addToWatchlist, removeFromWatchlist } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  const isInWatchlist = watchlist.includes(coin?.id);

  const handleWatchlistClick = () => {
    if (isInWatchlist) {
      removeFromWatchlist(coin.id);
    } else {
      addToWatchlist(coin.id);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        <Sidebar>
          <img
            src={coin?.image.large}
            alt={coin?.name}
            height="200"
            style={{ marginBottom: 20 }}
          />
          <Typography variant="h3" style={{
            fontWeight: "bold",
            marginBottom: 20,
            fontFamily: "Montserrat",
          }}>
            {coin?.name}
          </Typography>
          <Typography variant="subtitle1" style={{
            width: "100%",
            fontFamily: "Montserrat",
            padding: 25,
            paddingBottom: 15,
            paddingTop: 0,
            textAlign: "justify",
          }}>
            {coin?.description.en.split(". ")[0]}.
          </Typography>
          <MarketData>
            <span style={{ display: "flex" }}>
              <Typography variant="h5" style={{
                fontWeight: "bold",
                marginBottom: 20,
                fontFamily: "Montserrat",
              }}>
                Rank:
              </Typography>
              &nbsp; &nbsp;
              <Typography variant="h5" style={{
                fontFamily: "Montserrat",
              }}>
                {numberWithCommas(coin?.market_cap_rank)}
              </Typography>
            </span>
            <span style={{ display: "flex" }}>
              <Typography variant="h5" style={{
                fontWeight: "bold",
                marginBottom: 20,
                fontFamily: "Montserrat",
              }}>
                Current Price:
              </Typography>
              &nbsp; &nbsp;
              <Typography variant="h5" style={{
                fontFamily: "Montserrat",
              }}>
                {symbol}{" "}
                {numberWithCommas(
                  coin?.market_data.current_price[currency.toLowerCase()]
                )}
              </Typography>
            </span>
            <span style={{ display: "flex" }}>
              <Typography variant="h5" style={{
                fontWeight: "bold",
                marginBottom: 20,
                fontFamily: "Montserrat",
              }}>
                Market Cap:
              </Typography>
              &nbsp; &nbsp;
              <Typography variant="h5" style={{
                fontFamily: "Montserrat",
              }}>
                {symbol}{" "}
                {numberWithCommas(
                  coin?.market_data.market_cap[currency.toLowerCase()]
                    .toString()
                    .slice(0, -6)
                )}
                M
              </Typography>
            </span>
            {user && (
              <Button
                variant="outlined"
                style={{
                  width: "100%",
                  height: 40,
                  backgroundColor: isInWatchlist ? "#ff0000" : "#EEBC1D",
                  marginTop: 20,
                  color: "white",
                }}
                onClick={handleWatchlistClick}
              >
                {isInWatchlist ? (
                  <StarIcon style={{ color: "white" }} />
                ) : (
                  <StarBorderIcon style={{ color: "white" }} />
                )}
                <span style={{ marginLeft: 10 }}>
                  {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                </span>
              </Button>
            )}
          </MarketData>
        </Sidebar>
        <CoinInfo coin={coin} />
      </Container>
    </ThemeProvider>
  );
};

export default CoinPage;
