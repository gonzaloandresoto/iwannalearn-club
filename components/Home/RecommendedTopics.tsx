'use client';

import { recommendedSearches } from '@/constants';
import useUserContext from '@/lib/hooks/useUserContext';
import 'react-toastify/dist/ReactToastify.css';

interface RecommendedTopicsProps {
  setTopic: (topic: string) => void;
  setCustomizeDrawer: (customizeDrawer: boolean) => void;
}

export default function RecommendedTopics({
  setTopic,
  setCustomizeDrawer,
}: RecommendedTopicsProps) {
  const { user } = useUserContext();

  const handleCourseCreation = async (topic: string, userId: string) => {
    if (!topic) return;
    setTopic(topic);
    setCustomizeDrawer(true);
  };

  return (
    <div className='max-w-[880px] w-full flex flex-wrap lg:gap-4 gap-3 justify-center'>
      {recommendedSearches.map((item, index) => {
        return (
          <button
            key={index}
            onClick={() =>
              handleCourseCreation(item?.topic || '', user?._id || '')
            }
            className='secondary-button'
          >
            {item.topic}
          </button>
        );
      })}
    </div>
  );
}
