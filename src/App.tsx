import React from 'react';
import MatrixBackground from './components/MatrixBackground';
import Header from './components/Header';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Skills from './components/sections/Skills';
import Footer from './components/Footer';

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
        <Projects />
        <Experience />
        <Skills />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;