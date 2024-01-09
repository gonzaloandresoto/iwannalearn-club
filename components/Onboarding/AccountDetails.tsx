interface AccountDetailsProps {
  setUserInfo: (userInfo: any) => void;
}

export default function AccountDetails({ setUserInfo }: AccountDetailsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const [firstName, ...rest] = value.trim().split(/\s+/);
    const lastName = rest.join(' ');

    setUserInfo((prev: any) => ({
      ...prev,
      firstName: firstName || '',
      lastName: lastName,
    }));
  };

  return (
    <div className='flex grow flex-col gap-8 items-center justify-center'>
      <p className='h1 text-center font-rosario'>Help us get to know you</p>
      <div className='max-w-[720px] w-full flex flex-col gap-2'>
        <div className='flex flex-col gap-2'>
          <label
            htmlFor='full name'
            className='text-lg text-tertiary-black font-rosario'
          >
            What is your name?
          </label>
          <input
            type='text'
            name='full name'
            id='full name'
            className='bg-white border-2 border-primary-tan rounded-md p-2 text-lg font-rosario'
            placeholder='Aa'
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
