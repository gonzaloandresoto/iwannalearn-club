import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className='main-page justify-center'>
      <SignIn />
    </div>
  );
}
