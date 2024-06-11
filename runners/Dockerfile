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
RUN apk add --no-cache shadow

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN useradd -m us3r -u 1017
RUN mkdir -p /runner && chmod 777 /runner && chown us3r:us3r /runner
COPY . .
EXPOSE 7070
CMD ["node", "runner.js"]

