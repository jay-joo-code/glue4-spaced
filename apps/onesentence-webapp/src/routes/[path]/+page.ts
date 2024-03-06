import { pb } from '$root/src/lib/glue/pocketbase';
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ url }) => {
  const projectId = 'x924v9210oj0d0l'; // TODO: dynamically fetch project id from deployment subdomain

  const fetchSections = async () => {
    return await pb.collection('sections').getFullList({
      filter: `project = "${projectId}" && path = "${url?.pathname}"`,
      sort: 'order',
      expand: 'items(section)'
    });
  };

  return {
    sections: fetchSections()
  };
};
