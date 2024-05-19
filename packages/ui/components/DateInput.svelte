<script lang="ts" generics="T extends Record<string, unknown>">
  import {
    formFieldProxy,
    type FormFieldProxy,
    type FormPathLeaves,
    type SuperForm
  } from 'sveltekit-superforms';

  export let superform: SuperForm<T>;
  export let field: FormPathLeaves<T, string>;
  export let label: string = undefined;

  const { value, errors, constraints } = formFieldProxy(
    superform,
    field
  ) satisfies FormFieldProxy<string>;
</script>

<label class="form-control w-full max-w-xs">
  {#if label}
    <div class="label">
      <span class="label-text first-letter:uppercase">{label}</span>
    </div>
  {/if}
  <input
    name={field}
    type="date"
    aria-invalid={$errors ? 'true' : undefined}
    bind:value={$value}
    class="input input-bordered w-full max-w-xs"
    class:input-error={$errors}
    {...$constraints}
    {...$$restProps}
  />
  <div class="label">
    {#if $errors}<span class="label-text-alt text-error">{$errors}</span>{/if}
  </div>
</label>
