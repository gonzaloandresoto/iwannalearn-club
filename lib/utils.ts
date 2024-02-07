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
