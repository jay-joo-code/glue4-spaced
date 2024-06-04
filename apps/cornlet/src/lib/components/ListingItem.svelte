<script lang="ts">
  import type { SelectListing } from '$root/src/db/schema';
  import listingTitle from '$lib/util/listingTitle';
  import listingLocation from '$lib/util/listingLocation';
  import listingDateRange from '$lib/util/listingDateRange';
  import { IconCalendar, IconMap } from '@glue/ui';
  import { formatDistanceToNowStrict } from 'date-fns';

  export let listing: SelectListing;
</script>

{#if listing}
  <div class="grid grid-cols-10 gap-4">
    <div class="col-span-4">
      <img class="w-full object-cover rounded-lg" src={listing.photoUrls[0]} />
    </div>

    <div class="col-span-6 flex flex-col justify-between">
      <div class="">
        <h2 class="font-extrabold text-xl">
          {listingTitle(listing)}
        </h2>
        <div class="flex space-x-2 items-center mt-2 text-base-content/80">
          <IconMap />
          <p class="text-xs text-base-content/80 first-letter:uppercase">
            {listingLocation(listing.lat, listing.lng, listing.minsToOrg, 'cornell')}
          </p>
        </div>
        <div class="flex space-x-2 items-center mt-2 text-base-content/80">
          <IconCalendar />
          <p class="text-xs tracking-wider">
            {listingDateRange(listing)}
          </p>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <p class="">
          <span class="font-extrabold">${listing.price}</span>
          <span class="font-medium text-base-content/80">/ month</span>
        </p>
        {#if listing.updatedAt}
          <p class="text-xs text-base-content/80">
            {formatDistanceToNowStrict(new Date(listing.updatedAt))} ago
          </p>
        {/if}
      </div>
    </div>
  </div>
{/if}
