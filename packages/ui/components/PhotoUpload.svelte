<script lang="ts">
  import { flip } from 'svelte/animate';
  import { dndzone } from 'svelte-dnd-action';
  import { uploadFile } from '@glue/utils';
  import type { DndEvent, Item } from 'svelte-dnd-action';

  export let photoItems: Item[];
  export let firebase: any;

  const flipDurationMs = 300;

  function handleDndConsider(event: CustomEvent<DndEvent<Item>>) {
    photoItems = event.detail.items;
  }
  function handleDndFinalize(event: CustomEvent<DndEvent<Item>>) {
    photoItems = event.detail.items;
  }

  const handleFileUpload = async (
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    if (event.currentTarget.files) {
      const uploadPromises = Array.from(event.currentTarget.files).map((file) =>
        uploadFile(file, '/v2', firebase)
      );
      const urls = await Promise.all(uploadPromises);
      photoItems = [...photoItems, ...urls.map((url) => ({ id: url }))];
    }
  };
</script>

<input
  type="file"
  class="file-input file-input-bordered w-full max-w-xs mt-6"
  on:input={handleFileUpload}
/>

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
        class="absolute -right-2 -top-2 btn-xs text-[0.9rem] btn btn-circle pb-1"
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
