import { useContext } from 'react';
import { AuthContext } from '../src/services/AuthContext';

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
