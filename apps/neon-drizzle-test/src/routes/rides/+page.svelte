<script lang="ts">
  import { dev } from '$app/environment';
  import { APP_NAME } from '$root/src/lib/config';
  import { PageContainer, TextInput } from '@glue/ui';
  import SuperDebug, { superForm } from 'sveltekit-superforms';

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

  {#if dev}
    <SuperDebug data={$form} />
  {/if}
  <form use:enhance method="POST">
    <TextInput
      label="Origin"
      bind:value={$form.origin}
      errors={$errors.origin}
      constraints={$constraints.origin}
    />
    <TextInput
      label="Destination"
      bind:value={$form.destination}
      errors={$errors.destination}
      constraints={$constraints.destination}
    />
    <TextInput
      label="Price ($)"
      type="number"
      bind:value={$form.price}
      errors={$errors.price}
      constraints={$constraints.price}
    />
  </form>
</PageContainer>
