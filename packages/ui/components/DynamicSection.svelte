<script lang="ts">
  export let section;
  $: console.log('section', section);
</script>

<div class="border border-blue-500 w-full h-full grid-container relative">
  <!-- TODO: responsive row count -->
  {#each [...Array(section?.desktopRowCount).keys()] as count}
    <div class="grid-row-1 bg-base-200"></div>
  {/each}
</div>

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
    grid-template-rows: repeat(41, minmax(calc(var(--container-width) * 0.0215), auto));
    grid-template-columns:
      minmax(var(--grid-gutter), 1fr) repeat(24, minmax(0, var(--cell-max-width)))
      minmax(var(--grid-gutter), 1fr);
  }

  .grid-row-1 {
    grid-area: 1/1/1/-1;
    width: 100%;
  }
</style>
