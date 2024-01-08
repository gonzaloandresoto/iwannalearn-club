import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className='main-page justify-center'>
      <SignUp afterSignUpUrl={'/onboarding'} />
    </div>
  );
}
