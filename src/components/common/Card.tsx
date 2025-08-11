import React from 'react';
import Button from './Button';

interface CardProps {
  title: string;
  description: string;
  tags?: string[];
  image?: string;
  actions?: {
    text: string;
    onClick: () => void;
    style?: 'primary' | 'secondary';
  }[];
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  tags,
  image,
  actions,
  className = '',
}) => {
  return (
    <div
      className={`bg-[#1A1A1A] rounded-lg p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${className}`}
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-lg mb-4"
          loading="lazy"
        />
      )}
      
      <h3 className="font-poppins font-semibold text-xl text-white mb-3">
        {title}
      </h3>
      
      <p className="text-[#BBBBBB] font-inter leading-relaxed mb-4">
        {description}
      </p>
      
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-[#BBBBBB]/10 text-[#BBBBBB] rounded-full border border-[#BBBBBB]/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {actions && actions.length > 0 && (
        <div className="flex gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              text={action.text}
              onClick={action.onClick}
              style={action.style || 'secondary'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Card;