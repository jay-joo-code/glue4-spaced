<script lang="ts">
  import type { SelectListing } from '$root/src/db/schema';
  import listingTitle from '$lib/util/listingTitle';
  import listingLocation from '$lib/util/listingLocation';
  import listingDateRange from '$lib/util/listingDateRange';
  import { IconCalendar, IconEditPen, IconMap, IconNewTab } from '@glue/ui';
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
  {#if currentUserId === listing.userId}
    <div class="grid grid-cols-10 gap-4 py-3 md:px-3 rounded-xl">
      <div class="col-span-4">
        <img
          class="w-full object-cover rounded-lg max-h-[180px] {!isAvailable && 'opacity-60'}"
          src={listing.photoUrls[0]}
        />
      </div>

      <div class="col-span-6 flex flex-col justify-between items-start">
        <div class="">
          <h2 class="font-extrabold sm:text-2xl">{listing.address}</h2>
          <div class="flex space-x-2 items-center mt-2 text-base-content/80">
            <IconCalendar />
            <p class="text-xs tracking-wider sm:text-sm">
              {listingDateRange(listing)}
            </p>
          </div>

          <div class="flex items-center space-x-2 sm:space-x-3 mt-3 sm:mt-4">
            <a href="/edit/{listing.id}">
              <button class="btn btn-xs sm:btn-sm btn-outline btn-secondary"
                ><IconEditPen /> Edit</button
              >
            </a>
            <a href="/listing/{listing.id}" target="_blank" rel="noreferrer">
              <button class="btn btn-xs sm:btn-sm btn-outline btn-secondary"
                >Visit <IconNewTab /></button
              >
            </a>
          </div>
        </div>

        <div
          class="form-control mt-4 bg-base-200 inline-block py-1 px-3 rounded-xl"
          on:click={(event) => event.stopImmediatePropagation()}
        >
          <label class="label p-0 cursor-pointer flex justify-start space-x-2">
            <input
              type="checkbox"
              class="toggle toggle-xs sm:toggle-sm"
              bind:checked={isAvailable}
              class:toggle-success={isAvailable}
              on:input={handleIsAvailableChange}
            />
            <div class="">
              <span class="label-text tracking-wide font-medium"
                >{isAvailable ? 'Available' : 'Sold'}</span
              >
            </div>
          </label>
        </div>
      </div>
    </div>
  {:else}
    <a href="/listing/{listing.id}">
      <div class="grid grid-cols-10 gap-4 hover:bg-base-200 rounded-xl py-3 md:px-3">
        <div class="col-span-4">
          <img
            class="w-full object-cover rounded-lg max-h-[180px] {!isAvailable && 'opacity-60'}"
            src={listing.photoUrls[0]}
          />
        </div>

        <div class="col-span-6 flex flex-col justify-between">
          <div class="">
            <h2 class="font-extrabold text-xl sm:text-2xl">
              {listingTitle(listing)}
            </h2>
            <div class="flex items-center mt-1 sm:mt-3 text-base-content/80 text-xs sm:text-sm">
              <span class="hidden sm:block mr-2">
                <IconMap />
              </span>
              <p class="first-letter:uppercase">
                {listingLocation(listing.lat, listing.lng, listing.minsToOrg, 'cornell')}
              </p>
            </div>
            <div class="flex items-center mt-1 sm:mt-2 text-base-content/80 text-xs sm:text-sm">
              <span class="hidden sm:block mr-2">
                <IconCalendar />
              </span>
              <p class="tracking-wider">
                {listingDateRange(listing)}
              </p>
            </div>
          </div>

          <div class="flex justify-between items-center mt-4">
            <p class="sm:text-xl">
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
    </a>
  {/if}
{/if}
