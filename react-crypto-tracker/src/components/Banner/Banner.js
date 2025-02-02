import { Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Carousel from "./Carousel";

const BannerContent = styled('div')({
  height: 400,
  display: "flex",
  flexDirection: "column",
  paddingTop: 25,
  justifyContent: "space-around",
});

const Tagline = styled('div')({
  display: "flex",
  height: "55%",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
});

const BannerBackground = styled('div')({
  backgroundImage: "url(./banner2.jpg)",
  backgroundPosition: "center",
  backgroundSize: "cover",
});

function Banner() {
  return (
    <BannerBackground>
      <Container>
        <BannerContent>
          <Tagline>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                marginBottom: 15,
                fontFamily: "Montserrat",
              }}
            >
              Crypto Dashboard
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "darkgrey",
                textTransform: "capitalize",
                fontFamily: "Montserrat",
              }}
            >
              Get all the Info regarding your favorite Crypto Currency
            </Typography>
          </Tagline>
          <Carousel />
        </BannerContent>
      </Container>
    </BannerBackground>
  );
}

export default Banner;
