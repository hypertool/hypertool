import { styled } from "@mui/material/styles";
import { Typography, Button } from "@mui/material";

const Container = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "calc(100vh - 64px)",
  }));


const Title = styled(Typography)(({ theme }) => ({
    fontSize: 40,
    lineHeight: 1.3,
    color: "white",
    [theme.breakpoints.down("sm")]: {
        fontSize: 32,
        textAlign: "center",
    },
  }));

const SubTitle =  styled(Typography)(({ theme }) => ({
    fontSize: 24,
    marginTop: theme.spacing(3),
    lineHeight: 1.4,
    color: "white",
    [theme.breakpoints.down("sm")]: {
        fontSize: 16,
        textAlign: "center",
    },
  }));

const ButtonContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
}))

const PrimaryButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(4),
    marginRight: theme.spacing(4)
}))

const SecondaryButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(4),
}))

const Hero = () => {
    return (
        <Container>
            <Title>
                Hypertool helps you build internal tools blazingly fast.
            </Title>
            <SubTitle>
                Streamline your process of building internal tools, while owning the source. 
            </SubTitle>
            <ButtonContainer>
                <PrimaryButton variant="contained">
                    Download Free
                </PrimaryButton>
                <SecondaryButton>
                    Read Docs
                </SecondaryButton>
            </ButtonContainer>
        </Container>
    );
};

export default Hero;