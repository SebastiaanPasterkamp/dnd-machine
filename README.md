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
npm install
npm run build
```

### Testing

```bash
python tests/run_tests.py
npm run test
```

## Running in a Development setup

### NPM

```bash
npm run dev
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
