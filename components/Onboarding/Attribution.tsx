export default function Attribution() {
  return (
    <div className='flex grow flex-col gap-8 items-center justify-center'>
      <p className='h1 text-center font-rosario'>
        How did you discover iWannaLearn?
      </p>
      <div className='max-w-[720px] w-full flex flex-col gap-2'>
        <button className='option-button'>Google</button>
        <button className='option-button'>Instagram</button>
        <button className='option-button'>Twitter</button>
        <button className='option-button'>LinkedIn</button>
        <button className='option-button'>Word of Mouth</button>
        <button className='option-button'>Other</button>
      </div>
    </div>
  );
}
