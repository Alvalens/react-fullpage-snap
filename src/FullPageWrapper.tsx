import React from 'react';

export interface FullPageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function FullPageWrapper({ children, className = '' }: FullPageWrapperProps) {
  return (
    <div className={`fullpage-wrapper ${className}`}>
      {children}
    </div>
  );
}
