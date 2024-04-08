<script lang="ts">
  import type { InputConstraint } from 'sveltekit-superforms';

  export let value: string;
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
  <input
    type="text"
    bind:value
    aria-invalid={errors ? 'true' : undefined}
    {...constraints}
    {...$$restProps}
    class="{$$props.class} input-bordered input w-full"
    class:input-error={errors?.length > 0}
  />
  {#if errors}
    <label class="label">
      <span class="label-text-alt text-error">{errors}</span>
    </label>
  {/if}
</div>
