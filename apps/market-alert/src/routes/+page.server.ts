import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ fetch }) => {
  const pingCronEndpoint = async () => {
    const response = await fetch('/api/sma?symbols=VT,VTI,VXUS');
    return await response.json();
  };

  return {
    cronEndpoint: await pingCronEndpoint()
  };
};
