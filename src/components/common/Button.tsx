import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  style?: 'primary' | 'secondary';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  style = 'primary',
  className = '',
}) => {
  const baseStyles = 'px-6 py-3 rounded-md font-inter font-medium transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-white/50';
  
  const styles = {
    primary: 'bg-white text-[#1A1A1A] border-white hover:bg-transparent hover:text-white hover:scale-105',
    secondary: 'bg-transparent text-white border-white hover:bg-white hover:text-[#1A1A1A] hover:scale-105',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${styles[style]} ${className}`}
      aria-label={text}
    >
      {text}
    </button>
  );
};

export default Button;