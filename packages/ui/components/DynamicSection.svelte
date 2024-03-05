<script lang="ts">
  import Grid from 'svelte-grid';
  import gridHelp from 'svelte-grid/build/helper/index.mjs';

  export let section;
  $: console.log('section', section);

  const id = () => '_' + Math.random().toString(36).substr(2, 9);

  let items = [
    {
      24: gridHelp.item({
        x: 2,
        y: 8,
        w: 10,
        h: 1
      }),
      id: id(),
      variant: 'TEXT',
      value: 'The modern way of carpooling',
      styles: {
        fontSize: 'text-7xl',
        fontWeight: 'font-extrabold',
        lineHeight: 'leading-tight'
      }
    },

    {
      24: gridHelp.item({
        x: 2,
        y: 15,
        w: 10,
        h: 1
      }),
      id: id(),
      variant: 'TEXT',
      value:
        'A carpool app facilitates ride-sharing by connecting drivers with passengers heading in the same direction, promoting cost-effective and eco-friendly transportation solutions. Users can schedule rides, split costs, and reduce traffic congestion through this convenient platform.',
      styles: {
        fontSize: 'text-md',
        fontWeight: 'font-normal',
        textColor: 'text-base-content/70',
        lineHeight: 'leading-loose'
      }
    }
  ];

  $: console.log('items', items);
</script>

{#if section}
  <div class="border border-transparent hover:border-blue-600 w-full min-h-[80vh]">
    <Grid bind:items gap={[11, 11]} rowHeight={30} let:item let:dataItem cols={[[1100, 24]]}>
      <div class="w-full h-full">
        <div class="dropdown dropdown-bottom dropdown-end">
          <div
            class="focus:border-blue-400 border border-transparent w-full mb-2 rounded p-1"
            contenteditable={true}
            tabindex="0"
            role="button"
          >
            <h2 class={Object.values(dataItem?.styles)?.join(' ')}>
              {dataItem.value}
            </h2>
          </div>

          <!-- edit styles panel -->
          <ul
            tabindex="0"
            class="dropdown-content z-20 px-4 py-6 shadow bg-base-300 rounded-box w-52 border border-base-content/20"
          >
            <h3 class="uppercase text-sm font-extrabold mb-3 ml-1 text-base-content/80">Text</h3>
            <button
              class="btn btn-ghost btn-block text-left justify-start btn-sm pl-1"
              on:click={() => {
                dataItem.styles.fontSize = 'text-7xl';
              }}>Heading 1</button
            >
            <button
              class="btn btn-ghost btn-block text-left justify-start btn-sm pl-1"
              on:click={() => {
                dataItem.styles.fontSize = 'text-3xl';
              }}>Heading 2</button
            >
            <button
              class="btn btn-ghost btn-block text-left justify-start btn-sm pl-1"
              on:click={() => {
                dataItem.styles.fontSize = 'text-md';
              }}>Body</button
            >
            <button
              class="btn btn-ghost btn-block text-left justify-start btn-sm pl-1"
              on:click={() => {
                dataItem.styles.fontSize = 'text-sm';
              }}>Meta</button
            >
          </ul>
        </div>
      </div>
    </Grid>
  </div>
{/if}

<style>
  :global(.svlt-grid-item) {
    height: unset !important;
  }
  :global(.svlt-grid-shadow) {
    background: oklch(var(--bc)) !important;
    opacity: 0.4;
  }
</style>
