
import React, { useState, useEffect } from 'react';
import './styles.css';

const quotes = [
  {
    text: "Code is like humor. If you have to explain it, it's bad.",
    author: "Cory House"
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  },
  {
    text: "Experience is the name everyone gives to their mistakes.",
    author: "Oscar Wilde"
  },
  {
    text: "In order to be irreplaceable, one must always be different.",
    author: "Coco Chanel"
  },
  {
    text: "Java is to JavaScript what car is to Carpet.",
    author: "Chris Heilmann"
  },
  {
    text: "The best way to get a project done faster is to start sooner.",
    author: "Jim Highsmith"
  },
  {
    text: "Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away.",
    author: "Antoine de Saint-Exupery"
  }
];

export default function QuoteCard() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(null);

  useEffect(() => {
    // Show quote card only on first launch
    const hasSeenQuote = localStorage.getItem('hasSeenQuote');
    if (!hasSeenQuote) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setCurrentQuote(randomQuote);
      setIsVisible(true);
      localStorage.setItem('hasSeenQuote', 'true');
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !currentQuote) return null;

  return (
    <div className="quote-card">
      <div className="quote-header">
        <h3 className="quote-title">💡 Fun Quote</h3>
        <button className="quote-close" onClick={handleClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div className="quote-content">
        <p className="quote-text">"{currentQuote.text}"</p>
        <p className="quote-author">— {currentQuote.author}</p>
      </div>
    </div>
  );
}
