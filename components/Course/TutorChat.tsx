'use client';

import { useState } from 'react';

const messages = [
  {
    role: 'assistant',
    message: 'Hello, how can I help you today?',
  },
  {
    role: 'user',
    message: 'I need help with my homework',
  },
];

export default function TutorChat() {
  //   const [messages, setMessages] = useState<any>([]);
  const [message, setMessage] = useState<string>('');
  return (
    <div className='flex grow flex-col gap-4 w-full general-container p-4'>
      <h2 className='h3 font-rosario'>Tutor</h2>
      <div className='flex grow flex-col gap-4'>
        <div className='flex flex-grow flex-col gap-2'>
          {messages.map((message: any) => (
            <div
              key={message.message}
              className={`flex  w-full ${
                message.role === 'assistant' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`text-sm p-2 rounded-md ${
                  message.role === 'assistant'
                    ? 'bg-tertiary-black text-tertiary-tan justify-start rounded-bl-none'
                    : 'bg-secondary-tan text-secondary-black rounded-br-none'
                }`}
              >
                {message.message}
              </div>
            </div>
          ))}
        </div>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className='w-full p-2 bg-white rounded-md border-2 border-primary-tan'
        />
      </div>
    </div>
  );
}
