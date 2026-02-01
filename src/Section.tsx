import React, { useEffect, useRef } from 'react';
import { useFullPage } from './FullPageContext';

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export function Section({ children, className = '' }: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useFullPage();

  useEffect(() => {
    if (sectionRef.current) {
      return registerSection(sectionRef.current);
    }
  }, [registerSection]);

  return (
    <div ref={sectionRef} className={`section ${className}`}>
      {children}
    </div>
  );
}
