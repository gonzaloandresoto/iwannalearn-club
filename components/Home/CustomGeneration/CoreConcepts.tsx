import { generateSampleTOC } from '@/lib/actions/generate.actions';
import { useState } from 'react';
import EmptyState from './EmptyState';
import { X, Plus } from 'lucide-react';

export default function CoreConcepts({
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
