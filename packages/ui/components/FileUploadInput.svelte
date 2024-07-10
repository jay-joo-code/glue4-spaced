<script lang="ts" generics="T extends Record<string, unknown>">
  import FormHelperText from './FormHelperText.svelte';
  import type { HandleFileUpload, HelperText, HelperTextStatus } from '@glue/types';
  import type { DndEvent, Item } from 'svelte-dnd-action';
  import { dndzone } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';
  import {
    formFieldProxy,
    type FormFieldProxy,
    type FormPathLeaves,
    type SuperForm
  } from 'sveltekit-superforms';

  export let handleFileUpload: HandleFileUpload;
  export let superform: SuperForm<T>;
  export let field: FormPathLeaves<T, string[]>;
  export let label: string = undefined;
  export let isHideLabel: boolean = false;
  export let helperText: HelperText = undefined;
  export let helperTextStatus: HelperTextStatus = undefined;
  export let inputClass: string = undefined;
  export let inputProps: Record<string, any> = {};

  const { value, errors, constraints } = formFieldProxy(superform, field) satisfies FormFieldProxy<
    string[]
  >;
  let isLoading = false;
  const flipDurationMs = 300;

  const handleDndConsider = (event: CustomEvent<DndEvent<Item>>) => {
    $value = event.detail.items.map((item) => item.id);
  };
  const handleDndFinalize = (event: CustomEvent<DndEvent<Item>>) => {
    $value = event.detail.items.map((item) => item.id);
  };
  const onFileUpload = async (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
    if (event.currentTarget.files) {
      isLoading = true;
      const newUrls = await handleFileUpload({ files: event.currentTarget.files, superform });
      $value = [...$value, ...newUrls];
      isLoading = false;
    }
  };
</script>

<label class="form-control w-full">
  {#if !isHideLabel && label}
    <div class="label">
      <span class="label-text first-letter:uppercase">{label}</span>
    </div>
  {/if}
  <div class="flex space-x-6 items-center">
    <input
      name={field}
      type="file"
      class="{inputClass} file-input file-input-bordered w-full max-w-xs"
      on:input={onFileUpload}
      class:file-input-error={$errors}
      multiple
      {...$$restProps}
      {...inputProps}
    />
    <!-- TODO: handle required, min, max validation -->
    <!-- {...$constraints} -->
    {#if isLoading}
      <span class="loading loading-spinner loading-sm"></span>
    {/if}
  </div>
  <div class="label">
    {#if $errors}
      <span class="label-text-alt text-error">{$errors}</span>
    {:else if helperText}
      <FormHelperText {helperText} {helperTextStatus} {superform} />
    {/if}
  </div>
</label>

<div
  class="grid grid-cols-2 gap-4 mt-8 !outline-none"
  use:dndzone={{ items: $value.map((url) => ({ id: url })), flipDurationMs }}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
>
  {#each $value.map((url) => ({ id: url })) as item (item.id)}
    <div class="relative" animate:flip={{ duration: flipDurationMs }}>
      <img
        class="object-cover w-full h-48 sm:h-52 lg:h-64 rounded-lg border border-base-content/10 hover:shadow-xl hover:opacity-70"
        src={item.id}
      />
      <button
        class="absolute -right-2 -top-2 btn-xs text-[0.9rem] btn btn-circle pb-1 border border-base-content/10"
        on:click={(event) => {
          $value = $value.filter((existingUrl) => existingUrl !== item.id);
        }}
      >
        <!-- NOTE: Using svg in children of dnd action throws errors -->
        <!-- https://github.com/isaacHagoel/svelte-dnd-action/issues/557 -->
        x
      </button>
    </div>
  {/each}
</div>
