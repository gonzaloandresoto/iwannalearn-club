export const markQuizCompleted = async (quizId: string) => {
  const response = await fetch('/api/quiz-completed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quizId }),
  });
  return response.json();
};

export const updateUnitStatus = async (unitId: string) => {
  const response = await fetch('/api/update-unit-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ unitId }),
  });
  return response.json();
};
