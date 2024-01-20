'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import useUserContext from '@/hooks/useUserContext';

import {
  createCourse,
  generateSampleTopics,
} from '@/lib/actions/generate.actions';

import EmptyState from './EmptyState';
import GeneratingCourse from '../GeneratingCourse';

import { Settings2, Zap } from 'lucide-react';
import { getMostRecentCourse } from '@/lib/actions/course.actions';

export default function GenerationType({
  customAttributes,
  setCustomAttributes,
  setGenerationStep,
}: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);

  const router = useRouter();
  const { user } = useUserContext();

  useEffect(() => {
    if (!generating) return;

    const timer = setTimeout(async () => {
      const response = await getMostRecentCourse(user?._id || '');
      if (response?.courseId) {
        router.push(`/course/${response.courseId}`);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [generating]);

  const fastGeneration = async () => {
    // function to generate course (same as before)
    if (!customAttributes.topic || !user) return;

    setGenerating(true);

    // create course with topic and user id
    const response = await createCourse(
      customAttributes.topic,
      user?._id || ''
    );

    if ('message' in response) {
      toast(response.message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'dark',
      });
    } else {
      router.push(`/course/${response.courseId}`);
    }
  };

  const generateTopics = async () => {
    if (!customAttributes.topic) return;
    setLoading(true);

    // function to generate topics
    const topics = await generateSampleTopics(customAttributes.topic);

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
          className='generate-button bg-secondary-tan border-2 border-primary-tan text-secondary-black'
        >
          <Settings2 />
          <p>Custom</p>
        </button>
        <button
          onClick={fastGeneration}
          className='generate-button bg-primary-blue text-tertiary-tan'
        >
          <Zap />
          <p>Fast</p>
        </button>
      </div>
    </div>
  );
}
