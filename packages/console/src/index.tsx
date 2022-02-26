import React from "react";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    createHttpLink,
} from "@apollo/client";

import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { theme } from "./utils";

const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_API_URL}/graphql/v1/private`,
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <React.StrictMode>
        <CssBaseline>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <ApolloProvider client={client}>
                        <App />
                    </ApolloProvider>
                </BrowserRouter>
            </ThemeProvider>
        </CssBaseline>
    </React.StrictMode>,
    document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
