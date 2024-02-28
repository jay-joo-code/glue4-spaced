<script lang="ts">
  export let cpOverline;
  export let cpTitle;
  export let cpDesc;
</script>

<div class="w-screen flex flex-col justify-center items-center max-w-full aspect-video">
  <div class="text-center w-2/3 flex flex-col items-center">
    {#if cpOverline}
      <div class=" flex items-center justify-center mb-4">
        <div class="py-2 px-6 rounded-full border border-base-content/10">
          <p class="text-xs text-base-content/70 font-semibold">
            {cpOverline?.label}
          </p>
        </div>
      </div>
    {/if}

    {#if cpTitle}
      <p class="text-4xl font-extrabold tracking-wide leading-normal">
        {cpTitle?.label}
      </p>
    {/if}

    {#if cpDesc}
      <div class="mt-4 w-[80%]">
        <p class="font-medium text-base-content/70 text-sm leading-normal">{cpDesc?.label}</p>
      </div>
    {/if}
  </div>
</div>
