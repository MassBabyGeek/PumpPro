/**
 * useOffline Hook
 * Access offline context
 */

import {useContext} from 'react';
import {OfflineContext} from '../contexts/OfflineContext';

export const useOffline = () => {
  const context = useContext(OfflineContext);

  if (context === undefined) {
    throw new Error('useOffline must be used within OfflineProvider');
  }

  return context;
};

export default useOffline;
