# Command to build the container:
# docker build . -f ./Dockerfile -t itssamuelrowe/hypertool-ghost:latest
#
# Command to run the container:
# docker run -p 3000:80 -d itssamuelrowe/hypertool-ghost:latest

# Install dependencies only when needed
FROM node:16.3.0-alpine AS builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /hypertool-ghost

# Prepare for installing the dependencies
COPY ./package.json ./yarn.lock ./

# Install dependencies for development
RUN yarn install --frozen-lockfile

# Copy the source code along with the necessary configuration files
COPY ./src ./src
COPY ./public ./public
COPY ./tsconfig.json ./.env.production ./

# Build the source code
RUN ["yarn", "build"]

# --- Production ---

FROM nginx:stable-alpine

COPY --from=builder /hypertool-ghost/build /usr/share/nginx/html

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]