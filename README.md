# Sequence Multiplayer Board game

## Game Rules:

1. ### Objective:
    Be the first player or team to complete a sequence of five chips in a row, either horizontally, vertically, or diagonally.
2. ### Setup
    Each player or team selects a set of colored chips. The game board is a 10x10 grid representing a deck of playing cards (excluding Jacks). Two wild card spaces are also present on the board.
3. ### Playing Cards:
    On your turn, play a card from your hand and place a chip on the corresponding card's space on the game board.
4. ### Creating a Sequence:
    Form a sequence of five of your chips in a row, either horizontally, vertically, or diagonally.
5. ### Special Cards:
    Some cards have special abilities. Two-eyed Jacks can remove an opponent's chip, while one-eyed Jacks act as wild cards, allowing you to place a chip on any open space on the board.
6. ### Winning:
    Once you've formed a sequence of five chips, announce it. The game continues until a player or team completes two sequences to win, or until a predetermined number of rounds are played.

## Installation Requirements:
```
cd sequence-backend
pip install django==3.1
pip install channels==3.0
pip install channels_redis==3.2
```
```
cd sequence-frontend
npm install
```

## Setup:
Start the frontend server
```
cd sequence-frontend
npm start
```

To start the backend server without TLS (http)
```
python manage.py runserver
```

To start the backend server with TLS (https)
```
python manage.py runserver_plus --cert-file cert.pem --key-file key.pem
```

Hit http://localhost:3000 in your browser and enjoy playing the game