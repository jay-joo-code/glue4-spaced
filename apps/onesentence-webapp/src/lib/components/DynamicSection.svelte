<script lang="ts">
  import Grid from 'svelte-grid';
  import debounce from 'just-debounce-it';
  import { currentUser, pb } from '../glue/pocketbase';
  import {
    IconAdd,
    IconTextAlignRight,
    IconTextAlignLeft,
    IconTextAlignCenter,
    IconSettings,
    IconDelete,
    IconAddItem
  } from '@glue/ui';
  import { page } from '$app/stores';
  import { invalidateAll } from '$app/navigation';
  import { toast } from '@zerodevx/svelte-toast';
  import gridHelp from 'svelte-grid/build/helper/index.mjs';
  import { onMount } from 'svelte';

  export let section;
  export let nextSectionOrder;
  export let isLastSection;

  let selectedItemId: string | null = null;
  let items = [];
  const COL_COUNT = 24; // TODO: make responsive
  let container;
  let isAddSectionLoading = false;
  let isDeleteSectionLoading = false;
  let isAddItemLoading = false;

  onMount(() => {
    parseItems();
  });

  const parseItems = () => {
    items = section?.expand
      ? section?.expand['items(section)']?.map((item) => ({
          ...item,
          ...item.position
        })) || []
      : [];
  };

  const updateSelectedItemStyles = ({ styleKey, styleValue }) => {
    items = items.map((item) => {
      if (item.id !== selectedItemId) return item;

      item.styles[styleKey] = styleValue;
      pb.collection('items').update(selectedItemId, {
        styles: item.styles
      });
      pb.collection;
      return item;
    });
  };

  const debouncedUpdateItem = debounce(({ itemId, data }) => {
    pb.collection('items').update(itemId, data);
  }, 500);

  const debouncedUpdateMovedItem = debounce((event) => {
    const updatedItem = event.detail.unsafeItem;
    pb.collection('items').update(updatedItem.id, {
      position: {
        ...updatedItem.position,
        [COL_COUNT]: updatedItem[COL_COUNT]
      }
    });
  }, 500);

  const handleAddSection = async () => {
    isAddSectionLoading = true;
    const order = nextSectionOrder
      ? Math.floor(section?.order + (nextSectionOrder - section?.order) / 2)
      : section?.order + 1000;
    await pb.collection('sections').create({
      project: section?.project,
      user: $currentUser?.id,
      path: $page.url.pathname,
      order,
      template: null
    });
    await invalidateAll();
    isAddSectionLoading = false;
  };

  const handleDeleteSection = async () => {
    isDeleteSectionLoading = true;
    if (isLastSection) {
      toast.push("You can't delete the only section on the page");
    } else {
      await pb.collection('sections').delete(section?.id);
      await invalidateAll();
    }
    isDeleteSectionLoading = false;
  };

  const addItem = async ({ variant }) => {
    isAddItemLoading = true;

    switch (variant) {
      case 'TEXT': {
        await pb.collection('items').create({
          user: $currentUser?.id,
          section: section?.id,
          variant,
          value: 'Text',
          position: {
            [COL_COUNT]: gridHelp.item({
              x: 12,
              y: 2,
              h: 1,
              w: 2
            })
          },
          styles: {}
        });
      }
    }
    await invalidateAll();
    parseItems();

    isAddItemLoading = false;
  };
</script>

<div
  class="border border-transparent hover:border-blue-400 w-full min-h-[80vh] group relative"
  on:click={() => {
    selectedItemId = null;
  }}
  bind:this={container}
>
  <Grid
    bind:items
    gap={[11, 11]}
    rowHeight={30}
    let:item
    let:dataItem
    cols={[[1100, COL_COUNT]]}
    fastStart={true}
    sensor={100}
    on:change={debouncedUpdateMovedItem}
    scroller={container}
  >
    <div class="w-full h-full">
      {#if dataItem?.variant === 'TEXT'}
        <p
          class="{dataItem?.styles
            ? Object.values(dataItem?.styles)?.join(' ')
            : ''} focus:border-blue-400 border border-transparent w-full rounded p-2"
          contenteditable={true}
          on:click={(event) => {
            selectedItemId = dataItem.id;
            event.stopPropagation();
          }}
          on:input={(event) => {
            debouncedUpdateItem({
              itemId: dataItem?.id,
              data: {
                value: event?.currentTarget?.textContent
              }
            });
          }}
        >
          {dataItem.value}
        </p>
      {/if}
    </div>
  </Grid>

  <!-- add section button -->
  <div class="absolute bottom-[-16px] hidden group-hover:flex left-0 right-0 justify-center">
    <div class="bg-base-100">
      <button
        class="btn btn-sm btn-primary"
        on:click={handleAddSection}
        disabled={isAddSectionLoading}
      >
        {#if isAddSectionLoading}
          <span class="loading loading-spinner loading-xs" />
        {:else}
          <IconAdd />
        {/if}
        Add section</button
      >
    </div>
  </div>

  <!-- top right toolbar -->
  <div class="absolute top-4 hidden group-hover:flex right-4 justify-center items-center space-x-3">
    <div class="bg-base-100">
      <div class="dropdown dropdown-end">
        <div
          class="btn btn-primary text-2xl btn-sm py-2 h-[unset] mb-2"
          tabindex="0"
          role="button"
          disabled={isAddItemLoading || undefined}
        >
          {#if isAddItemLoading}
            <span class="loading loading-spinner" />
          {:else}
            <IconAddItem />
          {/if}
        </div>
        <ul
          tabindex="0"
          class="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-48"
        >
          <li>
            <button
              on:click={() => {
                addItem({ variant: 'TEXT' });
              }}
              disabled={isAddItemLoading}
            >
              Text
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div class="bg-base-100">
      <div class="dropdown dropdown-end">
        <div
          class="btn btn-primary text-2xl btn-sm py-2 h-[unset] mb-2"
          tabindex="0"
          role="button"
          disabled={isDeleteSectionLoading || undefined}
        >
          {#if isDeleteSectionLoading}
            <span class="loading loading-spinner" />
          {:else}
            <IconSettings />
          {/if}
        </div>
        <ul
          tabindex="0"
          class="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-48"
        >
          <li>
            <button
              class={isDeleteSectionLoading ? 'text-base-content/60' : 'text-error'}
              on:click={handleDeleteSection}
              disabled={isDeleteSectionLoading}
            >
              <IconDelete />
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- edit styles panel -->
{#if selectedItemId}
  <div class="fixed right-4 top-[50%] -translate-y-1/2 z-20">
    <div class="px-4 pt-2 pb-6 shadow bg-base-300 rounded w-52 border border-base-content/20">
      <h3 class="uppercase text-sm font-extrabold mt-5 mb-2 ml-1 text-base-content/80">Text</h3>
      <button
        class="btn my-0.5 btn-block text-left justify-start btn-sm pl-2"
        on:click={(event) => {
          updateSelectedItemStyles({ styleKey: 'fontSize', styleValue: 'text-7xl' });
        }}
        >Heading 1
      </button>
      <button
        class="btn my-0.5 btn-block text-left justify-start btn-sm pl-2"
        on:click={() => {
          updateSelectedItemStyles({ styleKey: 'fontSize', styleValue: 'text-3xl' });
        }}>Heading 2</button
      >
      <button
        class="btn my-0.5 btn-block text-left justify-start btn-sm pl-2"
        on:click={() => {
          updateSelectedItemStyles({ styleKey: 'fontSize', styleValue: 'text-md' });
        }}>Body</button
      >
      <button
        class="btn my-0.5 btn-block text-left justify-start btn-sm pl-2"
        on:click={() => {
          updateSelectedItemStyles({ styleKey: 'fontSize', styleValue: 'text-sm' });
        }}>Meta</button
      >

      <h3 class="uppercase text-sm font-extrabold mt-5 mb-2 ml-1 text-base-content/80">
        Text Align
      </h3>
      <div class="flex items-center space-x-2">
        <button
          class="btn btn-sm text-xl"
          on:click={() => {
            updateSelectedItemStyles({ styleKey: 'textAlign', styleValue: 'text-left' });
          }}><IconTextAlignLeft /></button
        >
        <button
          class="btn btn-sm text-xl"
          on:click={() => {
            updateSelectedItemStyles({ styleKey: 'textAlign', styleValue: 'text-center' });
          }}><IconTextAlignCenter /></button
        >
        <button
          class="btn btn-sm text-xl"
          on:click={() => {
            updateSelectedItemStyles({ styleKey: 'textAlign', styleValue: 'text-right' });
          }}><IconTextAlignRight /></button
        >
      </div>
    </div>
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
