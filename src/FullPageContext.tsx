import React, { createContext, useContext } from 'react';
import type { FullPageContextValue } from './types';

const FullPageContext = createContext<FullPageContextValue | null>(null);

export function useFullPage(): FullPageContextValue {
  const context = useContext(FullPageContext);

  if (!context) {
    throw new Error('useFullPage must be used within FullPageProvider');
  }

  return context;
}

export default FullPageContext;
