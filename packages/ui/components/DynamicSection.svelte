<script lang="ts">
  import Grid from 'svelte-grid';
  import gridHelp from 'svelte-grid/build/helper/index.mjs';
  import { clickOutsideAction } from '@glue/utils';

  export let section;

  let selectedItemId = null;
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

  const updateSelectedItemStyles = ({ styleKey, styleValue }) => {
    items = items.map((item) => {
      if (item.id !== selectedItemId) return item;
      item.styles[styleKey] = styleValue;
      return item;
    });
  };
</script>

{#if section}
  <div class="border border-transparent hover:border-blue-400 w-full min-h-[80vh]">
    <Grid bind:items gap={[11, 11]} rowHeight={30} let:item let:dataItem cols={[[1100, 24]]}>
      <div class="w-full h-full">
        <div
          class="focus:border-blue-400 border border-transparent w-full rounded p-1"
          contenteditable={true}
          on:focus={() => {
            // HACK: setTimeout used to run after outside click handler
            setTimeout(() => {
              selectedItemId = dataItem.id;
            });
          }}
        >
          <h2 class={Object.values(dataItem?.styles)?.join(' ')}>
            {dataItem.value}
          </h2>
        </div>
      </div>
    </Grid>
  </div>

  <!-- edit styles panel -->
  {#if selectedItemId}
    <div
      class="fixed right-4 top-[50%] -translate-y-1/2 z-20"
      use:clickOutsideAction
      on:click_outside={() => {
        selectedItemId = null;
      }}
    >
      <div class="px-4 py-6 shadow bg-base-300 rounded-box w-52 border border-base-content/20">
        <h3 class="uppercase text-sm font-extrabold mb-3 ml-1 text-base-content/80">Text</h3>
        <button
          class="btn btn-ghost btn-block text-left justify-start btn-sm pl-1"
          on:click={(event) => {
            updateSelectedItemStyles({ styleKey: 'fontSize', styleValue: 'text-7xl' });
          }}
          >Heading 1
        </button>
        <button
          class="btn btn-ghost btn-block text-left justify-start btn-sm pl-1"
          on:click={() => {
            updateSelectedItemStyles({ styleKey: 'fontSize', styleValue: 'text-3xl' });
          }}>Heading 2</button
        >
        <button
          class="btn btn-ghost btn-block text-left justify-start btn-sm pl-1"
          on:click={() => {
            updateSelectedItemStyles({ styleKey: 'fontSize', styleValue: 'text-md' });
          }}>Body</button
        >
        <button
          class="btn btn-ghost btn-block text-left justify-start btn-sm pl-1"
          on:click={() => {
            updateSelectedItemStyles({ styleKey: 'fontSize', styleValue: 'text-sm' });
          }}>Meta</button
        >
      </div>
    </div>
  {/if}
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
