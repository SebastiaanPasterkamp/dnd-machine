# D&D Machine

## Setup python environment

```bash
virtualenv <path/to/python-env>/dndmachine
. <path/to/python-env>/dndmachine/bin/activate
pip install -r requirements.txt
```

### Initial setup

```bash
export FLASK_APP=app/app.py
./run.py --debug --initdb
```

### Building

```bash
( cd ui && npm install )
( cd ui && npm run build )
```

### Testing

```bash
python tests/run_tests.py
( cd ui && npm run test )
```

## Running in a Development setup

### NPM

```bash
( cd ui && npm run dev )
```

### Server
```bash
export FLASK_APP=app/app.py
./run.py --debug
```

## Upgrading

```bash
export FLASK_APP=app/app.py
./run.py --debug --updatedb
./run.py --debug --migrate
```

## Running D&D machine

```bash
export FLASK_APP=app/app.py
./run.py --threaded
```

Visit [D&D Machine](http://localhost:5000)

# Docker

The docker image keeps the flask database in a volume, so it's persistent
between restarts. The database will be upgraded during start-up should the
container start with a newer version.

## Running from Docker

### Building the image

```bash
docker build \
    --tag dnd-machine:latest .
```

### Running the image

```bash
# Replace existing images
docker stop dndmachine
docker rm dndmachine
# Launch the new image
docker run \
    --detach \
    --publish 5000:5000 \
    --name dndmachine \
    --restart always \
    dnd-machine:latest
```

## Developing in Docker

### Building the images

```bash
docker-compose build
```

### Running the images

```bash
docker-compose up
```

### Taking down the images

```bash
docker-compose down
```
