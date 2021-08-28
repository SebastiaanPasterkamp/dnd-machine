FROM node:8.16-alpine

MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

WORKDIR /dnd-machine/ui

ENV PATH=/dnd-machine/ui/node_modules/.bin:$PATH

RUN apk \
    --no-cache \
    add \
        build-base \
        python

COPY app/static /dnd-machine/app/static
COPY ui/package.json ui/package-lock.json /dnd-machine/ui/

RUN npm install

COPY ui /dnd-machine/ui

CMD [ "npm", "run", "start" ]
