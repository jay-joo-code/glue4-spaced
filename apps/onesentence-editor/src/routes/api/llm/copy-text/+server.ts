import { REPLICATE_API_TOKEN } from '$env/static/private';
import Replicate from 'replicate';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  try {
    const { prompt, sectionName, componentName, maxWordCount, minWordCount } = await request.json();

    const replicate = new Replicate({
      auth: REPLICATE_API_TOKEN
    });

    const input = {
      debug: false,
      top_p: 1,
      prompt: `Copy text for the website ${sectionName} section ${componentName} component. The website is for ${prompt}. Max word count is ${
        maxWordCount || 12
      }. Min word count is ${minWordCount || 1}`,
      temperature: 0.5,
      system_prompt:
        'You are a copy writer for a website maker. You only reply with the website copy text for the given prompt. You do not reply with any text other than the website copy text for the given prompt. You do not give multiple options. You only reply with one copy text. ',
      max_new_tokens: 500,
      min_new_tokens: -1
    };
    const output = (await replicate.run('meta/llama-2-70b-chat', {
      input
    })) as string[];
    const copyText = output?.join('').replace(/^"|"$/g, '');
    return json(copyText);
  } catch (error) {
    return json(error);
  }
}
