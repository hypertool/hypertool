# Command to build the container:
# docker build . -f ./packages/api/Dockerfile -t hypertool/hypertool-api:latest
#
# Command to run the container:
# docker run -p 3001:3001 -d --env-file=./packages/api/.env hypertool/hypertool-api:latest

# --- Builder ---

FROM node:alpine AS builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /hypertool

# Prepare for installing the dependencies
COPY ./packages/api/package.json ./packages/api/package.json
COPY ./package.json ./yarn.lock ./lerna.json ./

# Install dependencies for development
RUN yarn install --frozen-lockfile

# Copy the source code along with the necessary configuration files
COPY ./packages/api/source ./packages/api/source
COPY ./packages/api/tsconfig.json ./packages/api/tsconfig.json

# Build the source code
RUN [ "yarn", "build" ]

# --- Production ---

FROM node:current-alpine3.12

ENV NODE_ENV production
WORKDIR /hypertool

# Prepare for installing dependencies
COPY ./packages/api/package.json ./packages/api/package.json
COPY ./package.json ./yarn.lock ./

# Install dependencies for production
RUN yarn install --production --frozen-lockfile

# Copy only the generated JavaScript files
COPY --from=builder /hypertool/packages/api/dist ./packages/api/dist

# Start the server
CMD [ "node", "./packages/api/dist/start.js" ]