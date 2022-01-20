# You can run this container with the following command:
# docker run -p 3001:3001 -d --env-file=.env hypertool/hypertool-api:latest

# --- Builder ---

FROM node:alpine AS builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /hypertool-api

# Prepare for installing the dependencies
COPY package.json yarn.lock ./

# Install dependencies for development
RUN yarn install --frozen-lockfile

# Copy the source code along with the necessary configuration files
COPY source source
COPY tsconfig.json tsconfig.json

# Build the source code
RUN [ "yarn", "build" ]

# --- Production ---

FROM node:current-alpine3.12

ENV NODE_ENV production
WORKDIR /hypertool-api

# Prepare for installing dependencies
COPY package.json .
COPY yarn.lock .

# Install dependencies for production
RUN yarn install --production --frozen-lockfile

# Copy only the generated JavaScript files
COPY --from=builder /hypertool-api/dist ./dist

# Start the server
CMD [ "node", "./dist/start.js" ]