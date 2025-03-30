FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN mkdir -p /app/node_modules/.cache && \
    chmod -R 777 /app/node_modules/.cache
RUN npm ci
COPY . ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]