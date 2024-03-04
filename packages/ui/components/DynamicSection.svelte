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
        w: 10
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
        y: 14,
        w: 10
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
    <Grid bind:items gap={[11, 11]} rowHeight={40} let:item let:dataItem cols={[[1100, 24]]}>
      <div class="hover:border-blue-400 border border-transparent w-full h-full">
        <div
          class="border-2 border-transparent hover:border-blue-400 w-full"
          contenteditable={true}
        >
          <h2 class={Object.values(dataItem?.styles)?.join(' ')}>
            {dataItem.value}
          </h2>
        </div>
      </div>
    </Grid>
  </div>
{/if}
