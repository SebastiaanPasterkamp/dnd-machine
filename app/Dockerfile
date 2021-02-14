FROM python:3.8-slim

MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

WORKDIR /dnd-machine

COPY requirements.txt *.py *.md ./

RUN apt-get update \
    && mkdir -p \
        /usr/share/man/man1/ \
    && touch \
        /usr/share/man/man1/rmid.1.gz.dpkg-tmp \
    && apt-get install -y \
        pdftk \
        build-essential \
        python3-dev \
        libffi-dev \
        libssl-dev \
        cargo \
        rustc \
    && pip install \
        -r ./requirements.txt \
    && apt-get purge -y --auto-remove \
        build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir /data

COPY app/ ./app

VOLUME [ "/data" ]

CMD [ "/bin/sh", "app/docker/run.sh", "--py-autoreload", "1" ]
