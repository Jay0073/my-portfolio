import React from 'react';
import Header from './components/Header';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Skills from './components/sections/Skills';
import Footer from './components/Footer';
import QuoteCard from './components/QuoteCard';
import Education from './components/sections/Education';

function App() {
  return (
    <div className="relative min-h-screen text-white font-inter">
      <div className="matrix-bg">
        <div className="matrix-overlay"></div>
      </div>
      <Header />
      
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
      </main>
      <QuoteCard />
      <Footer />
    </div>
  );
}

export default App;