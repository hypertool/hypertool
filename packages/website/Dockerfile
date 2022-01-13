# You can run this container with the following command:
# docker run -p 3000:3000 -d itssamuelrowe/hypertool-web:latest

# Install dependencies only when needed
FROM node:alpine AS dependencies

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /hypertool-web

# Prepare for installing the dependencies
COPY package.json yarn.lock ./

# Install dependencies for development
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:alpine AS builder

WORKDIR /hypertool-web

# Copy the source code along with the necessary configuration files
COPY . .
COPY --from=dependencies /hypertool-web/node_modules ./node_modules

# Build the source code
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:alpine AS runner

ENV NODE_ENV production
WORKDIR /hypertool-web

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Only copy next.config.js if we are not using the default configuration
COPY --from=builder /hypertool-web/next.config.js .
COPY --from=builder /hypertool-web/public ./public
COPY --from=builder --chown=nextjs:nodejs /hypertool-web/.next ./.next
COPY --from=builder /hypertool-web/node_modules ./node_modules
COPY --from=builder /hypertool-web/package.json ./package.json

USER nextjs

# Setup port on which the NextJS server will listen on
EXPOSE 3000
ENV PORT 3000

CMD ["node_modules/.bin/next", "start"]