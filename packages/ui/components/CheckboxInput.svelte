<script lang="ts" generics="T extends Record<string, unknown>">
  import {
    formFieldProxy,
    type FormFieldProxy,
    type FormPathLeaves,
    type SuperForm
  } from 'sveltekit-superforms';

  export let superform: SuperForm<T>;
  export let field: FormPathLeaves<T, boolean>;
  export let label: string = undefined;

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
    {#if label}
      <span class="label-text first-letter:uppercase font-medium">{label}</span>
    {/if}
  </label>
</div>
