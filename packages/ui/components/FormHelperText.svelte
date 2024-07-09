<script lang="ts">
  import type { HelperText, HelperTextStatus } from '@glue/types';
  import { type SuperForm } from 'sveltekit-superforms';

  export let helperText: HelperText;
  export let helperTextStatus: HelperTextStatus;
  export let superform: SuperForm<any>;

  const { form } = superform;

  $: displayText =
    $form && typeof helperText === 'function' ? helperText({ superform }) : helperText;
</script>

<span
  class="label-text-alt text-base-content/80 first-letter:uppercase leading-relaxed leading-relaxed"
  class:text-success={helperTextStatus === 'success'}
  class:text-warning={helperTextStatus === 'warning'}
  class:text-error={helperTextStatus === 'error'}
>
  {displayText}
</span>
