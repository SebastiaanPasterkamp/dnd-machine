FROM ubuntu:latest
MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

WORKDIR /dnd-machine

COPY requirements.txt /dnd-machine/

RUN apt-get update \
    && apt-get install \
        -y \
        --no-install-recommends \
        python-pip python-dev python-setuptools build-essential npm \
    && pip install -r requirements.txt \
    && apt-get purge \
        -y \
        python-pip python-dev python-setuptools build-essential \
    && apt-get clean all \
    && apt-get autoclean \
    && apt-get autoremove \
        -y  \
        --purge \
    && rm -rf \
        /var/lib/apt/lists/* \
        /var/lib/{apt,dpkg,cache,log}/ \
        /tmp/* \
        /var/tmp/*

COPY . /dnd-machine

RUN npm install \
    && npm run build

VOLUME [ "/var/run/dnd-machine" ]

EXPOSE 5000
ENTRYPOINT [ "bash" ]
CMD [ "docker/run.sh", "--threaded", "--host", "0.0.0.0", "--port", "5000" ]
