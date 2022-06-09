API_APP_NAME=hypertool-api

heroku create $API_APP_NAME

heroku buildpacks:add -a $API_APP_NAME https://github.com/lstoll/heroku-buildpack-monorepo

heroku buildpacks:add -a $API_APP_NAME heroku/nodejs

heroku config:set -a $API_APP_NAME APP_BASE=packages/api

git remote add $API_APP_NAME https://git.heroku.com/$API_APP_NAME.git

heroku config:set --app hypertoolx-api \
    NODE_ENV="production" \
    DATABASE_URL="..." \
    PORT="80" \
    API_URL="..." \
    JWT_SIGNATURE_KEY="..." \
    SENDGRID_API_KEY="..." \
    CONSOLE_URL="..."

git push $API_APP_NAME main