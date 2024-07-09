<script lang="ts">
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
  import SuperDebug, { superForm, type FormOptions, type SuperForm } from 'sveltekit-superforms';
  import { v4 as uuidv4 } from 'uuid';
  import debounce from 'just-debounce-it';
  import { toast } from '@zerodevx/svelte-toast';
  import { get } from 'svelte/store';

  export let form: Record<string, unknown> = undefined;
  export let table: AnyPgTable;
  export let actionPath: string = undefined;
  export let formBlocks: FormBlock[] = [];
  export let mode: 'create' | 'debounced-edit' = 'create';
  export let superformsConfigs: FormOptions;
  export let updateEndpoint: (superform: SuperForm<Record<string, unknown>, any>) => string =
    undefined;

  const superform = superForm(form, {
    dataType: 'json',
    ...superformsConfigs
  });
  const { enhance, form: formData, validateForm, tainted } = superform;
  const getBlockLabel = (block: FormBlock): string => {
    if (!isFormFieldBlock(block) && !isFormFileUploadBlock(block) && !isFormTextareaBlock(block))
      return '';
    return block.label || block.column.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  };

  const update = async () => {
    const validationResult = await validateForm({ update: true });
    if (validationResult.valid) {
      const endpoint = updateEndpoint(superform);
      const body = structuredClone(get(formData));
      delete body.createdAt;
      delete body.updatedAt;
      const response = await fetch(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body)
      });
      if (response.ok) {
        toast.push('✅ Changes autosaved', {
          id: Math.random()
        });
      } else {
        toast.push('There was an error with saving your changes');
      }
    }
  };
  const debouncedUpdate = debounce(update, 500);

  onMount(() => {
    if (formData && columns.id?.columnType === 'PgUUID' && mode === 'create') {
      $formData.id = uuidv4();
    }
  });

  $: columns = getTableColumns(table);
  $: if ($tainted && $formData && mode === 'debounced-edit') {
    $tainted = undefined;
    debouncedUpdate();
  }
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
              inputProps={block.inputProps}
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
              inputProps={block.inputProps}
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
              inputProps={block.inputProps}
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
              inputProps={block.inputProps}
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
              inputProps={block.inputProps}
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
              inputProps={block.inputProps}
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
              inputProps={block.inputProps}
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
              inputProps={block.inputProps}
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
              inputProps={block.inputProps}
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
