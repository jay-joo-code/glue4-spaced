<script lang="ts">
  import type { SelectListing } from '$root/src/db/schema';
  import listingTitle from '$lib/util/listingTitle';
  import listingLocation from '$lib/util/listingLocation';
  import listingDateRange from '$lib/util/listingDateRange';
  import { IconCalendar, IconMap, IconNewTab } from '@glue/ui';
  import { formatDistanceToNowStrict } from 'date-fns';

  export let listing: SelectListing;
  export let currentUserId: string | undefined;

  let isAvailable = !listing.isSold;

  const handleIsAvailableChange = async (event: Event & { currentTarget: HTMLInputElement }) => {
    fetch(`/api/listing/${listing.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isSold: !event.currentTarget.checked
      })
    });
  };
</script>

{#if listing}
  <a href={currentUserId === listing.userId ? `/edit/${listing.id}` : `/listing/${listing.id}`}>
    <div class="grid grid-cols-10 gap-4">
      <div class="col-span-4">
        <img class="w-full object-cover rounded-lg" src={listing.photoUrls[0]} />
      </div>

      <div class="col-span-6 flex flex-col justify-between">
        {#if currentUserId === listing.userId}
          <div class="">
            <h2 class="font-extrabold">{listing.address}</h2>
            <div class="flex space-x-2 items-center mt-2 text-base-content/80">
              <IconCalendar />
              <p class="text-xs tracking-wider">
                {listingDateRange(listing)}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 justify-start">
            <div class="form-control">
              <label class="label p-0 cursor-pointer flex justify-start space-x-2">
                <input
                  type="checkbox"
                  class="toggle toggle-xs"
                  bind:checked={isAvailable}
                  class:toggle-success={isAvailable}
                  on:input={handleIsAvailableChange}
                  on:click={(event) => event.stopImmediatePropagation()}
                />
                <div class="">
                  <span class="label-text tracking-wide font-medium"
                    >{isAvailable ? 'Available' : 'Sold'}</span
                  >
                </div>
              </label>
            </div>

            {#if isAvailable}
              <a href="/listing/${listing.id}" target="_blank" rel="noreferrer">
                <button class="btn btn-xs btn-outline btn-secondary">Visit <IconNewTab /></button>
              </a>
            {/if}
          </div>
        {:else}
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
        {/if}
      </div>
    </div>
  </a>
{/if}
