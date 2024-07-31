import { type Load } from '@sveltejs/kit';

export const load: Load = async ({ parent }) => {
  console.log('load');
  const { supabase } = await parent();
  const { data: flashcards } = await supabase.from('flashcards').select('*');

  const response = await (
    await fetch('/migration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        flashcards
      })
    })
  ).json();
  console.log('response', response);
  return {};
};
