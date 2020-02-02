FROM node:8.16-alpine as node
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

FROM python:3.6-alpine3.8
MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

ARG GIT_TAG
ARG GIT_COMMIT
ARG GIT_BRANCH

WORKDIR /dnd-machine

COPY requirements.txt *.md *.py ./

RUN apk add \
        --no-cache \
        --virtual .build-deps \
        build-base \
        linux-headers \
    && apk add \
        --no-cache \
        pcre \
        pcre-dev \
        openssl-dev \
        libffi-dev \
        pdftk \
    && pip install \
        --no-cache-dir \
        -r requirements.txt \
    && apk del \
        .build-deps \
    && mkdir /data

COPY app/ /dnd-machine/app
COPY --from=node /dnd-machine/app/static/ /dnd-machine/app/static/

RUN apk add \
        --no-cache \
        --virtual .build-deps \
        jq \
    && cat app/config.json \
        | jq '. | .info.version = "'$GIT_TAG'"' \
        | jq '. | .info.commit = "'$GIT_COMMIT'"' \
        | jq '. | .info.date = "2017 - '$(date +'%Y')'"' \
        | jq '. | .info.branch = "'$GIT_BRANCH'"' \
        > app/config.json.new \
    && mv app/config.json.new app/config.json \
    && apk del \
        .build-deps

VOLUME [ "/data" ]

EXPOSE 5000/tcp

CMD [ "/bin/sh", "app/docker/run.sh" ]
