# build stage
FROM node:lts-alpine as build-stage
WORKDIR /
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /dist /usr/share/nginx/html
# expose env variable
COPY entrypoint.sh /usr/share/nginx/
RUN chmod +x /usr/share/nginx/entrypoint.sh
ENTRYPOINT ["/usr/share/nginx/entrypoint.sh"]
# copy across our conf file to make it work with Vue Router
COPY prod.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
