import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [quote, setQuote] = useState({});
  const [backgroundColorState, setBackgroundColorState] = useState(getRandomColor());
  const [nextColor, setNextColor] = useState(getRandomColor());
  const [autoMode, setAutoMode] = useState(false);

  useEffect(() => {
    if (autoMode) {
      const intervalId = setInterval(() => {
        fetchQuote();
      }, 3000);
      return () => {
        clearInterval(intervalId);
      };
    } else {
      fetchQuote();
    }
  }, [autoMode]);

  const fetchQuote = async () => {
    try {
      const response = await axios.get('http://safetybelt.pythonanywhere.com/quotes/random');
      setQuote(response.data);
      setBackgroundColorState(nextColor);
      setNextColor(getRandomColor());
    } catch (error) {
      console.log(error);
    }
  };

  function getRandomColor() {
    const colors = ['yellow', 'blue', 'gray', 'green', 'purple', 'orange', 'black', 'brown', 'red', 'teal'];
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * colors.length);
    } while (newIndex === getRandomColor.previousIndex);
    getRandomColor.previousIndex = newIndex;
    return colors[newIndex];
  }

  const quoteContainerStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: "Georgia, 'Times New Roman', Times, serif",
    backgroundImage: `linear-gradient(to bottom right, ${backgroundColorState}, ${nextColor})`,
    backgroundSize: '200% 200%',
    transition: 'background-image 1s',
  };

  return (
    <div className='quote-container' style={quoteContainerStyle}>
      <div className="quote-box">
        <p className="quote-text">{quote.quote}</p>
        <p className="author">{quote.author}</p>
      </div>

      {!autoMode ? (
        <button className="generate-button" onClick={fetchQuote}>
          Generate Quote
        </button>
      ) : (
        ""
      )}

      <button className="autoMode-button" onClick={() => setAutoMode((prevState) => !prevState)}>
        {autoMode ? "Manual Mode" : "Set Auto Mode"}
      </button>
    </div>
  );
}

export default App;
