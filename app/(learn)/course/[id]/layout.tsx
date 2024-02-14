import { TOCProvider } from '@/context/TOCProvider';
import { UserProvider } from '@/context/UserProvider';
import NavigationBar from '@/components/Course/Navigation/NavigationBar';
import type { Metadata } from 'next';
import { getCourseById } from '@/lib/actions/course.actions';

import React from 'react';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | undefined> {
  const id = params.id;

  const course = await getCourseById(id);

  if (course)
    return {
      title: course.title,
      description: course.summary,
      openGraph: {
        title: `${course.title} – IWannaLearn`,
        description: course.summary,
      },
      twitter: {
        title: `${course.title} – IWannaLearn`,
        description: course.summary,
      },
    };
}

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <UserProvider>
      <TOCProvider>
        <section className='w-full h-[100vh] flex flex-col bg-tertiary-tan'>
          <NavigationBar />
          {children}
        </section>
      </TOCProvider>
    </UserProvider>
  );
}
