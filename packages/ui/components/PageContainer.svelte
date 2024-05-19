<script lang="ts">
  export let APP_NAME: string;
  export let title: string;
  export let layout: 'mobile-only' | 'aside-main' | 'fullscreen' = 'mobile-only';
  export let isHoriPadding = true;
  export let isVertPadding = true;
  export let limitWidth = true;
</script>

<svelte:head>
  <title>{title ? `${title} | ` : ''}{APP_NAME}</title>
</svelte:head>
{#if layout === 'mobile-only'}
  <div class="flex justify-center">
    <div
      class="{$$props.class} w-full {isHoriPadding && 'px-4'} {isVertPadding &&
        'pt-12 pb-8'} {limitWidth && 'max-w-2xl'}"
    >
      <slot />
    </div>
  </div>
{:else if layout === 'aside-main'}
  <!-- aside main layout: should only have 2 top level children -->
  <div class="w-full {limitWidth && 'flex justify-center'}">
    <div
      class="{$$props.class} flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 {limitWidth &&
        'w-full max-w-4xl'} {isHoriPadding && 'px-4'} {isVertPadding && 'pt-12 pb-8'}"
    >
      <slot />
    </div>
  </div>
{:else if layout === 'fullscreen'}
  <div class="{$$props.class} w-full">
    <slot />
  </div>
{/if}
