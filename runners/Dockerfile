FROM alpine:3.16

RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories
RUN apk update

RUN apk add --no-cache g++
RUN apk add --no-cache python3
RUN apk add --no-cache nodejs
RUN apk add --no-cache npm
RUN apk add --no-cache mono
RUN apk add --no-cache openjdk11
RUN apk add --no-cache time
RUN apk add --no-cache bash

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 7070
CMD ["node", "runner.js"]

