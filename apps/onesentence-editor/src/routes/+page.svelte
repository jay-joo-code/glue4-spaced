<script lang="ts">
  import { goto } from '$app/navigation';
  import PageContainer from '$lib/components/glue/PageContainer.svelte';
  import axios from 'axios';
  import TextInput from '../lib/components/glue/TextInput.svelte';
  import { currentUser, pb } from '../lib/glue/pocketbase';
  import { SECTION_HERO } from '../lib/util/constants';

  let prompt = '';
  let isLoadingCreateProject = false;

  const handleCreateProject = async () => {
    if (!prompt) return;

    isLoadingCreateProject = true;
    const project = await pb.collection('projects').create({
      prompt,
      user: $currentUser
    });

    const titleCopyText = (
      await axios.post('/api/llm/copy-text', {
        prompt,
        sectionName: 'hero',
        componentName: 'title',
        maxWordCount: 10
      })
    )?.data;

    const overlineCopyText = (
      await axios.post('/api/llm/copy-text', {
        prompt,
        sectionName: 'overline',
        componentName: 'title',
        maxWordCount: 6
      })
    )?.data;

    const descCopyText = (
      await axios.post('/api/llm/copy-text', {
        prompt,
        sectionName: 'overline',
        componentName: 'description',
        minWordCount: 10,
        maxWordCount: 20
      })
    )?.data;

    await pb.collection('pages').create({
      name: 'Home',
      project: project?.id,
      user: $currentUser,
      sections: [
        {
          variant: SECTION_HERO,
          cpTitle: {
            label: titleCopyText
          },
          cpOverline: {
            label: overlineCopyText
          },
          cpDesc: {
            label: descCopyText
          }
        }
      ]
    });
    goto(`/sitemap/${project?.id}`);
    isLoadingCreateProject = false;
  };
</script>

<PageContainer title="Home">
  <div class="flex min-h-[80vh] items-center justify-center">
    <form class="w-[30rem] max-w-full" on:submit={handleCreateProject}>
      <TextInput label="Prompt" bind:value={prompt} />
      <div class="mt-4 flex justify-end">
        <button class="btn btn-primary" disabled={isLoadingCreateProject}>
          {#if isLoadingCreateProject}
            <span class="loading loading-spinner loading-xs" />
          {/if}
          Generate
        </button>
      </div>
    </form>
  </div>
</PageContainer>
