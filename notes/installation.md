# Frontend
In your root directory:
```sh
npm install
npm start
```

# Backend
In your backend root directory, create venv for this project:
```sh
source ./venv/bin/activate
```
(Optional) If there are new dependencies, run this command:

```sh
pip3 install -r requirements.txt
```

Setup environment variables:
```sh
export FLASK_APP=.
export FLASK_DEBUG=1
```

Run the project
```sh
flask run
```