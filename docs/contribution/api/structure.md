# API Structure

In this document, we describe how the API package is structured.

Henceforth, all the paths mentioned here implicitly have the
`<repository>/packages/api` as their prefix, unless specified otherwise.

-   `source`

    The TypeScript files for the API goes in the `source` directory.

    -   `source/controllers`

        Contains the controllers that perform the actual operation when an API endpoint
        is invoked. The controllers are abstracted in such a way that both REST APIs and
        GraphQL APIs can invoke the same set of controllers.

    -   `source/graphql`

        Contains the GraphQL schema and resolvers for private and public APIs.

    -   `source/middleware`

        Contains Express middleware.

    -   `source/models`

        Contains Mongoose models describing the schema for all the collections used by
        the controllers.

    -   `source/types`

        Contains interfaces and other TypeScript type declarations that are used across
        the package.

    -   `source/utils`

        Contains common utility functions.

-   `test`

    The unit tests for the API goes in the `test` directory.

-   `.dockerignore`

    Configures a list of globs identifiying paths that should be ignored by Docker.

-   `.env`

    The `.env` file contains all the environment variables used for development and
    testing. It contains sensitive information and is ignored by Git.

    In production, the environment variables are injected by Kubernetes or Docker.

-   `.gitignore`

    Configures a list of globs identifiying paths that should be ignored by Git.

-   `.mocharc.json`

    The configuration for Mocha.

-   `Dockerfile`

    The `Dockerfile` contains the commands that need to be executed to assemble an
    image.

-   `package.json`

    The `package.json` file contains dependencies and configuration that are required
    by the API package.

-   `tsconfig.json`

    The configuration for compiling TypeScript files in the `source` directory.
