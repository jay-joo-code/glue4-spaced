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
  export let isHideLabel: boolean = false;
  export let helperText: string = undefined;

  const { value, errors, constraints } = formFieldProxy(
    superform,
    field
  ) satisfies FormFieldProxy<boolean>;
</script>

<div class="form-control">
  <label class="label cursor-pointer flex justify-start space-x-5">
    <input
      name={field}
      type="checkbox"
      class="toggle"
      bind:checked={$value}
      class:input-error={$errors}
      class:toggle-success={$value}
      {...$constraints}
      {...$$restProps}
    />
    <div class="">
      {#if !isHideLabel && label}
        <div class="">
          <span class="label-text font-extrabold first-letter:uppercase">{label}</span>
        </div>
      {/if}
      {#if helperText}
        <div class="">
          <span class="label-text-alt text-base-content/80 first-letter:uppercase"
            >{helperText}</span
          >
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
