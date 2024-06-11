<script lang="ts">
  import { APP_NAME } from '$root/src/lib/config';
  import listingDateRange from '$root/src/lib/util/listingDateRange';
  import listingLocation from '$root/src/lib/util/listingLocation';
  import listingTitle from '$root/src/lib/util/listingTitle';
  import {
    IconBathroomShower,
    IconCalendar,
    IconChevronLeft,
    IconHome,
    PageContainer
  } from '@glue/ui';
  import { onMount } from 'svelte';
  import { Loader } from '@googlemaps/js-api-loader';
  import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';

  export let data;

  onMount(async () => {
    const loader = new Loader({
      apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly'
    });
    const listing = await data.listing;
    if (listing) {
      loader.importLibrary('maps').then(({ Map, Circle }) => {
        const map = new Map(document.getElementById('map'), {
          center: {
            lat: listing.lat,
            lng: listing.lng
          },
          zoom: 16,
          mapTypeControl: false,
          streetViewControl: false,
          gestureHandling: 'greedy'
        });
        new Circle({
          map,
          strokeColor: '#FF0000',
          strokeOpacity: 0.4,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.1,
          center: {
            lat: listing.lat,
            lng: listing.lng
          },
          radius: 100
        });
      });
    }
  });
</script>

<PageContainer title="View sublet listing" {APP_NAME}>
  {#await data.listing}
    <div class="w-full flex items-center justify-center min-h-[80vh]">
      <span class="loading loading-spinner loading-sm" />
    </div>
  {:then listing}
    {#if listing}
      <button
        class="btn btn-sm"
        on:click={() => {
          history.back();
        }}
      >
        <span class="text-lg">
          <IconChevronLeft />
        </span>
        back</button
      >

      <div class="mt-6">
        <div class="w-full carousel rounded-lg border border-base-content/10">
          {#each listing.photoUrls as photoUrl}
            <div class="carousel-item w-[80%] border-r border-base-content/30">
              <img class="w-full object-cover" src={photoUrl} />
            </div>
          {/each}
        </div>
      </div>

      <h1 class="text-3xl mt-6 font-extrabold">{listingTitle(listing)}</h1>

      <div class="flex space-x-3 mt-8 text-base-content/90">
        <span class="mt-0.5 text-xl">
          <IconCalendar />
        </span>

        <p class="font-medium text-sm tracking-wide">{listingDateRange(listing)}</p>
      </div>

      <div class="flex space-x-3 mt-4 text-base-content/90">
        <span class="mt-0.5 text-xl -ml-0.5">
          <IconBathroomShower />
        </span>

        <div>
          <p class="font-medium">{listing.bathrooms} bathrooms</p>
          {#if !Number.isInteger(listing.bathrooms)}
            <p class="text-xs mt-1 text-base-content/80">
              0.5 bathrooms is a "half bathroom" with just a toilet and sink, with no tub or shower.
            </p>
          {/if}
        </div>
      </div>

      {#if listing.maleRoommates + listing.femaleRoommates + listing.nonbinaryRoommates === 0}
        <div class="flex space-x-3 mt-4 text-base-content/90">
          <span class="mt-0.5 text-xl">
            <IconHome />
          </span>

          <div class="">
            <p class="font-medium">Entire place</p>
            <p class="text-xs mt-1 text-base-content/80">
              You will have the entire place to yourself for the duration of the sublet
            </p>
          </div>
        </div>
      {:else}
        <!-- TODO: -->
      {/if}

      {#if listing.host}
        <h2 class="text-xl mt-12 font-extrabold">Host</h2>
        <div class="mt-4 flex justify-between">
          <div class="flex items-center space-x-4">
            <!-- TODO: host avatar -->
            <div class="avatar">
              <div class="w-10 rounded-full">
                <img src={listing.host.avatarUrl} />
              </div>
            </div>
            <p class="font-extrabold">{listing.host.firstName}</p>
          </div>

          <button class="btn btn-primary btn-sm">Message</button>
        </div>
      {/if}

      <h2 class="text-xl mt-12 font-extrabold">Location</h2>
      <p class="text-base-content/80 mt-2 text-sm first-letter:uppercase">
        {listingLocation(listing.lat, listing.lng, listing.minsToOrg, 'cornell')}
      </p>

      <div id="map" class="w-full aspect-square bg-base-200 rounded-xl mt-6" />

      <div class="flex justify-center mt-3">
        <p class="text-center text-xs text-base-content/80 w-3/4">
          The exact location is not available for security and privacy purposes
        </p>
      </div>

      <h2 class="text-xl mt-12 font-extrabold">Description</h2>
      <p class="mt-4 text-sm text-base-content/80">{listing.desc}</p>

      <div class="my-16" />

      <!-- mobile: fixed bottom panel -->
      <div
        class="fixed bottom-0 left-0 right-0 border-t border-base-content/10 bg-base-100 z-10 p-4 pb-6 flex items-center justify-between"
      >
        <div class="">
          <p class="text-lg">
            <span class="font-extrabold">${listing.price}</span>
            <span class="opacity-80">/ month</span>
          </p>
        </div>
        <button class="btn btn-primary btn-sm">Message host</button>
      </div>
    {/if}
  {/await}
</PageContainer>
