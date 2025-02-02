import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Homepage from "./Pages/HomePage";
import CoinPage from "./Pages/CoinPage";
import Alert from "./components/Alert";
import { makeStyles } from '@mui/styles';
import { ThemeProvider, createTheme } from '@mui/material';

const useStyles = makeStyles({
  app: {
    backgroundColor: "#14161a",
    color: "white",
    minHeight: "100vh",
  },
});

function App() {
  const classes = useStyles();
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <div className={classes.app}>
          <Header />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/coins/:id" element={<CoinPage />} />
          </Routes>
        </div>
        <Alert />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
