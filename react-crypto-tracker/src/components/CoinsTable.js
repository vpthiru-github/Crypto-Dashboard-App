import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Pagination,
  Stack,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { CryptoState } from "../CryptoContext";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const StyledTableRow = styled(TableRow)({
  backgroundColor: "#16171a",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#131111",
  },
  fontFamily: "Montserrat",
});

const StyledTableCell = styled(TableCell)({
  color: "white",
  fontFamily: "Montserrat",
});

const StyledTextField = styled(TextField)({
  marginBottom: 20,
  width: "100%",
  "& label": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
  },
});

const StyledPagination = styled(Pagination)({
  "& .MuiPaginationItem-root": {
    color: "gold",
    borderColor: "gold",
    "&.Mui-selected": {
      backgroundColor: "gold",
      color: "black",
      "&:hover": {
        backgroundColor: "gold",
      },
    },
    "&:hover": {
      backgroundColor: "rgba(255, 215, 0, 0.1)",
    },
  },
  "& .MuiPaginationItem-ellipsis": {
    color: "gold",
  },
  "& .MuiPaginationItem-previousNext": {
    color: "gold",
    borderColor: "gold",
    "&:hover": {
      backgroundColor: "rgba(255, 215, 0, 0.1)",
    },
  },
});

export function numberWithCommas(x) {
  if (x === undefined || x === null) return "N/A";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function CoinsTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { 
    currency, 
    symbol, 
    coins, 
    loading, 
    error,
    user,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
  } = CryptoState();

  const handleSearch = () => {
    return coins?.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    ) || [];
  };

  const handleWatchlistClick = (event, coinId) => {
    event.stopPropagation();
    if (watchlist.includes(coinId)) {
      removeFromWatchlist(coinId);
    } else {
      addToWatchlist(coinId);
    }
  };

  const searchedCoins = handleSearch();

  if (loading) {
    return (
      <Container style={{ textAlign: "center" }}>
        <LinearProgress style={{ backgroundColor: "gold" }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h5"
          style={{
            margin: 20,
            fontFamily: "Montserrat",
            color: "red",
          }}
        >
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container style={{ textAlign: "center" }}>
      <Typography
        variant="h4"
        style={{ margin: 18, fontFamily: "Montserrat" }}
      >
        Cryptocurrency Prices by Market Cap
      </Typography>
      <StyledTextField
        label="Search For a Crypto Currency.."
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <TableContainer>
        <Table>
          <TableHead style={{ backgroundColor: "#EEBC1D" }}>
            <TableRow>
              {["Coin", "Price", "24h Change", "Market Cap", "Watchlist"].map((head) => (
                <StyledTableCell
                  style={{
                    color: "black",
                    fontWeight: "700",
                    fontFamily: "Montserrat",
                  }}
                  key={head}
                  align={head === "Coin" ? "left" : "right"}
                >
                  {head}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {searchedCoins
              .slice((page - 1) * 10, (page - 1) * 10 + 10)
              .map((row) => {
                const profit = row.price_change_percentage_24h > 0;
                const isInWatchlist = watchlist.includes(row.id);

                return (
                  <StyledTableRow
                    onClick={() => navigate(`/coins/${row.id}`)}
                    key={row.name}
                  >
                    <StyledTableCell
                      component="th"
                      scope="row"
                      style={{ display: "flex", gap: 15 }}
                    >
                      <img
                        src={row?.image}
                        alt={row.name}
                        height="50"
                        style={{ marginBottom: 10 }}
                      />
                      <div
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <span
                          style={{
                            textTransform: "uppercase",
                            fontSize: 22,
                          }}
                        >
                          {row.symbol}
                        </span>
                        <span style={{ color: "darkgrey" }}>
                          {row.name}
                        </span>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {symbol}{" "}
                      {numberWithCommas(row.current_price?.toFixed(2))}
                    </StyledTableCell>
                    <StyledTableCell
                      align="right"
                      style={{
                        color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                        fontWeight: 500,
                      }}
                    >
                      {profit && "+"}
                      {row.price_change_percentage_24h?.toFixed(2)}%
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {symbol}{" "}
                      {numberWithCommas(
                        row.market_cap?.toString().slice(0, -6)
                      )}
                      M
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {user && (
                        <IconButton
                          onClick={(e) => handleWatchlistClick(e, row.id)}
                          style={{
                            color: isInWatchlist ? "#EEBC1D" : "gray",
                          }}
                        >
                          {isInWatchlist ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {searchedCoins.length > 0 && (
        <Stack spacing={2} style={{ padding: 20, width: "100%", display: "flex", alignItems: "center" }}>
          <StyledPagination
            count={Math.ceil(searchedCoins.length / 10)}
            page={page}
            onChange={(_, value) => {
              setPage(value);
              window.scroll(0, 450);
            }}
            variant="outlined"
            shape="rounded"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
          />
        </Stack>
      )}
    </Container>
  );
}

export default CoinsTable;
