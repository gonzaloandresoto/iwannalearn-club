export default function WhyLearn() {
  return (
    <div className='flex grow flex-col gap-8 items-center justify-center'>
      <p className='h1 font-rosario text-center'>
        What are you most excited about?
      </p>
      <div className='max-w-[720px] w-full flex flex-col gap-2'>
        <button className='option-button'>Learning about new topics</button>
        <button className='option-button'>
          Using AI to supplement my education
        </button>
        <button className='option-button'>
          Staying productive with my free time
        </button>
      </div>
    </div>
  );
}
