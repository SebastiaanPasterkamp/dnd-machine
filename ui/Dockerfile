FROM node:8.16-alpine

MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

WORKDIR /dnd-machine/ui

RUN apk \
    --no-cache \
    add \
        build-base \
        python

USER 1000

COPY app/static /dnd-machine/app/static
COPY ui /dnd-machine/ui

CMD [ "/bin/sh", "docker/run.sh" ]
