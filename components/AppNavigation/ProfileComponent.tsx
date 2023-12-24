import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

const ProfileComponent = async () => {
  const { userId } = auth();
  const userDetails = await getUserById(userId || '');

  return (
    <Link href='/profile'>
      <div className='w-[40px] h-[40px] flex items-center justify-center bg-primary-grey rounded-full overflow-hidden'>
        {userDetails.photo ? (
          <Image
            src={userDetails.photo}
            alt={`${userDetails.name} profile`}
            width={40}
            height={40}
          />
        ) : (
          <p className='text-white'>{userDetails.firstName.charAt(0)}</p>
        )}
      </div>
    </Link>
  );
};

export default ProfileComponent;
