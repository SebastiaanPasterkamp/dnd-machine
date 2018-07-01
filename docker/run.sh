#!/bin/env bash

set -xe

DATABASE="/var/run/dnd-machine/machine.db"
CONFIGURED="$(grep DATABASE app/config.json | grep -Po '(?<=")([^"]+)(?=",)')"
RUNARGS="--debug --config DATABASE=$DATABASE"

if [ ! -e "$DATABASE" ]; then
    if [ -e "$CONFIGURED" ]; then
        echo "Importing existing DnD Machine database."
        mv "$CONFIGURED" "$DATABASE"
    else
        echo "Initializing DnD Machine. Login with 'admin/admin' to get started."
        ./run.py \
            --debug \
            --initdb
    fi
fi

echo "Upgrading DnD Machine..."
./run.py \
    $RUNARGS \
    --updatedb
./run.py \
    $RUNARGS \
    --migrate
echo "Upgrade completed."

./run.py $RUNARGS $@
