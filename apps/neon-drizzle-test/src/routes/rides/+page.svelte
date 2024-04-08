<script lang="ts">
  import { dev } from '$app/environment';
  import { APP_NAME } from '$root/src/lib/config';
  import { PageContainer, TextInput, Textarea } from '@glue/ui';
  import SuperDebug, { dateProxy, superForm } from 'sveltekit-superforms';

  export let data;

  const { form, enhance, errors, constraints } = superForm(data.form);
  const proxyDatetime = dateProxy(form, 'datetime', { format: 'date' });
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
  <form class="space-y-4" use:enhance method="POST">
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
    <Textarea
      label="Description"
      bind:value={$form.desc}
      errors={$errors.desc}
      constraints={$constraints.desc}
    />
    <TextInput
      label="Date"
      type="date"
      bind:value={$proxyDatetime}
      errors={$errors.datetime}
      constraints={$constraints.datetime}
    />
  </form>
</PageContainer>
