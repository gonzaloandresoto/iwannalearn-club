// import { useState } from 'react';
// import LessonActionsDesktop from './LessonActionsDesktop';
// import EmptyState from '@/components/Home/CustomGeneration/EmptyState';
import { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';

interface Content {
  title?: string;
  content?: string;
  _id: string;
}

interface LessonContentProps {
  item: Content;
  unitId: string;
}

export default function LessonContent({ item, unitId }: LessonContentProps) {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const convertMarkdownToHtml = async (markdown: string) => {
      try {
        const result = await remark()
          .use(html, { sanitize: false })
          .process(markdown);
        setHtmlContent(result.toString());
      } catch (error) {
        console.error('Error converting Markdown to HTML:', error);
        setHtmlContent('Error displaying content');
      }
    };

    if (item.content) {
      convertMarkdownToHtml(item.content);
    }
  }, [item.content]);

  return (
    <div className='lesson-quiz-content'>
      <div className='w-full flex flex-col gap-6'>
        <p className='lg:text-4xl text-2xl text-left font-bold font-sourceSerif text-secondary-black'>
          {item?.title}
        </p>
        <div
          className='lesson-text flex flex-col gap-2'
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}

// if (loading) return <EmptyState />;

{
  /* <LessonActionsDesktop
  lesson={item}
  unitId={unitId}
  setLoading={setLoading}
/> */
}
