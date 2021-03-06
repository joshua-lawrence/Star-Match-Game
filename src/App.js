import React, { useState, useEffect } from 'react';
import './App.css';

const StarsDisplay = props => (
  <>
    {utils.range(1, props.count).map((starID) =>
      <div className="star" key={starID} />
    )}
  </>
);

const StarNumber = props => (
  <button 
  className="number" 
  onClick={() => props.onClick(props.number, props.status)}
  style={{ backgroundColor: colors[props.status] }}
  >{props.number}</button>
);

const PlayAgain = props => (
  <div className="game-done">
    <div 
      className="message"
      style={{ color: props.gameStatus === 'lost' ? 'red' : 'green' }}
    >
      {props.gameStatus === 'lost' ? 'Game Over' : 'You Won!'}
    </div>
    <button onClick={props.onClick}>Play Again</button>
  </div>
);

const Game = (props) => {
  //State hooks: basically function as a setter/getter. Equivalent to creating
  //a constructor and passing in this.state = on a class component.
  const [stars, setStars] = useState(utils.random(1, 9));

  const [availableNums, setAvailableNums] = useState(utils.range(1,9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);

  //useEffect runs every time the component renders, used for creating side-effects. 
  //Works like a combined componentDidMount, componentDidUpdate and componentWillUnmount
  //The return statement runs after the render, allowing for cleanup (componentWillUnmount.)
  useEffect(() => {
    if (secondsLeft > 0) {
      //setTimeout is a built in js function that waits to execute a function.
      const timerId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  });

  const candidatesAreWrong = utils.sum(candidateNums) > stars;

  const gameStatus = availableNums.length === 0 ? 'won' :
  secondsLeft === 0 ? 'lost' : 'active'

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'used';
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong': 'candidate';
    }
    return 'available';
  };

  const onNumberClick = (number, currentStatus) => {
    if (currentStatus === 'used') {
      return;
    }
    
    const newCandidateNums = currentStatus === 'available' 
    ? candidateNums.concat(number)
    : candidateNums.filter(cn => cn !== number);
    if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    }
    else {
      //filter creates a new array with all elements that pass a condition
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
      console.log(availableNums);
    }

  }

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active' ? 
          (
            <PlayAgain onClick={props.startNewGame} gameStatus={gameStatus}/>
          ) : 
          (
            <StarsDisplay count={stars} />
          )} 
        </div>
        <div className="right">
          {/* Map performs a function on each value in an array */}
          {utils.range(1, 9).map((number) =>
            <StarNumber 
              key={number}
              status={numberStatus(number)}
              number={number} 
              onClick={onNumberClick}
            />
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

const StarMatch = () => {
  const [gameId, setGameId] = useState(1);
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>;
}

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

function App() {
  return (
    <div className="App">
      <StarMatch />
    </div>
  );
}

export default App;
