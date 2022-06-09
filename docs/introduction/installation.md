# Installation

> As of this writing, the only way to install Hypertool is from the source code.
> We are working on other solutions such as Docker and CLI (that you can install
> from NPM).

## Installing from source code

### Requirements

Hypertool requires the following tools installed on your system:

-   Node.js (v15, v16)
-   Yarn

> NOTE: As of now, Node.js 17.x is unsupported.

### Cloning the source code

You can find the source code for Hypertool on [GitHub](https://github.com/hypertool/hypertool).

To clone the repository, run the following command:

```sh
git clone https://github.com/hypertool/hypertool.git hypertool
cd hypertool
```

### Installing the dependencies

Hypertool uses Lerna to manage dependencies across the monorepo. (To be honest,
it painful to work with Lerna. We plan to remove it soon.)

To install all the dependencies, run the following command:

```
yarn install
```

### Building and serving Hypertool API

You need to configure the API server first. You can do this by creating `/.env`
in the root of the repository. Alternatively, if you are deploying on a server,
you can create environment variables.

```
NODE_ENV=production
DATABASE_URL=<MONGODB_DATABASE_URL>
PORT=3001
JWT_SIGNATURE_KEY=27aaaf0e344f6a1d0a2ce27bc67c2376
CLI_GOOGLE_CLIENT_ID=
CLI_GOOGLE_CLIENT_SECRET=
CLI_GOOGLE_REDIRECT_URI=
WEB_GOOGLE_CLIENT_ID=
WEB_GOOGLE_CLIENT_SECRET=
API_SERVICE_ACCOUNT_PROJECT_ID=
API_SERVICE_ACCOUNT_CLIENT_EMAIL=
API_SERVICE_ACCOUNT_PRIVATE_KEY=
APP_BUNDLES_BUCKET_NAME=
```

Unless you want to use Google OAuth, you can ignore all the variables with empty
values. The only variable you need to update is `DATABASE_URL`, which should point
to your MongoDB instance.

Once you have created `.env`, you can start the server:

```
cd packages/api
yarn build
yarn start
```

### Building and serving the Hypertool Console

You need to configure the console build first. You can do this by editing
`/packages/console/.env.production`.

For example, if your API server is listening on localhost:3001, your `.env.production`
should look like:

```
REACT_APP_API_URL=http://localhost:30001
```

Next, you need to build and serve the console.

```
cd packages/console
yarn build
npx --yes serve -s build
```
