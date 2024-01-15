'use client';

import useOutsideClick from '@/hooks/useOutsideClick';
import { Plus, Settings2, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  createCourse,
  createCourseCustom,
  generateSampleTOC,
  generateSampleTopics,
} from '@/lib/actions/generate.actions';
import EmptyState from './CustomGeneration/EmptyState';
import useUserContext from '@/hooks/useUserContext';
import GeneratingCourse from './GeneratingCourse';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface CustomGenerationProps {
  setCustomizeDrawer: (value: boolean) => void;
  topic: string;
}

export default function CustomGeneration({
  setCustomizeDrawer,
  topic,
}: CustomGenerationProps) {
  const customGenerationRef = useOutsideClick(() => setCustomizeDrawer(false));
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [customAttributes, setCustomAttributes] = useState<any>({
    topic: topic,
    concepts: ['Early Life', 'Planes', 'Career', 'Death', 'Legacy', 'Yo'],
    tableOfContents: [],
    experienceLevel: '',
  });

  return (
    <motion.div
      ref={customGenerationRef}
      initial={{ y: '100%' }}
      animate={{
        y: 0,
        transition: { duration: 0.16, ease: 'easeInOut' },
      }}
      layout
      exit={{
        y: '100%',
        transition: { duration: 0.12, ease: 'easeInOut' },
      }}
      style={{ transform: 'translateX(-50%)' }}
      className='fixed z-50  bottom-0  max-w-[560px] min-h-[240px] w-full bg-white border-t-2 border-x-2 border-primary-tan px-6 pt-8 pb-16 rounded-t-xl'
    >
      {generationStep === 0 && (
        <GenerationType
          customAttributes={customAttributes}
          setCustomAttributes={setCustomAttributes}
          setGenerationStep={setGenerationStep}
        />
      )}
      {generationStep === 1 && (
        <CoreConcepts
          customAttributes={customAttributes}
          setCustomAttributes={setCustomAttributes}
          setGenerationStep={setGenerationStep}
        />
      )}
      {generationStep === 2 && (
        <ProposeTOC
          customAttributes={customAttributes}
          setCustomAttributes={setCustomAttributes}
          setCustomizeDrawer={setCustomizeDrawer}
        />
      )}
    </motion.div>
  );
}

function GenerationType({
  customAttributes,
  setCustomAttributes,
  setGenerationStep,
}: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);

  const router = useRouter();
  const { user } = useUserContext();

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
    // function to generate topics
    if (!customAttributes.topic) return;
    setLoading(true);

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

function CoreConcepts({
  customAttributes,
  setCustomAttributes,
  setGenerationStep,
}: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [missingConcept, setMissingConcept] = useState<string>('');

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    addTopic();
  };

  const addTopic = () => {
    if (!missingConcept) return;
    setCustomAttributes({
      ...customAttributes,
      concepts: [...customAttributes.concepts, missingConcept],
    });
  };

  const generateTOC = async () => {
    setLoading(true);
    if (!customAttributes.concepts) return;

    const TOC = await generateSampleTOC(
      customAttributes.topic,
      customAttributes.concepts.toString()
    );

    if (TOC) {
      setCustomAttributes({
        ...customAttributes,
        tableOfContents: TOC,
      });

      setGenerationStep((prev: any) => prev + 1);
    }
  };

  if (loading) return <EmptyState />;

  return (
    <div className='w-full flex flex-col gap-6'>
      <p className='h2 text-center font-rosario'>
        What concepts would you like to cover?
      </p>
      <div className='w-full flex flex-wrap flex-row gap-2'>
        {customAttributes.concepts.map((concept: any, index: number) => (
          <div
            key={index}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              setCustomAttributes({
                ...customAttributes,
                concepts: customAttributes.concepts.filter(
                  (item: string) => item !== concept
                ),
              });
            }}
            className='secondary-button'
          >
            <button className='p-0'>
              <X />
            </button>

            <p>{concept}</p>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleFormSubmit}
        className='grid gap-2'
      >
        <label
          htmlFor='addconcept'
          className='text-sm text-tertiary-black font-bold font-rosario'
        >
          Missing a topic? Add it.
        </label>
        <div
          id='addconcept'
          className='relative w-full min-h-[48px] rounded-md border-2 border-primary-tan'
        >
          <input
            className='w-full h-full outline-none px-4 font-rosario'
            onChange={(e) => setMissingConcept(e.target.value)}
            value={missingConcept}
          />
          <button
            type='submit'
            className='absolute top-[6px] right-2 h-[32px] w-[32px] flex items-center justify-center bg-secondary-black rounded-md text-tertiary-tan'
          >
            <Plus />
          </button>
        </div>
      </form>

      <button
        onClick={generateTOC}
        className='w-full flex items-center justify-center py-2 bg-secondary-black text-lg text-tertiary-tan font-semibold font-rosario'
      >
        Continue
      </button>
    </div>
  );
}

const formatSampleTOC = (toc: any) => {
  return toc.map((item: any) => `${item.id}. ${item.title}`).join('\n');
};

function ProposeTOC({
  customAttributes,
  setCustomAttributes,
  setCustomizeDrawer,
}: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState(
    formatSampleTOC(customAttributes.tableOfContents)
  );

  const router = useRouter();
  const { user } = useUserContext();

  const CustomGeneration = async () => {
    if (!text) return;

    setLoading(true);

    // Splitting text into lines and creating objects with incrementing numbers
    const updatedTableOfContents = text
      .split('\n')
      .map((line: string, index: number) => {
        const title = line.trim().replace(/^\d+\.\s*/, ''); // Removes the number and period from the start
        return {
          order: index + 1,
          title,
        };
      });

    // Filter out empty titles
    const filteredTableOfContents = updatedTableOfContents.filter(
      (item: any) => item.title !== ''
    );

    // Updating customAttributes with new tableOfContents
    setCustomAttributes({
      ...customAttributes,
      tableOfContents: filteredTableOfContents,
    });

    // Call createCourseCustom with updated attributes
    const response = await createCourseCustom(
      {
        ...customAttributes,
        tableOfContents: filteredTableOfContents,
      },
      user?._id || ''
    );

    if (response) {
      if (response.message) {
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
        return;
      } else if (response.courseId) {
        router.push(`/course/${response.courseId}`);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      const lines = text.split('\n');
      const lastLine = lines[lines.length - 1];
      const match = lastLine.match(/^(\d+)\./);

      if (match) {
        const nextNumber = parseInt(match[1], 10) + 1;
        setText(text + '\n' + nextNumber + '. ');
        event.preventDefault(); // Prevents the default action of the Enter key
      }
    }
  };

  if (loading) return <GeneratingCourse />;

  return (
    <div className='w-full flex flex-col gap-6'>
      <p className='h2 text-center font-rosario'>
        Finalize your course outline
      </p>
      <div className='w-full rounded-md border-2 border-primary-tan'>
        <textarea
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={8}
          className='w-full outline-none p-4 font-rosario resize-none'
        />
      </div>
      <button
        onClick={() => {
          CustomGeneration();
        }}
        className='w-full flex items-center justify-center py-2 bg-secondary-black text-lg text-tertiary-tan font-semibold font-rosario'
      >
        Finish
      </button>
    </div>
  );
}
