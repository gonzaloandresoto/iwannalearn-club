export default function CourseGridSkeleton() {
  return (
    <div className='max-w-[1024px] h-max grid lg:grid-cols-2 grid-cols-1 gap-10 '>
      {[...Array(7)].map((_, i) => (
        <div
          className='md:w-[480px] w-full'
          key={i}
        >
          <div className='h-[32px] w-[144px] bg-secondary-tan'></div>
          <div className='w-full h-[240px] bg-secondary-tan rounded-r-md rounded-bl-md'>
            <div className='h-[24px] w-[88px] rounded-sm bg-secondary-tan'></div>
          </div>
        </div>
      ))}
    </div>
  );
}
