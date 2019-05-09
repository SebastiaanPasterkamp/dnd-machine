#!/bin/env bash

set -xe

DATABASE="/var/run/dnd-machine/machine.db"
CONFIGURED="$(grep DATABASE app/config.json | sed -r 's/^.*"([^"]+)",.*/\1/')"
RUNARGS="--config DATABASE=$DATABASE"

if [ ! -e "$DATABASE" ]; then
    if [ -e "$CONFIGURED" ]; then
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

./run.py $RUNARGS $@
