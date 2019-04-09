FROM node:8.15-alpine

MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

WORKDIR /dnd-machine/ui

COPY app/static /dnd-machine/app/static
COPY ui /dnd-machine/ui

RUN npm install

CMD [ "npm", "run", "start:dev" ]
