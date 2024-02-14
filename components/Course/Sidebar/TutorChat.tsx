'use client';

import useScrollToBottom from '@/lib/hooks/useScrollToBottom';
import { useChat } from 'ai/react';
import { ListCollapse } from 'lucide-react';
import { useState } from 'react';

interface Message {
  role: string;
  content: string;
}

const introMessages = [
  {
    role: 'system',
    content:
      'You are a a helpful, expert AI tutor who is tasked with ensuring the student understands the topics they ask about. Respond in markdown.',
  },
  {
    role: 'assistant',
    content: 'Hey! How can I help?',
  },
] as Message[];

export default function TutorChat() {
  const [open, setOpen] = useState<boolean>(true);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/tutor-chat',
    initialMessages: introMessages as any,
  });
  const scrollRef = useScrollToBottom([messages]);

  const filteredMessages = messages.filter(
    (message: any) => message.role !== 'system'
  );

  return (
    <div
      className={`flex ${
        open ? 'grow' : 'h-max'
      } flex-col gap-4 w-full general-container p-4 overflow-hidden `}
    >
      <div className='flex flex-row items-center justify-between'>
        <h2 className='h3 font-rosario'>Tutor</h2>
        <button onClick={() => setOpen(!open)}>
          <ListCollapse
            size={18}
            className='text-tertiary-black'
          />
        </button>
      </div>
      {open && (
        <div className='h-full flex flex-col gap-4 overflow-hidden'>
          {/* -------- */}
          <div className='flex grow overflow-auto flex-col gap-2'>
            {filteredMessages.map((message: Message, index: number) => (
              <div
                key={index}
                className={`flex  w-full ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                } ${message.role === 'system' ? 'hidden' : ''}`}
              >
                <div
                  className={`text-sm p-2 rounded-md ${
                    message.role === 'assistant'
                      ? 'bg-tertiary-black text-tertiary-tan justify-start rounded-bl-none'
                      : 'bg-secondary-tan text-secondary-black rounded-br-none'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            <div ref={scrollRef}></div>
          </div>
          {/* -------- */}
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              value={input}
              onChange={handleInputChange}
              className='w-full p-2 bg-white rounded-md border-2 border-primary-tan font-rosario text-base text-secondary-black'
            />
          </form>
        </div>
      )}
    </div>
  );
}
