# Setting up development environment

All the packages necessary to develop Hypertool are stored in a monorepo.
You can find it [here](https://github.com/hypertool/hypertool). In this document,
we describe how to setup a development environment.

## Prerequisites

1. Node

Hypertool is written in TypeScript to execute on Node.js. Therefore, make sure
Node.js is installed on your local machine. You can follow the
[official documentation](https://nodejs.org/en/download/package-manager/)
to install Node.js on your system.

2. Yarn

All the dependencies across the workspace are managed by Yarn.

We do not recommend using NPM to manage packages. Using NPM will produce
`package-lock.json`. If this file is found in your pull-requests, we will require
you to remove it before merging.

You can read more about Yarn and installing it on your local machine
[here](https://yarnpkg.com/getting-started/install).

We combine Lerna with Yarn workspaces to manage our monorepo. To add a new
dependency use the following command:

```bash
yarn workspace @hypertool/<package> add <dependency>
```

The command basically means `<package>` requires `<dependency>`.
Replace `<package>` and `<dependency>` appropriately.

Here's an example to install `express` as a dependency for `@hypertool/api`.

```bash
yarn workspace @hypertool/api add express
```

## Setting up the repository

1. Clone the [Hypertool repository](https://github.com/hypertool/hypertool) from GitHub.

```bash
mkdir ~/project
git clone git@github.com:hypertool/hypertool.git ~/project/hypertool
cd ~/project/hypertool
```

After executing the above commands, the Hypertool repository will be cloned
to `~/project/hypertool` on your local machine. Further, the current working
directory will be changed to `~/project/hypertool`.

2. Install the dependencies

In the root of the repository run the following command:

```bash
yarn install
```

This installs both the development and production dependencies that are used
by all the packages.
