'use client';
import useOutsideClick from '@/lib/hooks/useOutsideClick';
import useUserContext from '@/lib/hooks/useUserContext';
import { uploadFeedback } from '@/lib/actions/general.actions';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

const Feedback = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className='hidden sm:block z-50 fixed bottom-8 right-8'>
      <button
        onClick={() => setIsOpen(true)}
        className='w-[48px] h-[48px] flex items-center justify-center bg-white hover:bg-secondary-tan border border-primary-tan rounded-full shadow-md'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('issue', FeedbackData.issue);
    formData.append('userId', user?._id || '');
    formData.append('type', FeedbackData.type);
    await uploadFeedback(formData);
    setIsOpen(false);
  };

  return (
    <div
      ref={cardRef}
      className='fixed z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[400px] w-full p-4 bg-tertiary-tan rounded-lg shadow-md border-2 border-primary-tan'
    >
      <form
        onSubmit={handleSubmit}
        className='grid gap-4'
      >
        <h2 className='h2 font-rosario'>{`What's the issue?`}</h2>
        <textarea
          rows={6}
          placeholder='Please describe the issue you are facing'
          className='w-full p-2 text-tertiary-black font-rosario rounded-md border border-primary-tan outline-none focus:border-primary-tan focus:ring-2 focus:ring-primary-tan '
          onChange={(e) =>
            setFeedbackData({ ...FeedbackData, issue: e.target.value })
          }
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
