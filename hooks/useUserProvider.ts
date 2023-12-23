import { useContext } from 'react';
import UserContext from '../context/UserProvider';

const useUserContext = () => {
  const context = useContext(UserContext);
  return context;
};

export default useUserContext;
