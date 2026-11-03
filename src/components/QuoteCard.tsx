
import React, { useState, useEffect } from 'react';
import { useContent } from '../lib/contentContext';
import './styles.css';

interface Quote {
  text: string;
  author: string;
}

export default function QuoteCard() {
  const { content } = useContent();
  const [isVisible, setIsVisible] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // Show quote card only on first launch
    const hasSeenQuote = localStorage.getItem('hasSeenQuote');
    if (!hasSeenQuote && content.quotes.length > 0) {
      const randomQuote = content.quotes[Math.floor(Math.random() * content.quotes.length)];
      setCurrentQuote(randomQuote);
      setIsVisible(true);
      localStorage.setItem('hasSeenQuote', 'true');
    }
  }, [content.quotes]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !currentQuote) return null;

  return (
    <div className="quote-card">
      <div className="quote-header">
        <h3 className="quote-title">💡 Fun Quote</h3>
        <button className="quote-close" aria-label="Close quote card" onClick={handleClose}>
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
