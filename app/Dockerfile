FROM python:3-alpine

MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

WORKDIR /dnd-machine

COPY requirements.txt *.md *.py ./

RUN apk \
        --no-cache add \
        build-base \
    && pip install \
        --no-cache-dir \
        -r requirements.txt

COPY app/ ./app

VOLUME [ "/var/run/dnd-machine" ]

CMD [ "/bin/sh", "app/docker/run.sh", "--debug", "--threaded", "--host", "0.0.0.0", "--port", "8080" ]
