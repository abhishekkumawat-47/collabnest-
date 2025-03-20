"use client"

import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  center?: boolean;
  text?: string;
}

export const Loader = ({ 
  size = 'medium', 
  center = false,
  text = 'Loading...'
}: LoaderProps) => {
  // Size mapping
  const sizeMap = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4'
  };

  const containerClasses = center ? 'flex flex-col items-center justify-center' : '';
  
  return (
    <div className={containerClasses}>
      <div className={`animate-spin rounded-full border-t-transparent border-primary ${sizeMap[size]}`} />
      {text && <p className="text-sm text-muted-foreground mt-2">{text}</p>}
    </div>
  );
};