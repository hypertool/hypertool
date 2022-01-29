# Command to build the container:
# docker build . -f ./packages/query-engine/Dockerfile -t hypertool/query-engine:latest
#
# Command to run the container:
# docker run -p 5000:5000 -d --env-file=./packages/query-engine/.env hypertool/query-engine:latest

# --- Builder ---

FROM node:alpine AS builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /hypertool

# Prepare for installing the dependencies
COPY ./packages/query-engine/package.json ./packages/query-engine/package.json
COPY ./package.json ./yarn.lock ./lerna.json ./

# Install dependencies for development
RUN yarn install --frozen-lockfile

# Copy the source code along with the necessary configuration files
COPY ./packages/query-engine/source ./packages/query-engine/source
COPY ./packages/query-engine/tsconfig.json ./packages/query-engine/tsconfig.json

# Build the source code
RUN [ "yarn", "build" ]

# --- Production ---

FROM node:current-alpine3.12

ENV NODE_ENV production
WORKDIR /hypertool

# Prepare for installing dependencies
COPY ./packages/query-engine/package.json ./packages/query-engine/package.json
COPY ./package.json ./yarn.lock ./

# Install dependencies for production
RUN yarn install --production --frozen-lockfile

# Copy only the generated JavaScript files
COPY --from=builder /hypertool/packages/query-engine/dist ./packages/query-engine/dist

# Start the server
CMD [ "node", "./packages/query-engine/dist/start.js" ]