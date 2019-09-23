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

COPY app/ ./app

VOLUME [ "/var/run/dnd-machine" ]

CMD [ "/bin/sh", "app/docker/run.sh", "--debug", "--threaded", "--host", "0.0.0.0", "--port", "8080" ]
