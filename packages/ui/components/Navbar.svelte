<script lang="ts">
  export let appName: string;
  export let sitemap = [];
  export let actionButtons = [];
</script>

<div class="navbar bg-base-100 z-20 relative">
  <div class="navbar-start">
    <!-- mobile burger nav -->
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn btn-ghost md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h8m-8 6h16"
          /></svg
        >
      </div>

      <ul
        tabindex="0"
        class="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 w-52 rounded-box"
      >
        {#each sitemap as navElt}
          {#if navElt?.isParent}
            <li>
              <a>{navElt?.label}</a>
              <ul class="p-2">
                {#each navElt?.children as childNavElt}
                  <li><a href={childNavElt?.href}>{childNavElt?.label}</a></li>
                {/each}
              </ul>
            </li>
          {:else}
            <li><a href={navElt?.href}>{navElt?.label}</a></li>
          {/if}
        {/each}
      </ul>
    </div>

    <a class="btn btn-ghost px-1 text-xl" href="/">{appName}</a>
  </div>

  <!-- desktop -->
  <div class="navbar-center hidden md:flex">
    <ul class="menu menu-horizontal px-1">
      {#each sitemap as navElt}
        {#if navElt?.isParent}
          <li>
            <details>
              <summary>{navElt?.label}</summary>
              <ul class="menu p-2">
                {#each navElt?.children as childNavElt}
                  <li><a href={childNavElt?.href}>{childNavElt?.label}</a></li>
                {/each}
              </ul>
            </details>
          </li>
        {:else}
          <li><a href={navElt?.href}>{navElt?.label}</a></li>
        {/if}
      {/each}
    </ul>
  </div>

  <div class="navbar-end">
    <a class="btn">Button</a>
  </div>
</div>
