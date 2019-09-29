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
        pcre \
        pcre-dev \
        openssl-dev \
        libffi-dev \
    && pip install \
        --no-cache-dir \
        -r requirements.txt \
    && apk del \
        .build-deps

COPY app/ ./app

VOLUME [ "/var/run/dnd-machine" ]

CMD [ "uwsgi", "--socket", "0.0.0.0:8080", \
               "--master", \
               "--plugins", "python3", \
               "--callable", "app", \
               "--protocol", "uwsgi", \
               "--wsgi", "run:app" ]
