FROM python:2-alpine

MAINTAINER Sebastiaan Pasterkamp "dungeons.dragons.machine@gmail.com"

WORKDIR /dnd-machine

COPY requirements.txt *.md *.py *.db ./

RUN apk \
        --no-cache add \
        build-base \
    && pip install \
        --no-cache-dir \
        -r requirements.txt

COPY app ./app
COPY docker ./docker

VOLUME [ "/var/run/dnd-machine" ]

ENTRYPOINT [ "sh" ]

CMD [ "./docker/run.sh", "--threaded", "--host", "0.0.0.0", "--port", "8080" ]
