<script lang="ts">
  import { APP_NAME } from '$lib/config';
  import { PageContainer } from '@glue/ui';

  export let data;

  $: console.log('data.cronEndpoint', data.cronEndpoint);
</script>

<PageContainer {APP_NAME} title="Home">Home</PageContainer>
