# Command to build the container:
# docker build . -f ./packages/abs/Dockerfile -t hypertool/hypertool-abs:latest
#
# Command to run the container:
# docker run -p 3001:3001 -d --env-file=./packages/abs/.env hypertool/hypertool-abs:latest

# --- Builder ---

FROM node:alpine AS builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /hypertool

# Prepare for installing the dependencies
COPY ./packages/abs/package.json ./packages/abs/package.json
COPY ./package.json ./yarn.lock ./lerna.json ./

# Install dependencies for development
RUN yarn install --frozen-lockfile

# Copy the source code along with the necessary configuration files
COPY ./packages/abs/source ./packages/abs/source
COPY ./packages/abs/tsconfig.json ./packages/abs/tsconfig.json

# Build the source code
RUN [ "yarn", "build" ]

# --- Production ---

FROM node:current-alpine3.12

ENV NODE_ENV production
WORKDIR /hypertool

# Prepare for installing dependencies
COPY ./packages/abs/package.json ./packages/abs/package.json
COPY ./package.json ./yarn.lock ./

# Install dependencies for production
RUN yarn install --production --frozen-lockfile

# Copy only the generated JavaScript files
COPY --from=builder /hypertool/packages/abs/dist ./packages/abs/dist

# Start the server
CMD [ "node", "./packages/abs/dist/start.js" ]