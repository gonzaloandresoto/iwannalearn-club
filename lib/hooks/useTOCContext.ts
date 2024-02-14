import { useContext } from 'react';
import TOCContext from '../../context/TOCProvider';

const useTOCContext = () => {
  const context = useContext(TOCContext);
  return context;
};

export default useTOCContext;
