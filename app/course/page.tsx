import CourseCover from '@/components/CourseComponents/CourseCover';
import NavigationBar from '@/components/CourseNavigation/NavigationBar';

export default function CourseOutline() {
  return (
    <div className='flex flex-col items-center'>
      <NavigationBar />
      <CourseCover />
    </div>
  );
}
