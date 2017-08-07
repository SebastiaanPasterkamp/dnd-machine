## Setup python

```bash
sudo pip install -r requirements.txt
```

## Setup Flask

```bash
export FLASK_APP=dndmachine/app.py
export FLASK_DEBUG=true
flask initdb
```

## Running D&D machine

```bash
flask run
```

Visit [D&D Machine](http://localhost:5000)
