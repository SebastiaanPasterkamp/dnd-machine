FROM node:8.15-alpine as node
MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

WORKDIR /dnd-machine

COPY ui ./ui

RUN cd /dnd-machine/ui \
    && apk \
        --virtual .build-deps \
        --no-cache \
        add \
            build-base \
            python \
    && npm install \
    && apk del .build-deps \
    && npm run build:production

FROM python:3-alpine
MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

WORKDIR /dnd-machine

COPY requirements.txt *.md *.py ./

RUN apk add \
        --no-cache \
        --virtual .build-deps \
        build-base \
    && apk add \
        --no-cache \
        openssl-dev \
        libffi-dev \
    && pip install \
        --no-cache-dir \
        -r requirements.txt \
    && apk del \
        .build-deps

COPY app/ /dnd-machine/app
COPY --from=node /dnd-machine/app/static/ /dnd-machine/app/static/

VOLUME [ "/var/run/dnd-machine" ]

EXPOSE 5000/tcp

CMD [ "/bin/sh", "app/docker/run.sh", "--threaded", "--host", "0.0.0.0", "--port", "5000" ]
