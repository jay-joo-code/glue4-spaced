<script lang="ts" generics="T extends Record<string, unknown>">
  import {
    formFieldProxy,
    type SuperForm,
    type FormPathLeaves,
    type FormFieldProxy
  } from 'sveltekit-superforms';

  export let superform: SuperForm<T>;
  export let field: FormPathLeaves<T, number>;

  const { value, errors, constraints } = formFieldProxy(
    superform,
    field
  ) satisfies FormFieldProxy<number>;
  $: label = field.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
</script>

<label class="form-control w-full max-w-xs">
  <div class="label">
    <span class="label-text first-letter:uppercase">{label}</span>
  </div>
  <input
    name={field}
    type="number"
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
