<script lang="ts" generics="T extends Record<string, unknown>">
  import {
    formFieldProxy,
    type FormFieldProxy,
    type FormPathLeaves,
    type SuperForm
  } from 'sveltekit-superforms';

  export let superform: SuperForm<T>;
  export let field: FormPathLeaves<T, boolean>;

  const { value, errors, constraints } = formFieldProxy(
    superform,
    field
  ) satisfies FormFieldProxy<boolean>;
  $: label = field.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
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
    <span class="label-text first-letter:uppercase font-medium">{label}</span>
  </label>
</div>
