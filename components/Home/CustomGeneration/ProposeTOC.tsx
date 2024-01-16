import useUserContext from '@/hooks/useUserContext';
import { createCourseCustom } from '@/lib/actions/generate.actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import GeneratingCourse from '../GeneratingCourse';

const formatSampleTOC = (toc: string[]) => {
  return toc.map((item: any) => `${item.id}. ${item.title}`).join('\n');
};

export default function ProposeTOC({
  customAttributes,
  setCustomAttributes,
}: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>(
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
        onClick={CustomGeneration}
        className='w-full flex items-center justify-center py-2 bg-secondary-black text-lg text-tertiary-tan font-semibold font-rosario'
      >
        Finish
      </button>
    </div>
  );
}
