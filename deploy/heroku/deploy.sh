API_APP_NAME=hypertool-api

heroku create $API_APP_NAME

heroku buildpacks:add -a $API_APP_NAME https://github.com/lstoll/heroku-buildpack-monorepo

heroku buildpacks:add -a $API_APP_NAME heroku/nodejs

heroku config:set -a $API_APP_NAME APP_BASE=packages/api

git remote add $API_APP_NAME https://git.heroku.com/$API_APP_NAME.git

git push $API_APP_NAME main