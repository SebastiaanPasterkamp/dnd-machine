# D&D Machine

## Setup python environment

```bash
virtualenv <path/to/python-env>/dndmachine
. <path/to/python-env>/dndmachine/bin/activate
pip install -r requirements.txt
```

## Initial setup

```bash
export FLASK_APP=app/app.py
export FLASK_DEBUG=true
flask initdb
```

## Building

```bash
npm install
npm run build
```

## Testing

```bash
python tests/run_tests.py
npm test
```

## Running D&D machine

```bash
export FLASK_APP=app/app.py
export FLASK_DEBUG=true
flask run
```

Visit [D&D Machine](http://localhost:5000)
