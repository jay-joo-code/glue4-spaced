<script lang="ts" generics="T extends Record<string, unknown>">
  import FormHelperText from './FormHelperText.svelte';

  import type { HelperText, HelperTextStatus } from '@glue/types';
  import {
    formFieldProxy,
    type FormFieldProxy,
    type FormPathLeaves,
    type SuperForm
  } from 'sveltekit-superforms';

  export let superform: SuperForm<T>;
  export let field: FormPathLeaves<T, boolean>;
  export let label: string = undefined;
  export let isHideLabel: boolean = false;
  export let helperText: HelperText = undefined;
  export let helperTextStatus: HelperTextStatus = undefined;
  export let inputClass: string = undefined;
  export let inputProps: Record<string, any> = {};

  const { value, errors, constraints } = formFieldProxy(
    superform,
    field
  ) satisfies FormFieldProxy<boolean>;

  const { form } = superform;
</script>

<div class="form-control">
  <label class="label cursor-pointer flex justify-start space-x-5">
    <input
      name={field}
      type="checkbox"
      class="{inputClass} toggle"
      bind:checked={$value}
      class:input-error={$errors}
      class:toggle-success={$value}
      {...$constraints}
      {...$$restProps}
      {...inputProps}
    />
    <div class="">
      {#if !isHideLabel && label}
        <div class="">
          <span class="label-text font-extrabold first-letter:uppercase">{label}</span>
        </div>
      {/if}
      {#if helperText}
        <div class="">
          <FormHelperText {helperText} {helperTextStatus} {superform} />
        </div>
      {/if}
    </div>
  </label>
  <div class="label">
    {#if $errors}
      <span class="label-text-alt text-error">{$errors}</span>
    {/if}
  </div>
</div>
