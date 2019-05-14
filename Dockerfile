FROM node:8.15-alpine as node
MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

WORKDIR /dnd-machine

COPY ui ./ui

RUN cd /dnd-machine/ui \
    && npm install \
    && npm run build:production

FROM python:2-slim

WORKDIR /dnd-machine

COPY requirements.txt *.md *.py ./

RUN pip install \
    --no-cache-dir \
    -r requirements.txt

COPY app/ ./app
COPY --from=node /dnd-machine/app/static/ ./app/static/

VOLUME [ "/var/run/dnd-machine" ]

EXPOSE 5000/tcp

CMD [ "app/docker/run.sh", "--threaded", "--host", "0.0.0.0", "--port", "5000" ]
