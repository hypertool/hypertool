import { styled } from "@mui/material/styles";
import { Typography, Button, Hidden } from "@mui/material";

const heroImage =
  "https://res.cloudinary.com/academyjs/image/upload/v1640405901/path670_pvv1wh.png";

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  minHeight: "calc(100vh - 64px)",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: 40,
  fontWeight: 800,
  lineHeight: 1.3,
  color: "white",
  textAlign: "left",
  [theme.breakpoints.down("md")]: {
    fontSize: 32,
    textAlign: "center",
  },
  [theme.breakpoints.up("md")]: {
    width: 600,
  },
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  marginTop: theme.spacing(3),
  textAlign: "left",
  lineHeight: 1.4,
  color: "white",
  [theme.breakpoints.down("md")]: {
    fontSize: 16,
    textAlign: "center",
    padding: theme.spacing(2),
  },
  [theme.breakpoints.up("md")]: {
    width: 600,
  },
}));

const ButtonContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "left",
  alignItems: "center",
  [theme.breakpoints.down("md")]: {
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginRight: theme.spacing(4),
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const HeroImage = styled("img")(({ theme }) => ({
  width: 500,
  height: "auto",
  marginTop: theme.spacing(6),
  marginLeft: theme.spacing(6),
  [theme.breakpoints.down("md")]: {
    marginLeft: theme.spacing(6),
  },
  [theme.breakpoints.down("sm")]: {
    width: 350,
    height: 262,
    alignSelf: "center",
  },
}));

const Hero = () => {
  return (
    <Container>
      <div>
        <Title>Build internal tools rapidly</Title>
        <SubTitle>
          Hypertool helps you build internal tools that seamelessly work with
          your databases, APIs, spreadsheets, and other apps.
        </SubTitle>
        <ButtonContainer>
          <PrimaryButton variant="contained">Create Account</PrimaryButton>
          <SecondaryButton variant="outlined">Getting Started</SecondaryButton>
        </ButtonContainer>
      </div>
      <Hidden lgDown={true}>
        <HeroImage src={heroImage} alt="logos" />
      </Hidden>
    </Container>
  );
};

export default Hero;
