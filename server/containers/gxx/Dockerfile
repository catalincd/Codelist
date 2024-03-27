FROM alpine:3.14

RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories
RUN apk update

RUN apk add --no-cache g++
RUN apk add --no-cache time
RUN apk add --no-cache bash


