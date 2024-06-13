<script lang="ts" generics="T extends Record<string, unknown>">
  import { dev } from '$app/environment';
  import {
    isFormAddressBlock,
    isFormFieldBlock,
    isFormFileUploadBlock,
    isFormSelectBlock,
    isFormSpaceBlock,
    isFormTextBlock,
    isFormTextareaBlock,
    isFormToggleBlock,
    type FormBlock
  } from '@glue/types';
  import {
    AddressInput,
    CheckboxInput,
    DateInput,
    FileUploadInput,
    NumberInput,
    SelectInput,
    TextInput,
    TextareaInput,
    ToggleInput
  } from '@glue/ui';
  import { getTableColumns } from 'drizzle-orm';
  import type { AnyPgTable } from 'drizzle-orm/pg-core';
  import { onMount } from 'svelte';
  import SuperDebug, { type SuperForm } from 'sveltekit-superforms';
  import { v4 as uuidv4 } from 'uuid';

  export let superform: SuperForm<T>;
  export let table: AnyPgTable;
  export let actionPath: string;
  export let formBlocks: FormBlock[] = [];
  export let mode: 'create' | 'debounced-edit' = 'create';

  const { enhance, form } = superform;

  $: columns = getTableColumns(table);

  const getBlockLabel = (block: FormBlock): string => {
    if (!isFormFieldBlock(block) && !isFormFileUploadBlock(block) && !isFormTextareaBlock(block))
      return '';
    return block.label || block.column.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  };

  onMount(() => {
    if (form && columns.id?.columnType === 'PgUUID' && mode === 'create') {
      $form.id = uuidv4();
    }
  });
</script>

{#if dev}
  <SuperDebug data={superform.form} />
{/if}

<form method="POST" action={actionPath} use:enhance enctype="multipart/form-data">
  <div class="space-y-2">
    {#each formBlocks as block}
      {#if isFormTextBlock(block)}
        {#if block.variant === 'h1'}
          <h1 class="text-4xl font-extrabold !mt-8">{block.content}</h1>
        {:else if block.variant === 'h2'}
          <h2 class="text-2xl font-extrabold !mt-16">{block.content}</h2>
        {:else if block.variant === 'p'}
          <h2 class="text-sm text-base-content/80 !mb-6">{block.content}</h2>
        {/if}
      {:else if isFormSpaceBlock(block)}
        <div style="margin-bottom: {block.spaceRem}rem;"></div>
      {:else if isFormFieldBlock(block)}
        <div class={block.containerClass}>
          {#if isFormFileUploadBlock(block)}
            <FileUploadInput
              {superform}
              field={block.column}
              label={getBlockLabel(block)}
              handleFileUpload={block.handleFileUpload}
              isHideLabel={block.isHideLabel}
              helperText={block.helperText}
              helperTextStatus={block.helperTextStatus}
              inputClass={block.inputClass}
            />
          {:else if isFormTextareaBlock(block)}
            <TextareaInput
              {superform}
              field={block.column}
              label={getBlockLabel(block)}
              isHideLabel={block.isHideLabel}
              helperText={block.helperText}
              helperTextStatus={block.helperTextStatus}
              inputClass={block.inputClass}
            />
          {:else if isFormSelectBlock(block)}
            <SelectInput
              {superform}
              field={block.column}
              label={getBlockLabel(block)}
              isHideLabel={block.isHideLabel}
              options={block.options}
              onOptionSelect={block.onOptionSelect}
              helperText={block.helperText}
              helperTextStatus={block.helperTextStatus}
              inputClass={block.inputClass}
            />
          {:else if isFormAddressBlock(block)}
            <AddressInput
              {superform}
              field={block.column}
              label={getBlockLabel(block)}
              isHideLabel={block.isHideLabel}
              onOptionSelect={block.onOptionSelect}
              helperText={block.helperText}
              helperTextStatus={block.helperTextStatus}
              inputClass={block.inputClass}
            />
          {:else if isFormToggleBlock(block)}
            <ToggleInput
              {superform}
              field={block.column}
              label={getBlockLabel(block)}
              isHideLabel={block.isHideLabel}
              helperText={block.helperText}
              helperTextStatus={block.helperTextStatus}
              inputClass={block.inputClass}
            />
          {:else if columns[block.column].columnType === 'PgDateString'}
            <DateInput
              {superform}
              field={block.column}
              label={getBlockLabel(block)}
              isHideLabel={block.isHideLabel}
              helperText={block.helperText}
              helperTextStatus={block.helperTextStatus}
              inputClass={block.inputClass}
            />
          {:else if columns[block.column].dataType === 'string'}
            <TextInput
              {superform}
              field={block.column}
              label={getBlockLabel(block)}
              isHideLabel={block.isHideLabel}
              helperText={block.helperText}
              helperTextStatus={block.helperTextStatus}
              inputClass={block.inputClass}
            />
          {:else if columns[block.column].dataType === 'number'}
            <NumberInput
              {superform}
              field={block.column}
              label={getBlockLabel(block)}
              isHideLabel={block.isHideLabel}
              helperText={block.helperText}
              helperTextStatus={block.helperTextStatus}
              inputClass={block.inputClass}
            />
          {:else if columns[block.column].dataType === 'boolean'}
            <CheckboxInput
              {superform}
              field={block.column}
              label={getBlockLabel(block)}
              isHideLabel={block.isHideLabel}
              helperText={block.helperText}
              helperTextStatus={block.helperTextStatus}
              inputClass={block.inputClass}
            />
          {/if}
        </div>
      {/if}
    {/each}
  </div>

  <div class="mt-8">
    <button class="btn btn-primary">Submit</button>
  </div>
</form>
