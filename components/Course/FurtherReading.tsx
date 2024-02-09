'use client';

import { ListCollapse } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const links = [
  {
    title: 'Title 1',
    url: 'https://www.google.com',
  },
  {
    title: 'Title 2',
    url: 'https://www.google.com',
  },
  {
    title: 'Title 3',
    url: 'https://www.google.com',
  },
  {
    title: 'Title 4',
    url: 'https://www.google.com',
  },
];

export default function FurtherReading() {
  const [open, setOpen] = useState(false);
  const { unit } = useParams<{ unit: string }>() || {
    unit: '',
  };
  return (
    <div className='flex-none w-full h-max p-4 general-container flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <h2 className='h3 font-rosario'>Further Reading</h2>
        <button onClick={() => setOpen(!open)}>
          <ListCollapse
            size={18}
            className='text-tertiary-black'
          />
        </button>
      </div>

      {open && (
        <div className='grid gap-2'>
          {links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              className='text-base text-tertiary-black hover:text-primary-blue font-rosario font-medium hover:underline'
            >
              {link.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
