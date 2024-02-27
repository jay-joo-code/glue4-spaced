<script lang="ts">
  export let cpOverline;
  export let cpTitle;
  export let cpDesc;
</script>

<div class="w-screen flex flex-col justify-center items-center max-w-full aspect-video">
  {#if cpOverline}
    <p class="text-sm font-bold mb-4">
      {cpOverline?.label}
    </p>
  {/if}

  {#if cpTitle}
    <p class="text-2xl font-extrabold tracking-wide">
      {cpTitle?.label}
    </p>
  {/if}

  {#if cpDesc}
    <p class="mt-4 font-bold">{cpDesc?.label}</p>
  {/if}
</div>
