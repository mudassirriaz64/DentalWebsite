import React from 'react';

export const HighlightText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <span className="relative z-10 inline-block px-1 select-none">
      {/* Highlighter swoosh bar sitting below the baseline of the highlighted word */}
      <span className="absolute left-0 bottom-1 sm:bottom-1.5 w-full h-[32%] bg-heading-highlight -z-10 rounded-sm" />
      {children}
    </span>
  );
};

export default HighlightText;
