<script lang="ts" generics="T extends Record<string, unknown>">
  import { dev } from '$app/environment';
  import type { FieldConfig } from '@glue/types';
  import { CheckboxInput, DateInput, NumberInput, TextInput } from '@glue/ui';
  import { getTableColumns } from 'drizzle-orm';
  import type { AnyPgTable } from 'drizzle-orm/pg-core';
  import SuperDebug, {
    superForm,
    type FormOptions,
    type SuperValidated
  } from 'sveltekit-superforms';
  import { browser } from '$app/environment';

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
  {#if browser && window.localStorage.getItem('is-show-debugger') === 'true'}
    <div class="relative">
      <SuperDebug data={superform.form} />
      <button
        class="absolute bottom-4 right-4 btn btn-sm btn-primary"
        on:click={() => {
          if (browser) {
            window.localStorage.setItem('is-show-debugger', 'false');
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
          />
        </svg>

        Hide
      </button>
    </div>
  {:else}
    <button
      class="btn btn-sm btn-primary fixed left-8 bottom-8"
      on:click={() => {
        if (browser) {
          window.localStorage.setItem('is-show-debugger', 'true');
        }
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
      Show debugger
    </button>
  {/if}
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

  <slot />

  <div class="mt-8">
    <button class="btn btn-primary">Submit</button>
  </div>
</form>
