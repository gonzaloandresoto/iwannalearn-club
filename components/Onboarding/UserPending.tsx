import { FallingLines } from 'react-loader-spinner';

export default function UserPending() {
  return (
    <div className='main-page justify-center'>
      <FallingLines
        color='#0C54A8'
        width='100'
        visible={true}
      />
      <div className='flex flex-col gap-2'>
        <p className='text-center md:text-4xl text-2xl text-secondary-black font-sourceSerif'>
          iwanna<span className='font-bold italic'>learn</span>
        </p>
        <p className='text-center text-base text-secondary-black font-rosario font-medium'>{`We're setting your account up. You'll be redirected shortly.`}</p>
      </div>
    </div>
  );
}
