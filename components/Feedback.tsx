'use client';
import useOutsideClick from '@/hooks/useOutsideClick';
import useUserContext from '@/hooks/useUserContext';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

const Feedback = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className='z-50 fixed bottom-8 right-8'>
      <button
        onClick={() => setIsOpen(true)}
        className='w-[48px] h-[48px] flex items-center justify-center bg-white border border-primary-tan rounded-full shadow-md'
      >
        <HelpCircle className='text-tertiary-black' />
      </button>
      {isOpen && (
        <div className='fixed top-0 left-0 w-screen h-screen bg-secondary-black opacity-20'></div>
      )}
      {isOpen && <FeedbackCard setIsOpen={setIsOpen} />}
    </div>
  );
};

export default Feedback;

const FeedbackCard = ({ setIsOpen }: any) => {
  const cardRef = useOutsideClick(() => setIsOpen(false));
  const [FeedbackData, setFeedbackData] = useState({
    issue: '',
    userId: '',
    type: 'feedback',
  });
  const { user } = useUserContext();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // await uploadFeedback()
  };

  return (
    <div
      ref={cardRef}
      className='fixed z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[400px] w-full p-4 bg-tertiary-tan rounded-lg shadow-md border-2 border-primary-tan'
    >
      <form
        action={handleSubmit}
        className='grid gap-4'
      >
        <h2 className='h2 font-rosario'>What's the issue?</h2>
        <textarea
          rows={6}
          placeholder='Please describe the issue you are facing'
          className='w-full p-2 text-tertiary-black font-rosario'
        />
        <button
          type='submit'
          className='primary-button hover:bg-tertiary-black rounded-md text-base text-white font-rosario font-semibold px-4 py-3'
        >
          Submit
        </button>
      </form>
    </div>
  );
};
