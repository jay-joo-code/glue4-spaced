import { currentUser, pb } from '$lib/glue/pocketbase';
import type { Load } from '@sveltejs/kit';

export const ssr = false;

export const load: Load = async ({ fetch }) => {
  // sync pocketbase auth state
  if (!pb.authStore.isValid) {
    currentUser.set(null);
  }

  const projectId = 'x924v9210oj0d0l'; // TODO: dynamically fetch project id from deployment subdomain

  const fetchProject = async () => {
    return await pb.collection('projects').getOne(projectId, {
      fetch,
      expand: 'pages(project)'
    });
  };

  return {
    project: fetchProject()
  };
};
