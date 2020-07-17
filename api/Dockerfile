FROM node:12.18.2-alpine3.12 AS build
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm i
COPY ./src ./src
RUN ["npm", "run", "build"]

FROM node:12.18.2-alpine3.12
WORKDIR /app
COPY package*.json ./
RUN npm i --production
COPY --from=build /app/build ./build
EXPOSE 80
CMD ["npm", "start"]
