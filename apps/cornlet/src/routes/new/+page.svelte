<script lang="ts">
  import { dev } from '$app/environment';
  import { listingTable } from '$root/src/db/schema';
  import { APP_NAME } from '$root/src/lib/config';
  import { PageContainer, CheckboxInput, TextInput, NumberInput, DateInput } from '@glue/ui';
  import { getTableColumns } from 'drizzle-orm';
  import SuperDebug, { superForm } from 'sveltekit-superforms';

  export let data;

  const superform = superForm(data.form, {
    onSubmit: ({ formData }) => {
      if (data.user) formData.set('userId', data.user.id);
      formData.set('lat', '23759');
      formData.set('lng', '3394');
      formData.set('minsToCampus', '23');
    }
  });
  const { enhance } = superform;

  const fieldConfigs: { [key: string]: any } = {
    lat: {
      isHidden: true
    },
    lng: {
      isHidden: true
    },
    minsToCampus: {
      isHidden: true
    }
  };

  $: excludeFields = Object.entries(fieldConfigs)
    .map(([property, configs]) => ({
      name: property,
      ...configs
    }))
    .filter((fieldConfig) => fieldConfig.isHidden)
    .map((fieldConfig) => fieldConfig.name);

  $: fields = Object.entries(getTableColumns(listingTable))
    .map(([property, configs]) => {
      const field = {
        property,
        ...configs,
        ...fieldConfigs[property]
      };
      return field;
    })
    .filter(
      (field) =>
        field.notNull && field.columnType !== 'PgUUID' && !excludeFields.includes(field.property)
    );

  // $: console.log('fields', fields);
  // $: console.log('$errors', $errors);
</script>

<PageContainer {APP_NAME} title="Create new listing">
  {#if dev}
    <SuperDebug data={superform.form} />
  {/if}
  <form method="POST" action="?/insertListing" use:enhance>
    {#each fields as field}
      {#if field.columnType === 'PgDateString'}
        <DateInput {superform} field={field.property} />
      {:else if field.dataType === 'string'}
        <TextInput {superform} field={field.property} />
      {:else if field.dataType === 'number'}
        <NumberInput {superform} field={field.property} />
      {:else if field.dataType === 'boolean'}
        <CheckboxInput {superform} field={field.property} />
      {/if}
    {/each}

    <div class="mt-8">
      <button class="btn btn-primary">Submit</button>
    </div>
  </form>
</PageContainer>
