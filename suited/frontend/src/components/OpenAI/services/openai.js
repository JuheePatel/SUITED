import OpenAI from 'openai';

const openai = new OpenAI({
apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const ASSISTANT_ID = import.meta.env.VITE_ASSISTANT_ID;

export async function createThread() {
  const thread = await openai.beta.threads.create();
  return thread.id;
}

export async function sendMessage(threadId, message) {
  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: message
  });

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: ASSISTANT_ID
  });

  let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

  while (runStatus.status !== 'completed') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

    if (runStatus.status === 'failed') {
      throw new Error('Assistant run failed');
    }
  }

  const messages = await openai.beta.threads.messages.list(threadId);
  return messages.data[0].content[0].text.value;
}

export async function analyzeJobDescription(description) {
  const threadId = await createThread();
  const prompt = `Please analyze this job description and extract the following:
  1. Key technical skills required
  2. Soft skills and competencies
  3. Required experience level
  4. Key responsibilities
  5. Required qualifications

  Job Description:
  ${description}`;

  return await sendMessage(threadId, prompt);
}

export async function analyzeResume(resume) {
  const threadId = await createThread();
  const prompt = `Please analyze this resume and provide:
  1. Key skills identified
  2. Experience summary
  3. Suggestions for improvement
  4. Areas that might need more detail

  Resume:
  ${resume}`;

  return await sendMessage(threadId, prompt);
}