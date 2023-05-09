/** @jsxImportSource react **/
import * as React from 'react';
import "./CardComponent.css";
import {ReactComponent as SpadeIcon} from "../svg/spade.svg";
import {ReactComponent as HeartIcon} from "../svg/hearts.svg";
import {ReactComponent as DiamondIcon} from "../svg/diamond.svg";
import {ReactComponent as ClubsIcon} from "../svg/clubs.svg";

interface CardProps {
  id: number;
  value: string;
  row: number;
  col: number;
  players: any;
  onCardClick: (row: number, col: number) => void;
}

const Card: React.FC<CardProps> = ({ id, value, row, col, players, onCardClick }) => {

    // Function to render card symbol based on value
    const renderSymbol = (symbol: string) => {
        switch (symbol) {
          case "H":
            return <HeartIcon />;
          case "S":
            return <SpadeIcon />;
          case "C":
            return <ClubsIcon />;
          case "D":
            return <DiamondIcon />;
          default:
            return null;
        }
      };

    let playerIndex: number | string;
    const hasOccupied = (row: number, col: number): boolean =>  {
        let isOccupied: boolean = false;
        if (onCardClick !== undefined) {
            if (players) {
                players.forEach((player: any) => {
                    if(player['playerBox'][row][col] === 1) {
                        isOccupied = true
                        if ((row === 0 && col === 0) || (row === 0 && col === 9) || (row === 9 && col === 0) || (row === 9 && col === 9)) playerIndex = 'X'
                        else playerIndex = player['playerOrder']
                    }
                  });
            }
        } else {
            onCardClick = () => {
                return
            }
        }
        return isOccupied
     }

    let isOccupied = hasOccupied(row, col)

    // Extract card value and symbol from input value prop
    const cardValue = value.slice(0, -1);
    const cardSymbol = value.slice(-1);
    return (
        <div className={`card ${isOccupied ? "occupied" : ""}`}
            onClick={() => {
            onCardClick(row, col) 
            }}
        >
            {!isOccupied && (<div className="card-value">{cardValue}</div>)}
            {!isOccupied && <div className="card-symbol">{renderSymbol(cardSymbol)}</div>}
            {isOccupied && <div className="coin">{playerIndex}</div>}
        </div>
    );
};

interface BoardProps {
    players?: any;
    cards: string[][];
    onPlaceCoin?: (row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = ({ players, cards, onPlaceCoin }) => {

  return (
    <div className="board">
      {cards.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((card, colIndex) => (
            <Card
              key={colIndex}
              id={colIndex}
              value={card}
              row={rowIndex}
              col={colIndex}
              players={players}
              onCardClick={onPlaceCoin}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

interface SequenceBoardProps {
    players: any
    currentPlayer: string
    handlePlaceCoin: (row: number, col: number) => void
  }

const SequenceBoard: React.FC<SequenceBoardProps> = ({players, currentPlayer, handlePlaceCoin}) => {

    const board = [
        ["XX", "6D", "7D", "8D", "9D", "10D", "QD", "KD", "AD", "XX"],
        ["5D", "3H", "2H", "2S", "3S", "4S", "5S", "6S", "7S", "AC"],
        ["4D", "4H", "KD", "AD", "AC", "KC", "QC", "10C", "8S", "KC"],
        ["3D", "5H", "QD", "QH", "10H", "9H", "8H", "9C", "9S", "QC"],
        ["2D", "6H", "10D", "KH", "3H", "2H", "7H", "8C", "10S", "10C"],
        ["AS", "7H", "9D", "AH", "4H", "5H", "6H", "7C", "QS", "9C"],
        ["KS", "8H", "8D", "2C", "3C", "4C", "5C", "6C", "KS", "8C"],
        ["QS", "9H", "7D", "6D", "6D", "4D", "QD", "2D", "AS", "7C"],
        ["10S", "10H", "QH", "KH", "AH", "2C", "3C", "4C", "5C", "6C"],
        ["XX", "9S", "8S", "7S", "6S", "5S", "4S", "3S", "2S", "XX"],
    ]

    let currentPlayerCards: any = [];
    let playerName: string = '';
    players.forEach((player: any) => {
        if(player['playerName'] === currentPlayer) {
            playerName = player['playerName'];
            currentPlayerCards.push(player['playerCards']);
            return;
        }
    })

  return (
    <div className='sequence'>
        <div>
            <h1>Sequence Game Board</h1>
            <Board players={players} cards={board} onPlaceCoin={handlePlaceCoin} />
        </div>
        <div className='player-cards'>
            <h1>{playerName}'s cards</h1>
            <Board players={players} cards={currentPlayerCards} />
        </div>
    </div>
  );
};

export default SequenceBoard;