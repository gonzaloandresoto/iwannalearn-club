import OpenAI from 'openai';
const config = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(config);
export default openai;
