<script lang="ts" generics="T extends Record<string, unknown>">
  import type { FormSelectOption } from '@glue/types';
  import { onMount } from 'svelte';
  import {
    formFieldProxy,
    type FormFieldProxy,
    type FormPathLeaves,
    type SuperForm
  } from 'sveltekit-superforms';

  export let superform: SuperForm<T>;
  export let field: FormPathLeaves<T, string>;
  export let label: string = undefined;
  export let isHideLabel: boolean = false;
  export let options: FormSelectOption[];
  export let onOptionSelect: (option: FormSelectOption) => void = undefined;
  export let onSearchTextChange: (searchText: string) => void = undefined;
  export let helperText: string = undefined;

  const { value, errors, constraints } = formFieldProxy(
    superform,
    field
  ) satisfies FormFieldProxy<string>;

  let highlightedIdx = -1;
  let searchText: string = '';
  let isShowOptions = false;
  let inputElement: HTMLInputElement;

  $: selectedOption = options.find((option) => option.value === $value);
  $: filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );
  $: displayOptions =
    !selectedOption || searchText === selectedOption.label ? options : filteredOptions;

  const handleOptionSelect = (option: FormSelectOption) => {
    $value = option.value;
    searchText = option.label;
    if (onOptionSelect) {
      onOptionSelect(option);
    }
    inputElement.blur();
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
        handleOptionSelect(displayOptions[highlightedIdx]);
      }
    } else {
      highlightedIdx = -1;
    }
  }

  onMount(() => {
    if (selectedOption) searchText = selectedOption.label;
  });
</script>

<div class="relative">
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
      on:focus={() => {
        isShowOptions = true;
      }}
      on:blur={() => {
        isShowOptions = false;
        const latestSelectedOption = options.find((option) => option.value === $value);
        if ($constraints.required && !latestSelectedOption) {
          $errors = ['Please select an option from the dropdown menu'];
        } else {
          searchText = latestSelectedOption?.label ?? '';
          $errors = undefined;
        }
      }}
      name={field}
      aria-invalid={$errors ? 'true' : undefined}
      bind:value={searchText}
      bind:this={inputElement}
      on:input={(event) => {
        if (onSearchTextChange) {
          onSearchTextChange(event.currentTarget.value);
        }
      }}
      class:input-error={$errors}
      autocomplete="off"
      {...$constraints}
      {...$$restProps}
    />
    <div class="label">
      {#if $errors}
        <span class="label-text-alt text-error">{$errors}</span>
      {:else if helperText}
        <span class="label-text-alt text-base-content/80 first-letter:uppercase">{helperText}</span>
      {/if}
    </div>
  </label>
  {#if isShowOptions}
    <div
      class="absolute top-full left-0 w-full border border-base-content/10 p-1 rounded-lg z-20 bg-base-200"
    >
      {#if displayOptions.length > 0}
        {#each displayOptions as option, idx}
          <button
            class="w-full justify-start btn btn-ghost"
            class:bg-base-300={highlightedIdx === idx}
            on:mousedown={(event) => {
              event.preventDefault();
              handleOptionSelect(option);
            }}
          >
            {option.label}
          </button>
        {/each}
      {:else}
        <div class="py-2 px-3">
          <p class="text-sm text-base-content/80">No options matched your search term</p>
        </div>
      {/if}
    </div>
  {/if}
</div>
