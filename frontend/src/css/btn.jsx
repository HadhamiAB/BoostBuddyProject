import React from 'react';

function AnimatedButton({ children, className, onClick }) {
  const chars = children.split('');

  return (
    <button className={className} onClick={onClick}>
      <div>
        {chars.map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </div>
    </button>
  );
}

export default AnimatedButton;
