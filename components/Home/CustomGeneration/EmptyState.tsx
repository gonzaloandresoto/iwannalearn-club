import { FallingLines } from 'react-loader-spinner';

function EmptyState() {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <FallingLines
        color='#0C54A8'
        width='72'
        visible={true}
      />
    </div>
  );
}

export default EmptyState;
