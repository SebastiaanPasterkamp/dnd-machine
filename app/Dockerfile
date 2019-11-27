FROM python:3.6-alpine3.8

MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

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

COPY app/ ./app

VOLUME [ "/data" ]

CMD [ "/bin/sh", "app/docker/run.sh", "--py-autoreload", "1" ]
