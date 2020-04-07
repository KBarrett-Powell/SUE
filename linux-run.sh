#!/bin/sh
fuser -k 8000/tcp
fuser -k 8080/tcp
gnome-terminal -- bash -c "cd Rasa && source ./venv/bin/activate && rasa run actions" &&
gnome-terminal -- bash -c "cd Rasa && source ./venv/bin/activate && python -m rasa run --m ./models --endpoints endpoints.yml --port 5052 -vv --enable-api " &&
npm run dev-start