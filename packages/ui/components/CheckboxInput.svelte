<script lang="ts" generics="T extends Record<string, unknown>">
  import type { HelperTextStatus } from '@glue/types';

  import {
    formFieldProxy,
    type FormFieldProxy,
    type FormPathLeaves,
    type SuperForm
  } from 'sveltekit-superforms';

  export let superform: SuperForm<T>;
  export let field: FormPathLeaves<T, boolean>;
  export let label: string = undefined;
  export let helperText: string = undefined;
  export let helperTextStatus: HelperTextStatus = undefined;
  export let inputClass: string = undefined;

  const { value, errors, constraints } = formFieldProxy(
    superform,
    field
  ) satisfies FormFieldProxy<boolean>;
</script>

<div class="form-control">
  <label class="label cursor-pointer flex justify-start space-x-3">
    <input
      name={field}
      type="checkbox"
      class="checkbox"
      bind:checked={$value}
      class:input-error={$errors}
      {...$constraints}
      {...$$restProps}
    />
    <div class="label">
      {#if $errors}
        <span class="label-text-alt text-error">{$errors}</span>
      {:else if helperText}
        <span
          class="label-text-alt text-base-content/80 first-letter:uppercase"
          class:text-success={helperTextStatus === 'success'}
          class:text-warning={helperTextStatus === 'warning'}
          class:text-error={helperTextStatus === 'error'}>{helperText}</span
        >
      {/if}
    </div>
  </label>
</div>
