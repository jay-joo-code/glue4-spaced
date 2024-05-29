<script lang="ts" generics="T extends Record<string, unknown>">
  import PhotoUploadInput from './PhotoUploadInput.svelte';

  import { dev } from '$app/environment';
  import {
    isFormFieldBlock,
    isFormFileUploadBlock,
    isFormSpaceBlock,
    isFormTextBlock,
    isFormTextareaBlock,
    type FormBlock
  } from '@glue/types';
  import { CheckboxInput, DateInput, NumberInput, TextInput, TextareaInput } from '@glue/ui';
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
  export let formBlocks: FormBlock[] = [];

  const superform = superForm(form, formOptions);
  const { enhance } = superform;

  $: columns = getTableColumns(table);

  const getBlockLabel = (block: FormBlock): string => {
    if (!isFormFieldBlock(block) && !isFormFileUploadBlock(block) && !isFormTextareaBlock(block))
      return '';
    return block.label || block.column.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  };
</script>

{#if dev}
  <SuperDebug data={superform.form} />
{/if}

<form method="POST" action={actionPath} use:enhance>
  <div class="space-y-2">
    {#each formBlocks as block}
      {#if isFormTextBlock(block)}
        {#if block.variant === 'h1'}
          <h1 class="text-3xl font-extrabold !mt-6">{block.content}</h1>
        {:else if block.variant === 'h2'}
          <h2 class="text-2xl font-extrabold !mt-6">{block.content}</h2>
        {:else if block.variant === 'p'}
          <h2 class="text-sm text-base-content/80">{block.content}</h2>
        {/if}
      {:else if isFormSpaceBlock(block)}
        <div style="margin-bottom: {block.spaceRem}rem;"></div>
      {:else if isFormFileUploadBlock(block)}
        <PhotoUploadInput
          {superform}
          field={block.column}
          label={getBlockLabel(block)}
          handleFileUpload={block.handleFileUpload}
          isHideLabel={block.isHideLabel}
        />
      {:else if isFormTextareaBlock(block)}
        <TextareaInput
          {superform}
          field={block.column}
          label={getBlockLabel(block)}
          isHideLabel={block.isHideLabel}
        />
      {:else if isFormFieldBlock(block)}
        {#if columns[block.column].columnType === 'PgDateString'}
          <DateInput
            {superform}
            field={block.column}
            label={getBlockLabel(block)}
            isHideLabel={block.isHideLabel}
          />
        {:else if columns[block.column].dataType === 'string'}
          <TextInput
            {superform}
            field={block.column}
            label={getBlockLabel(block)}
            isHideLabel={block.isHideLabel}
          />
        {:else if columns[block.column].dataType === 'number'}
          <NumberInput
            {superform}
            field={block.column}
            label={getBlockLabel(block)}
            isHideLabel={block.isHideLabel}
          />
        {:else if columns[block.column].dataType === 'boolean'}
          <CheckboxInput
            {superform}
            field={block.column}
            label={getBlockLabel(block)}
            isHideLabel={block.isHideLabel}
          />
        {/if}
      {/if}
    {/each}
  </div>

  <div class="mt-8">
    <button class="btn btn-primary">Submit</button>
  </div>
</form>
