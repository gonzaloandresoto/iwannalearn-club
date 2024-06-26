'use client';

import { useState } from 'react';
import useUserContext from '@/lib/hooks/useUserContext';

import { generateSampleConcepts } from '@/lib/actions/generate.actions';

import EmptyState from './EmptyState';
import GeneratingCourse from '../GeneratingInProgress';

import { Settings2, Zap } from 'lucide-react';

export default function GenerationType({
  customAttributes,
  setCustomAttributes,
  setGenerationStep,
}: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);

  const { user } = useUserContext();

  const fastGeneration = async () => {
    // function to generate course (same as before)
    if (!customAttributes.topic || !user) return;

    setGenerating(true);

    // // create course with topic and user id
    // const response = await createCourse(
    //   customAttributes.topic,
    //   user?._id || ''
    // );

    // if ('message' in response) {
    //   toast(response.message, {
    //     position: 'top-center',
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: false,
    //     progress: undefined,
    //     theme: 'dark',
    //   });
    // } else {
    //   router.push(`/course/${response.courseId}`);
    // }
  };

  const generateTopics = async () => {
    if (!customAttributes.topic) return;
    setLoading(true);

    // function to generate topics
    const topics = await generateSampleConcepts(customAttributes?.topic);

    if (topics) {
      setCustomAttributes({
        ...customAttributes,
        concepts: topics,
      });
    }
    setGenerationStep((prev: any) => prev + 1);
  };

  if (loading) return <EmptyState />;

  if (generating) return <GeneratingCourse />;

  return (
    <div className='w-full flex flex-col gap-6'>
      <p className='h2 font-rosario'>
        How would you like to create this course?
      </p>
      <div className='flex flex-row gap-4'>
        <button
          onClick={generateTopics}
          className='generate-button bg-primary-blue  text-tertiary-tan'
        >
          <Settings2 />
          <p>Custom</p>
        </button>
        <button
          disabled
          onClick={fastGeneration}
          className='generate-button flex-col !gap-0 bg-secondary-tan text-secondary-black border-2 border-primary-tan'
        >
          <div className='flex gap-2'>
            <Zap />
            <p>Fast</p>
          </div>

          <p className='text-sm'>(disabled temporarily)</p>
        </button>
      </div>
    </div>
  );
}
