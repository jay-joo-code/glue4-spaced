<script lang="ts">
  import FormHelperText from './FormHelperText.svelte';

  import type { HelperText, HelperTextStatus } from '@glue/types';
  import {
    formFieldProxy,
    type FormFieldProxy,
    type FormPathLeaves,
    type SuperForm
  } from 'sveltekit-superforms';

  type T = $$Generic<Record<string, unknown>>;

  export let superform: SuperForm<T>;
  export let field: FormPathLeaves<T, string>;
  export let label: string = undefined;
  export let isHideLabel: boolean = false;
  export let helperText: HelperText = undefined;
  export let helperTextStatus: HelperTextStatus = undefined;
  export let inputClass: string = undefined;
  export let inputProps: Record<string, any> = {};

  const { value, errors, constraints } = formFieldProxy(
    superform,
    field
  ) satisfies FormFieldProxy<string>;
  const { form } = superform;
</script>

<label class="form-control w-full">
  {#if !isHideLabel && label}
    <div class="label">
      <span class="label-text first-letter:uppercase">{label}</span>
    </div>
  {/if}
  <textarea
    name={field}
    rows="7"
    aria-invalid={$errors ? 'true' : undefined}
    bind:value={$value}
    class="{inputClass} textarea textarea-bordered w-full"
    class:input-error={$errors}
    {...$constraints}
    {...$$restProps}
    {...inputProps}
  />
  <div class="label">
    {#if $errors}
      <span class="label-text-alt text-error">{$errors}</span>
    {:else if helperText}
      <FormHelperText {helperText} {helperTextStatus} {superform} />
    {/if}
  </div>
</label>
