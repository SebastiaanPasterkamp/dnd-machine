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
            $RUNARGS \
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

echo "Building UI"
if [ ! -L /dnd-machine/node_modules ]; then
    rm -rf /dnd-machine/node_modules
    ln -s /node_modules /dnd-machine/node_modules
fi
npm install
npm build

./run.py $RUNARGS $@
