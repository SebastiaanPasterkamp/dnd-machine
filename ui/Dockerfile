FROM node:8.16-alpine

MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

RUN echo "export PATH=/dnd-machine/ui/node_modules/.bin:$PATH" > /etc/environment

WORKDIR /dnd-machine/ui

RUN apk \
    --no-cache \
    add \
        build-base \
        python \
    && chown -R 1000:1000 /dnd-machine

USER 1000

COPY package.json \
    package-lock.json \
    ./

RUN npm install

COPY . .

CMD [ "/bin/sh", "docker/run.sh" ]
