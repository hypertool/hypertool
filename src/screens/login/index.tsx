import { FunctionComponent, ReactElement, useCallback } from 'react';
import { Typography, Button } from "@mui/material";
import { useGoogleLogin } from "react-google-login";
import { styled } from "@mui/material/styles";
import { gql } from "@apollo/client";
import { useNavigate } from "react-router";

import {
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";


const Root = styled("section")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(8),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.background.default),
  textAlign: "center",

  fontWeight: 900,
  fontSize: 24,

  [theme.breakpoints.up("md")]: {
    fontWeight: 900,
    fontSize: 28,
  },
}));

const SectionSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.background.default),
  fontWeight: 400,
  textAlign: "center",
  marginTop: theme.spacing(1),

  fontSize: 14,

  [theme.breakpoints.up("md")]: {
    fontSize: 18,
    maxWidth: 400,
  }
}));

const PrimaryAction = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: theme.spacing(1),
  textTransform: "none",
  width: "100%",
  [theme.breakpoints.up("md")]: {
    width: 264,
  },
}));

const LOGIN_WITH_GOOGLE = gql`
  mutation LoginWithGoogle(
    $token: String!
  ) {
    loginWithGoogle(
      token: $token
    ) {
      jwtToken
      user {
        id
      }
      createdAt
    }
  }
`;

const client = new ApolloClient({
  uri: `${process.env.REACT_APP_API_URL}/graphql/v1/public`,
  cache: new InMemoryCache(),
});


const Login: FunctionComponent = (): ReactElement => {

  const navigate = useNavigate();

  const onSuccess = useCallback(
    async (response: any) => {
        const result = await client
        .mutate({
          mutation: LOGIN_WITH_GOOGLE,
          variables: {token: response.tokenId}
        });
    delete result.data.loginWithGoogle.__typename;
    delete result.data.loginWithGoogle.user.__typename;
    localStorage.setItem("session", JSON.stringify(result.data.loginWithGoogle));
    navigate("/apps");
    },
    []
  );

  const onFailure = (event: any) => { };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID || "",
    cookiePolicy: "single_host_origin",
    isSignedIn: true,
  });


  const handleContinueWithGoogle = useCallback(() => {
    signIn();
  }, [signIn]);

  return (
    <Root>
      <SectionTitle>Welcome to HyperTool</SectionTitle>
      <SectionSubtitle>
        Don't have an account? No worries, we'll create it for you.
      </SectionSubtitle>
      <PrimaryAction variant="contained" color="primary" size="medium" onClick={handleContinueWithGoogle}>
        Continue with Google
      </PrimaryAction>
    </Root>
  );
};

export default Login;
