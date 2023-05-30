// ToDo: Lift didPlayerWin and isGameOver var to state (?), keep track of roundCount and score, stop the page from refreshing after reset

import React from "react";
import { getRandomWord } from "./utils.js";
import "./App.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const images = importAll(
  require.context("./assets/", false, /\.(png|jpe?g|svg)$/)
);

// Helper function to import all images
function importAll(r) {
  let images = {};
  r.keys().forEach((key) => {
    images[key] = r(key);
  });
  return images;
}

class App extends React.Component {
  constructor(props) {
    // Always call super with props in constructor to initialise parent class
    super(props);
    this.state = {
      // currWord is the current secret word for this round. Update this with this.setState after each round.
      currWord: getRandomWord(),
      // guessedLetters stores all letters a user has guessed so far
      guessedLetters: [],
      // num guesses left state
      guessCountLeft: 10,
      // form input state
      userGuess: "",
      round: 1,
      score: 0,
    };
  }

  generateWordDisplay = () => {
    const wordDisplay = [];
    const { currWord, guessedLetters } = this.state;
    // for...of is a string and array iterator that does not use index
    for (const letter of currWord) {
      if (guessedLetters.includes(letter)) {
        wordDisplay.push(letter);
      } else {
        wordDisplay.push("_");
      }
    }
    return wordDisplay.toString();
  };

  // form callback functions handleChange and handleSubmit
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    
    const { currWord, userGuess, guessedLetters } = this.state;

    if (guessedLetters.includes(userGuess)) {
      alert(`You have guessed '${userGuess}' before.`);
      this.setState({
        userGuess: "",
      });
      return;
    }

    this.setState((state) => ({
      guessedLetters: [...state.guessedLetters, userGuess],
      userGuess: "",
      guessCountLeft: currWord.includes(userGuess)
        ? state.guessCountLeft
        : state.guessCountLeft - 1,
    }));
  };

  declareWin = () => {
    const { currWord, guessedLetters } = this.state;
    for (const letter of currWord) {
      if (!guessedLetters.includes(letter)) {
        return false;
      }
    }
    return true;
  };

  resetGame = () => {
    this.setState({
      currWord: getRandomWord(),
      guessedLetters: [],
      guessCountLeft: 10,
    });
  };

  render() {
    const {
      currWord,
      guessedLetters,
      guessCountLeft,
      userGuess,
      round,
      score,
    } = this.state;
    const didPlayerWin = this.declareWin();
    const isGameOver = guessCountLeft === 0;
    const logo = "🚀";

    return (
      <div className="App">
        <header className="App-header">
          <Container fluid>
            <h1>Guess The Word 🚀</h1>
            <br />
            <Row>
              <Col>
                <h3>Secret Word</h3>
                {didPlayerWin || isGameOver
                  ? `${currWord}`
                  : this.generateWordDisplay()}
              </Col>
              <Col>
                <h3>Guessed Letters</h3>
                {guessedLetters.length > 0 ? guessedLetters.toString() : "-"}
              </Col>
            </Row>
            <h3>Input</h3>
            {/* form element */}
            <form
              onSubmit={
                didPlayerWin || isGameOver ? this.resetGame : this.handleSubmit
              }
            >
              <input
                type="text"
                name="userGuess"
                value={userGuess}
                maxLength="1"
                placeholder="Guess a letter"
                onChange={this.handleChange}
                required={!didPlayerWin && !isGameOver}
              />
              <br />
              <br />
              <button>
                {didPlayerWin || isGameOver ? "Another round" : "Submit"}
              </button>
            </form>
            <br />
            <h3>Round {round}</h3>
            <h3>
              Number of guesses left: {guessCountLeft}{" "}
              {logo.repeat(guessCountLeft)}
            </h3>
            <img src={images[`./${10 - guessCountLeft}.jpg`]} alt="" />
            <h3>
              {isGameOver && "Out of guesses! You lost."}
              {didPlayerWin && "Correct guess! You won!"}
            </h3>
          </Container>
        </header>
      </div>
    );
  }
}

export default App;
