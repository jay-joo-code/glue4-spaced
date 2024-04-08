<script lang="ts">
  import { APP_NAME } from '$root/src/lib/config';
  import { PageContainer, TextInput } from '@glue/ui';
  import { superForm } from 'sveltekit-superforms';

  export let data;

  const { form, enhance, errors, constraints } = superForm(data.form);
</script>

<PageContainer {APP_NAME} title="Rides CRUD">
  {#await data.rides}
    <div class="">
      <span class="loading loading-spinner loading-sm" />
    </div>
  {:then rides}
    {#each rides as ride}
      <div class="my-4">
        <p class="">{ride.origin}</p>
        <p class="">{ride.destination}</p>
        <p class="">{ride.price}</p>
        <p class="">{ride.datetime}</p>
      </div>
    {/each}
  {/await}

  <form use:enhance method="POST">
    <TextInput
      label="Origin"
      name="origin"
      bind:value={$form.origin}
      errors={$errors.origin}
      constraints={$constraints.origin}
    />
  </form>
</PageContainer>
