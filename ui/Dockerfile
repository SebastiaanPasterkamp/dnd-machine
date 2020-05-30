FROM node:14.3-slim

MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

RUN echo "export PATH=/dnd-machine/ui/node_modules/.bin:$PATH" > /etc/environment

WORKDIR /dnd-machine/ui

RUN apt-get update \
    && apt-get install -yq --no-install-recommends \
        build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && chown -R 1000:1000 /dnd-machine

USER 1000

COPY package.json \
    package-lock.json \
    ./

RUN npm install

COPY . .

CMD [ "/bin/sh", "docker/run.sh" ]
