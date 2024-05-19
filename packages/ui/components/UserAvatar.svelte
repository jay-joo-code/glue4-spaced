<script lang="ts">
  import { IconPerson } from '@glue/ui';
  import type { Nav } from '@glue/types';

  export let user;
  export let AVATAR_NAVS: Nav[];
</script>

{#if user}
  <div class="dropdown-end dropdown">
    <label tabindex="0" class="btn-ghost btn-square btn">
      <div class="placeholder avatar">
        <div
          class="w-8 rounded-full bg-neutral-focus text-neutral-content ring-2 ring ring-primary ring-offset-2 ring-offset-base-100"
        >
          {#if user.avatarUrl}
            <img src={user.avatarUrl} />
          {:else if user.firstName}
            <span class="text-sm">{user.firstName.charAt(0)}</span>
          {:else}
            <span class="text-sm"><IconPerson /></span>
          {/if}
        </div>
      </div>
    </label>
    <ul
      tabindex="0"
      class="menu-compact dropdown-content menu rounded-box mt-3 w-52 bg-base-200 p-2 shadow"
    >
      {#each AVATAR_NAVS as nav}
        <li>
          <a href={nav.href}>
            {nav.label}
          </a>
        </li>
      {/each}
    </ul>
  </div>
{/if}
