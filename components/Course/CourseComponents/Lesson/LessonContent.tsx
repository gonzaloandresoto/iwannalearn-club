import useTOCContext from '@/hooks/useTOCContext';
import useUserContext from '@/hooks/useUserContext';
import { saveGeneratedLessonText } from '@/lib/actions/element.action';
import { useCompletion } from 'ai/react';
import { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

interface Content {
  title?: string;
  content?: string;
  _id: string;
}

interface LessonContentProps {
  item: Content;
  unitId: string;
  setGenerating: (value: boolean) => void;
  generatedNewContent?: boolean;
  setGeneratedNewContent?: (value: boolean) => void;
}

export default function LessonContent({
  item,
  unitId,
  setGenerating,
  generatedNewContent,
  setGeneratedNewContent,
}: LessonContentProps) {
  const [lessonContent, setLessonContent] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState('');
  const { courseDetails } = useTOCContext();
  const { user } = useUserContext();

  const unitTitle =
    courseDetails &&
    courseDetails?.tableOfContents &&
    JSON.parse(courseDetails.tableOfContents).find(
      (item: any) => item.unitId === unitId
    )?.title;

  const { completion, complete } = useCompletion({
    api: '/api/generate-lesson-text',
    body: {
      lessonId: item._id,
      courseTitle: courseDetails && courseDetails.title,
      courseSummary: courseDetails && courseDetails.summary,
      unitTitle: unitTitle,
      unitLessons:
        courseDetails.tableOfContents &&
        JSON.parse(courseDetails?.tableOfContents),
      lessonTitle: item.title,
    },
  });

  useEffect(() => {
    setLessonContent(item.content || '');
  }, [item]);

  useEffect(() => {
    const getLessonContent = async () => {
      setGenerating(true);
      const completion = await complete('dont respond');
      if (completion) {
        await saveGeneratedLessonText(item._id, completion);
        setLessonContent(completion);
        setGeneratedNewContent?.(!generatedNewContent);
        setGenerating(false);
      }
    };

    if (lessonContent === 'generate' && user && user._id) {
      getLessonContent();
    }
  }, [lessonContent]);

  useEffect(() => {
    const convertMarkdownToHtml = async (markdown: string) => {
      try {
        const result = await remark()
          .use(html, { sanitize: false })
          .use(gfm)
          .process(markdown);
        setHtmlContent(result.toString());
      } catch (error) {
        console.error('Error converting Markdown to HTML:', error);
        setHtmlContent('Error displaying content');
      }
    };

    if (lessonContent === 'generate') {
      convertMarkdownToHtml(completion);
    } else {
      convertMarkdownToHtml(lessonContent);
    }
  }, [lessonContent, completion]);

  console.log('lessonContent:', lessonContent);

  return (
    <div className='lesson-quiz-content'>
      <div className='w-full flex flex-col gap-6'>
        <p className='lg:text-4xl text-2xl text-left font-bold font-sourceSerif text-secondary-black'>
          {item?.title}
        </p>
        <div
          className='lesson-text flex flex-col gap-2'
          dangerouslySetInnerHTML={{ __html: htmlContent || '' }}
        />
      </div>
    </div>
  );
}
