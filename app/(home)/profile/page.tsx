import { SignOutButton } from '@clerk/nextjs';

export default function Profile() {
  return (
    <div>
      <p>
        <SignOutButton>Signout</SignOutButton>
      </p>
    </div>
  );
}
