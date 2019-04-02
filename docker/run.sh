#!/bin/env bash

set -xe

DATABASE="/var/run/dnd-machine/machine.db"
CONFIGURED="$(grep DATABASE app/config.json | grep -Po '(?<=")([^"]+)(?=",)')"
RUNARGS="--config DATABASE=$DATABASE"

if [ ! -e "$DATABASE" ]; then
    if [ -e "$CONFIGURED" ]; then
        echo "Importing existing DnD Machine database."
        mv "$CONFIGURED" "$DATABASE"
    else
        echo "Initializing DnD Machine. Login with 'admin/admin' to get started."
        ./run.py \
            $RUNARGS \
            --debug \
            --initdb
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

./run.py $RUNARGS $@
