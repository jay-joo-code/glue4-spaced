<script lang="ts">
  import { IconMap, IconPalette, IconRocket, IconCube } from '@glue/ui';

  export let projectId;
</script>

<div class="absolute top-10 left-0 right-0 flex justify-center">
  <ul class="menu menu-horizontal bg-base-100 rounded-box shadow-2xl border border-base-content/10">
    <li>
      <a href="/sitemap/{projectId}"><span class="text-lg"><IconMap /></span>Sitemap</a>
    </li>
    <li>
      <a href="/design/{projectId}"><span class="text-lg"><IconCube /></span>Design</a>
    </li>
    <li>
      <a href="/theme/{projectId}"><span class="text-lg"><IconPalette /></span>Theme</a>
    </li>
    <li>
      <a href="/publish/{projectId}"><span class="text-lg"><IconRocket /></span>Publish</a>
    </li>
  </ul>
</div>
