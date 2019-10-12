#!/bin/env sh

set -xe

DATABASE="/data/machine.db"
CONFIGURED="$(grep DATABASE app/config.json | sed -r 's/^.*"([^"]+)",.*/\1/')"
RUNARGS="--config DATABASE=$DATABASE"

if [ ! -e "$DATABASE" ]; then
    if [ -s "$CONFIGURED" ]; then
        echo "Importing existing DnD Machine database."
        cp -v "$CONFIGURED" "$DATABASE"
    else
        echo "Initializing DnD Machine. Login with 'admin/admin' to get started."
        ./run.py \
            --debug \
            --initdb
        cp -v "$CONFIGURED" "$DATABASE"
    fi
fi

echo "Upgrading DnD Machine..."
./run.py \
    $RUNARGS \
    --debug \
    --updatedb
./run.py \
    $RUNARGS \
    --debug \
    --migrate
echo "Upgrade completed."

uwsgi \
    --socket 0.0.0.0:5000 \
    --master \
    --plugins python3 \
    --callable app \
    --protocol uwsgi \
    --pyargv "$RUNARGS $@" \
    --wsgi run:app
