import { SignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function Page() {
  return (
    <SignIn
      redirectUrl={'/generate'}
      afterSignInUrl={'/generate'}
    />
  );
}
