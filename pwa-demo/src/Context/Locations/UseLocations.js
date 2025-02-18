import { useContext } from 'react';
import LocationsContext from './LocationsContext';

const UseLocations = () => {
  const context = useContext(LocationsContext);
  if (!context) {
    throw new Error('useLocations must be used within a LocationsProvider');
  }
  return context;
};

export default UseLocations;