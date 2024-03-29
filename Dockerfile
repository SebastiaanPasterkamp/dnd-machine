FROM node:8.17-alpine as node
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

FROM python:3.9-slim-buster

MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

ARG GIT_TAG
ARG GIT_COMMIT
ARG GIT_BRANCH

WORKDIR /dnd-machine

COPY requirements.txt *.md *.py ./

RUN apt-get update \
    && mkdir -p \
        /usr/share/man/man1/ \
    && touch \
        /usr/share/man/man1/rmid.1.gz.dpkg-tmp \
    && echo "[global]\nextra-index-url=https://www.piwheels.org/simple" \
        >> /etc/pip.conf \
    && pip install --upgrade pip \
    && apt-get install -y \
        pdftk \
        build-essential \
        python3-dev \
        libssl-dev \
        libffi-dev \
        cargo \
    && CRYPTOGRAPHY_DONT_BUILD_RUST=1 pip install --prefer-binary -r ./requirements.txt \
    && apt-get purge -y --auto-remove \
        build-essential \
        python3-dev \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir /data

COPY app/ /dnd-machine/app
COPY --from=node /dnd-machine/app/static/ /dnd-machine/app/static/

RUN apt-get update \
    && apt-get install -y \
        jq \
    && cat app/config.json \
        | jq '. | .info.version = "'$GIT_TAG'"' \
        | jq '. | .info.commit = "'$GIT_COMMIT'"' \
        | jq '. | .info.date = "2017 - '$(date +'%Y')'"' \
        | jq '. | .info.branch = "'$GIT_BRANCH'"' \
        > app/config.json.new \
    && apt-get purge -y --auto-remove \
        jq \
    && rm -rf /var/lib/apt/lists/* \
    && mv app/config.json.new app/config.json

VOLUME [ "/data" ]

EXPOSE 5000/tcp

CMD [ "/bin/sh", "app/docker/run.sh" ]
