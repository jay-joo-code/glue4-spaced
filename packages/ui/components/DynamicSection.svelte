<script lang="ts">
  export let section;
  $: console.log('section', section);
</script>

{#if section}
  <div
    class="border border-blue-500 w-full grid-container"
    style="--desktop-row-count:{section?.desktopRowCount};"
  >
    <!-- TODO: responsive row count -->
    {#each [...Array(section?.desktopRowCount * 26).keys()] as _}
      <div class="border border-base-content/10 rounded"></div>
    {/each}
  </div>
{/if}

<style scoped>
  .grid-container {
    display: grid;
    row-gap: 11px;
    column-gap: 11px;

    /* desktop */
    --grid-gutter: calc(var(--sqs-site-gutter, 4vw) - 11px);
    --cell-max-width: calc((var(--sqs-site-max-width, 1500px) - (11px * 23)) / 24);
    --inset-padding: 0vw;
    --container-width: min(
      var(--sqs-site-max-width, 1500px),
      calc(100vw - var(--sqs-site-gutter, 4vw) * 2 - var(--inset-padding))
    );

    /* TODO: --mobile-row-count */
    grid-template-rows: repeat(
      var(--desktop-row-count),
      minmax(calc(var(--container-width) * 0.0215), auto)
    );
    grid-template-columns:
      minmax(var(--grid-gutter), 1fr) repeat(24, minmax(0, var(--cell-max-width)))
      minmax(var(--grid-gutter), 1fr);
  }
</style>
