FROM nginx:alpine

MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

WORKDIR /dnd-machine

COPY app /dnd-machine/app

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80/tcp
EXPOSE 443/tcp
