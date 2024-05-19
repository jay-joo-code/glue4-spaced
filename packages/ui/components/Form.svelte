<script lang="ts" generics="T extends Record<string, unknown>">
  import { dev } from '$app/environment';
  import { FieldConfig } from '@glue/types';
  import { CheckboxInput, DateInput, NumberInput, TextInput } from '@glue/ui';
  import { getTableColumns } from 'drizzle-orm';
  import type { AnyPgTable } from 'drizzle-orm/pg-core';
  import SuperDebug, {
    superForm,
    type FormOptions,
    type SuperValidated
  } from 'sveltekit-superforms';

  export let form: SuperValidated<T>;
  export let table: AnyPgTable;
  export let actionPath: string;
  export let formOptions: FormOptions | undefined = undefined;
  export let fieldConfigs: { [key: string]: FieldConfig } = {};

  const superform = superForm(form, formOptions);
  const { enhance } = superform;

  $: excludeFields = Object.entries(fieldConfigs)
    .map(([property, configs]) => ({
      name: property,
      ...configs
    }))
    .filter((fieldConfig) => fieldConfig.isHidden)
    .map((fieldConfig) => fieldConfig.name);

  $: fields = Object.entries(getTableColumns(table))
    .map(([property, configs]) => {
      const label =
        fieldConfigs[property]?.label || property.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
      return {
        property,
        ...configs,
        ...fieldConfigs[property],
        label
      };
    })
    .filter(
      (field) =>
        field.notNull && field.columnType !== 'PgUUID' && !excludeFields.includes(field.property)
    );
</script>

{#if dev}
  <SuperDebug data={superform.form} />
{/if}
<form method="POST" action={actionPath} use:enhance>
  {#each fields as field}
    {#if field.columnType === 'PgDateString'}
      <DateInput {superform} field={field.property} label={field.label} />
    {:else if field.dataType === 'string'}
      <TextInput {superform} field={field.property} label={field.label} />
    {:else if field.dataType === 'number'}
      <NumberInput {superform} field={field.property} label={field.label} />
    {:else if field.dataType === 'boolean'}
      <CheckboxInput {superform} field={field.property} label={field.label} />
    {/if}
  {/each}

  <div class="mt-8">
    <button class="btn btn-primary">Submit</button>
  </div>
</form>
