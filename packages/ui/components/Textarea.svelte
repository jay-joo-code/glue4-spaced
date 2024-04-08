<script lang="ts">
  import type { InputConstraint } from 'sveltekit-superforms';

  export let value: string | number;
  export let label: string | undefined = undefined;
  export let errors: string[] | undefined = undefined;
  export let constraints: InputConstraint | undefined = undefined;
</script>

<div class="form-control w-full">
  {#if label}
    <label class="label">
      <span class="label-text">{label}</span>
    </label>
  {/if}
  <textarea
    bind:value
    aria-invalid={errors ? 'true' : undefined}
    {...constraints}
    {...$$restProps}
    class="{$$props.class} textarea h-24 w-full text-base placeholder:text-sm textarea-bordered"
    class:input-error={errors?.length > 0}
  />
  {#if errors}
    <label class="label">
      <span class="label-text-alt text-error">{errors}</span>
    </label>
  {/if}
</div>
