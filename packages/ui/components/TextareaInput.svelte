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
  export let isHideLabel: boolean = false;

  const { value, errors, constraints } = formFieldProxy(
    superform,
    field
  ) satisfies FormFieldProxy<string>;
</script>

<label class="form-control w-full max-w-xs">
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
    class="textarea textarea-bordered w-full"
    class:input-error={$errors}
    {...$constraints}
    {...$$restProps}
  />
  <div class="label">
    {#if $errors}<span class="label-text-alt text-error">{$errors}</span>{/if}
  </div>
</label>
