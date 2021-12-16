#!/bin/sh

sed -i 's|ZEPPELIN_SERVER_URL|'${VUE_APP_ZEPPELIN_URL}'|g' /usr/share/nginx/html/js/app.*.js*

exec "$@"
