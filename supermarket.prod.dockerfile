##### Stage 1
FROM node:latest as node
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build -- --prod
##### Stage 2
FROM nginx:alpine
VOLUME /var/cache/nginx
COPY --from=node /app/dist /usr/share/nginx/html
# docker build -t nginx-angular -f supermarket.prod.dockerfile .
# docker run -p 8080:80 nginx-angular
# mettre cette ligne "build": "ng build" dans le package.json s'il n'est pas la, pour permettre à RUN npm build -- -- prod de marcher :)
