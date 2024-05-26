<script lang="ts">
  import type { DndEvent, Item } from 'svelte-dnd-action';
  import { dndzone } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';

  export let photoItems: Item[];
  export let firebase: any;
  export let handleFileUpload: (files: FileList) => Promise<Item[]>;

  let isLoading = false;

  const flipDurationMs = 300;

  function handleDndConsider(event: CustomEvent<DndEvent<Item>>) {
    photoItems = event.detail.items;
  }
  function handleDndFinalize(event: CustomEvent<DndEvent<Item>>) {
    photoItems = event.detail.items;
  }

  const onFileUpload = async (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
    if (event.currentTarget.files) {
      isLoading = true;
      photoItems = await handleFileUpload(event.currentTarget.files);
      isLoading = false;
    }
  };
</script>

<div class="flex space-x-6 items-center mt-6">
  <input
    type="file"
    class="file-input file-input-bordered w-full max-w-xs"
    on:input={onFileUpload}
  />
  {#if isLoading}
    <span class="loading loading-spinner loading-sm"></span>
  {/if}
</div>

<div
  class="grid grid-cols-2 gap-4 mt-8 !outline-none"
  use:dndzone={{ items: photoItems, flipDurationMs }}
  on:consider={handleDndConsider}
  on:finalize={handleDndFinalize}
>
  {#each photoItems as item (item.id)}
    <div class="relative" animate:flip={{ duration: flipDurationMs }}>
      <img
        class="object-cover w-full h-48 sm:h-52 lg:h-64 rounded-lg border border-base-content/10 hover:shadow-xl hover:opacity-70"
        src={item.id}
      />
      <button
        class="absolute -right-2 -top-2 btn-xs text-[0.9rem] btn btn-circle pb-1 border border-base-content/10"
        on:click={(event) => {
          photoItems = photoItems.filter((existingItem) => existingItem.id !== item.id);
        }}
      >
        <!-- NOTE: Using svg in children of dnd action throws errors -->
        <!-- https://github.com/isaacHagoel/svelte-dnd-action/issues/557 -->
        x
      </button>
    </div>
  {/each}
</div>
