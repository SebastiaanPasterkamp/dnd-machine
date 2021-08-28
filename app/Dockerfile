FROM python:3.9-slim-buster

MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

WORKDIR /dnd-machine

COPY requirements.txt *.py *.md ./

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
        libffi-dev \
        libssl-dev \
        cargo \
    && CRYPTOGRAPHY_DONT_BUILD_RUST=1 pip install \
        --prefer-binary \
        -r ./requirements.txt \
    && apt-get purge -y \
        --auto-remove \
        build-essential \
        python3-dev \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir /data

COPY app/ ./app

VOLUME [ "/data" ]

CMD [ "/bin/sh", "app/docker/run.sh", "--py-autoreload", "1" ]
