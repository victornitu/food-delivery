FROM node:12.18.2-alpine3.12 AS build
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm i
COPY ./public ./public
COPY ./src ./src
RUN ["npm", "run", "build"]

FROM nginx:1.18-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
