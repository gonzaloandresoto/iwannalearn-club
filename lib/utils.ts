export const handleError = (error: unknown) => {
  console.error(error);

  throw new Error('An error occurred: ' + error);
};
