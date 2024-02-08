import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

export const handleError = (error: unknown) => {
  console.error(error);

  throw new Error('An error occurred: ' + error);
};

export const formatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  };

  const formattedDate = date.toLocaleDateString('en-US', options);

  return formattedDate;
};

export const convertMarkdownToHtml = async (markdown: string) => {
  try {
    const result = await remark()
      .use(html, { sanitize: false })
      .use(gfm)
      .process(markdown);
    return result.toString();
  } catch (error) {
    handleError(error);
  }
};
