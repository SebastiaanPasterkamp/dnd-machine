# D&D Machine

## Setup python environment

```bash
virtualenv <path/to/python-env>/dndmachine
. <path/to/python-env>/dndmachine/bin/activate
pip install -r requirements.txt
```

## Initial setup

```bash
export FLASK_APP=dndmachine/app.py
export FLASK_DEBUG=true
flask initdb
```

## Running D&D machine

```bash
export FLASK_APP=dndmachine/app.py
export FLASK_DEBUG=true
flask run
```

Visit [D&D Machine](http://localhost:5000)
