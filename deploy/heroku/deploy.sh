API_APP_NAME=hypertool-api

heroku create $API_APP_NAME

heroku buildpacks:add -a $API_APP_NAME https://github.com/lstoll/heroku-buildpack-monorepo

heroku buildpacks:add -a $API_APP_NAME heroku/nodejs

heroku config:set -a $API_APP_NAME APP_BASE=packages/api

git remote add $API_APP_NAME https://git.heroku.com/$API_APP_NAME.git

heroku config:set --app hypertoolx-api \
    NODE_ENV="production" \
    DATABASE_URL="..." \
    API_PORT="80" \
    JWT_SIGNATURE_KEY="..." \
    CLI_GOOGLE_CLIENT_ID="..." \
    CLI_GOOGLE_CLIENT_SECRET="..." \
    CLI_GOOGLE_REDIRECT_URI="http://localhost:2819/oauth" \
    WEB_GOOGLE_CLIENT_ID="..." \
    WEB_GOOGLE_CLIENT_SECRET="..." \
    API_SERVICE_ACCOUNT_PROJECT_ID="..." \
    API_SERVICE_ACCOUNT_CLIENT_EMAIL="..." \
    API_SERVICE_ACCOUNT_PRIVATE_KEY="..." \
    APP_BUNDLES_BUCKET_NAME="..."

git push $API_APP_NAME main