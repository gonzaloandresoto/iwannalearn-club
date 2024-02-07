import { FallingLines } from 'react-loader-spinner';

const LoadingState = () => {
  return (
    <div className='flex grow items-center justify-center bg-tertiary-tan'>
      <FallingLines
        color='#0C54A8'
        width='100'
        visible={true}
      />
    </div>
  );
};

export default LoadingState;
