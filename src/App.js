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
      changeBackground();
    } catch (error) {
      console.log(error);
    }
  };

  function getRandomColor(excludeColor) {
    const colors = ['yellow', 'blue', 'gray', 'green', 'purple', 'orange', 'black', 'brown', 'red', 'teal'];
  
    const availableColors = excludeColor
      ? colors.filter((color) => color !== excludeColor)
      : colors;
  
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  }
  
  
  const quoteContainerStyle = () => {
    return {
      'position': 'relative',
      'display': 'flex',
      'flex-direction': 'column',
      'align-items': 'center',
      'justify-content': 'center',
      'height': '100vh',
      'font-family': "Georgia, 'Times New Roman', Times, serif",
      'background-size': '200% 200%', 
      'background-image': `linear-gradient(to bottom right, ${backgroundColorState} 50%, ${nextColor} 50%)`,
      'transition': 'background-position 1s'
    };
  };

  function changeBackground() {
    const quoteContainer = document.querySelector(".quote-container");
    quoteContainer.classList.toggle("wipe");
    
    setBackgroundColorState(nextColor);
  
    setNextColor((prevBackgroundColor) => {
      let newColor;
      do {
        newColor = getRandomColor(prevBackgroundColor);
      } while (newColor === prevBackgroundColor);
      return newColor;
    });
  }
  
  console.log("first color" + backgroundColorState);
  console.log("next color" + nextColor)
  return (
    <div className='quote-container' style={quoteContainerStyle()}>
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
