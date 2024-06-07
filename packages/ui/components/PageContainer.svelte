<script lang="ts">
  import { browser } from '$app/environment';
  import { onDestroy, onMount } from 'svelte';
  import { invalidateAll } from '$app/navigation';

  export let APP_NAME: string;
  export let title: string;
  export let layout: 'mobile-only' | 'aside-main' | 'fullscreen' = 'mobile-only';
  export let isHoriPadding = true;
  export let isVertPadding = true;
  export let limitWidth = true;
  export let isInvalidateOnFocus = true;
  export let isMinHeight = true;

  onMount(() => {
    if (isInvalidateOnFocus) {
      window.addEventListener('gluefocus', () => {
        invalidateAll();
      });
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('gluefocus', () => {
        invalidateAll();
      });
    }
  });
</script>

<svelte:head>
  <title>{title ? `${title} | ` : ''}{APP_NAME}</title>
</svelte:head>
{#if layout === 'mobile-only'}
  <div class="flex justify-center">
    <div
      class="{$$props.class} w-full {isHoriPadding && 'px-4 md:px-8'} {isVertPadding &&
        'pt-6 md:pt-12 pb-8'} {limitWidth && 'max-w-7xl'} {isMinHeight && 'min-h-[80vh]'}"
    >
      <slot />
    </div>
  </div>
{:else if layout === 'aside-main'}
  <!-- aside main layout: should only have 2 top level children -->
  <div class="w-full {limitWidth && 'flex justify-center'}">
    <div
      class="{$$props.class} flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 {limitWidth &&
        'w-full max-w-7xl'} {isHoriPadding && 'px-4 md:px-8'} {isVertPadding &&
        'pt-6 md:pt-12 pb-8'} {isMinHeight && 'min-h-[80vh]'}"
    >
      <slot />
    </div>
  </div>
{:else if layout === 'fullscreen'}
  <div class="{$$props.class} w-full {isMinHeight && 'min-h-[80vh]'}">
    <slot />
  </div>
{/if}
