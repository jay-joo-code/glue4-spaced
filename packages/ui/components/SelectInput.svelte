<script lang="ts" generics="T extends Record<string, unknown>">
  import type { FormSelectOption } from '@glue/types';
  import {
    formFieldProxy,
    type FormFieldProxy,
    type FormPathLeaves,
    type SuperForm
  } from 'sveltekit-superforms';
  import { clickOutsideAction } from '@glue/utils';

  export let superform: SuperForm<T>;
  export let field: FormPathLeaves<T, string>;
  export let label: string = undefined;
  export let isHideLabel: boolean = false;
  export let options: FormSelectOption[];
  export let onOptionSelect: (option: FormSelectOption) => void = undefined;

  const { value, errors, constraints } = formFieldProxy(
    superform,
    field
  ) satisfies FormFieldProxy<string>;

  let highlightedIdx = -1;
  let searchText: string = options.find((option) => option.value === $value).label ?? '';
  let isShowOptions = false;

  $: filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleOptionSelect = (option: FormSelectOption) => {
    searchText = option.label;
    $value = option.value;
    if (onOptionSelect) {
      onOptionSelect(options[highlightedIdx]);
    }
    isShowOptions = false;
  };

  function handleKeydown(event: KeyboardEvent) {
    const { key } = event;

    if (key === 'ArrowDown') {
      event.preventDefault();
      highlightedIdx = (highlightedIdx + 1) % options.length;
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      highlightedIdx = (highlightedIdx - 1 + options.length) % options.length;
    } else if (key === 'Enter') {
      event.preventDefault();
      if (highlightedIdx >= 0) {
        handleOptionSelect(options[highlightedIdx]);
      }
    }
  }
</script>

<div
  class="relative"
  use:clickOutsideAction
  on:click_outside={() => {
    console.log('click outside');
    isShowOptions = false;
  }}
>
  <label class="form-control w-full">
    {#if !isHideLabel && label}
      <div class="label">
        <span class="label-text first-letter:uppercase">{label}</span>
      </div>
    {/if}
    <input
      type="text"
      class="input input-bordered w-full"
      on:keydown={handleKeydown}
      on:focus={(event) => {
        isShowOptions = true;
      }}
      name={field}
      aria-invalid={$errors ? 'true' : undefined}
      bind:value={searchText}
      class:input-error={$errors}
      autocomplete="off"
      {...$constraints}
      {...$$restProps}
    />
    <div class="label">
      {#if $errors}<span class="label-text-alt text-error">{$errors}</span>{/if}
    </div>
  </label>
  {#if isShowOptions && filteredOptions.length > 0}
    <div
      class="absolute top-full left-0 w-full border border-base-content/10 p-1 rounded-lg z-20 bg-base-200"
    >
      {#each filteredOptions as option, idx}
        <button
          class="w-full justify-start btn btn-ghost"
          class:bg-base-300={highlightedIdx === idx}
          on:click={() => {
            handleOptionSelect(option);
          }}
        >
          {option.label}
        </button>
      {/each}
    </div>
  {/if}
</div>
