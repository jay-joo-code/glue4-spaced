<script lang="ts" generics="T extends Record<string, unknown>">
  import type { HelperTextStatus } from '@glue/types';
  import {
    formFieldProxy,
    type SuperForm,
    type FormPathLeaves,
    type FormFieldProxy
  } from 'sveltekit-superforms';

  export let superform: SuperForm<T>;
  export let field: FormPathLeaves<T, number>;
  export let label: string = undefined;
  export let helperText: string = undefined;
  export let helperTextStatus: HelperTextStatus = undefined;

  const { value, errors, constraints } = formFieldProxy(
    superform,
    field
  ) satisfies FormFieldProxy<number>;
</script>

<label class="form-control w-full">
  {#if label}
    <div class="label">
      <span class="label-text first-letter:uppercase">{label}</span>
    </div>
  {/if}
  <input
    name={field}
    type="number"
    aria-invalid={$errors ? 'true' : undefined}
    bind:value={$value}
    class="input input-bordered w-full"
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
