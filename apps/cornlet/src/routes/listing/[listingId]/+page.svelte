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

  let dialogSeeAllPhotos: HTMLDialogElement;

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
        class="btn btn-sm md:btn-md"
        on:click={() => {
          history.back();
        }}
      >
        <span class="text-lg md:text-xl">
          <IconChevronLeft />
        </span>
        back</button
      >

      <div class="mt-6 md:mt-12">
        <!-- mobile: carousel -->
        <div class="w-full carousel rounded-lg border border-base-content/10 md:hidden">
          {#each listing.photoUrls as photoUrl}
            <div class="carousel-item w-[80%] border-r border-base-content/30">
              <img class="w-full object-cover" src={photoUrl} />
            </div>
          {/each}
        </div>

        <!-- desktop: gallery -->
        <div class="relative hidden md:block">
          <div class="grid grid-cols-4 grid-rows-2 min-h-[50vh] gap-3">
            <div
              class="row-span-2 col-span-2 border border-base-content/10 rounded-l-xl overflow-hidden"
            >
              <img class="object-cover w-full h-full" src={listing.photoUrls[0]} />
            </div>

            <div class="border border-base-content/10">
              {#if listing.photoUrls.length < 2}
                <div class="w-full h-full bg-primary/10 flex justify-center items-center">
                  <p class="text-sm text-base-content/80">No image</p>
                </div>
              {:else}
                <img class="object-cover w-full h-full" src={listing.photoUrls[1]} />
              {/if}
            </div>

            <div class="rounded-tr-xl border border-base-content/10 overflow-hidden">
              {#if listing.photoUrls.length < 3}
                <div class="w-full h-full bg-primary/10 flex justify-center items-center">
                  <p class="text-sm text-base-content/80">No image</p>
                </div>
              {:else}
                <img class="object-cover w-full h-full" src={listing.photoUrls[2]} />
              {/if}
            </div>

            <div class="border border-base-content/10">
              {#if listing.photoUrls.length < 4}
                <div class="w-full h-full bg-primary/10 flex justify-center items-center">
                  <p class="text-sm text-base-content/80">No image</p>
                </div>
              {:else}
                <img class="object-cover w-full h-full" src={listing.photoUrls[3]} />
              {/if}
            </div>

            <div class="rounded-br-xl border border-base-content/10 overflow-hidden">
              {#if listing.photoUrls.length < 5}
                <div class="w-full h-full bg-primary/10 flex justify-center items-center">
                  <p class="text-sm text-base-content/80">No image</p>
                </div>
              {:else}
                <img class="object-cover w-full h-full" src={listing.photoUrls[4]} />
              {/if}
            </div>
          </div>

          <div class="absolute bottom-6 right-6">
            <button
              class="btn btn-secondary"
              on:click={() => {
                dialogSeeAllPhotos.showModal();
              }}>See all photos</button
            >
          </div>
        </div>
      </div>

      <div class="md:grid md:grid-cols-5 md:gap-8 mt-6 md:mt-10">
        <div class="md:col-span-3">
          <h1 class="text-3xl font-extrabold md:text-5xl">{listingTitle(listing)}</h1>

          <div class="mt-8 md:mt-12 space-y-4 md:space-y-6">
            <div class="flex space-x-3 text-base-content/90">
              <span class="mt-0.5 text-xl md:text-2xl">
                <IconCalendar />
              </span>

              <p class="font-medium text-sm tracking-wide md:text-lg">
                {listingDateRange(listing)}
              </p>
            </div>

            <div class="flex space-x-3 text-base-content/90">
              <span class="mt-0.5 md:mt-0 text-xl -ml-0.5 md:text-2xl">
                <IconBathroomShower />
              </span>

              <div>
                <p class="font-medium md:text-lg">{listing.bathrooms} bathrooms</p>
                {#if !Number.isInteger(listing.bathrooms)}
                  <p class="text-xs mt-1 text-base-content/80 md:text-sm">
                    0.5 bathrooms is a "half bathroom" with just a toilet and sink, with no tub or
                    shower.
                  </p>
                {/if}
              </div>
            </div>

            {#if listing.maleRoommates + listing.femaleRoommates + listing.nonbinaryRoommates === 0}
              <div class="flex space-x-3 text-base-content/90">
                <span class="mt-0.5 text-xl md:text-2xl">
                  <IconHome />
                </span>

                <div class="">
                  <p class="font-medium md:text-lg">Entire place</p>
                  <p class="text-xs md:text-sm mt-1 text-base-content/80">
                    You will have the entire place to yourself for the duration of the sublet
                  </p>
                </div>
              </div>
            {:else}
              <!-- TODO: -->
            {/if}
          </div>

          {#if listing.host}
            <div class="md:hidden">
              <h2 class="text-xl mt-12 font-extrabold">Host</h2>
              <div class="mt-4 flex justify-between">
                <div class="flex items-center space-x-4">
                  <div class="avatar">
                    <div class="w-10 rounded-full">
                      <img src={listing.host.avatarUrl} />
                    </div>
                  </div>
                  <p class="font-extrabold">{listing.host.firstName}</p>
                </div>

                <button class="btn btn-primary btn-sm">Message</button>
              </div>
            </div>
          {/if}

          <h2 class="text-xl mt-12 font-extrabold md:text-3xl">Location</h2>
          <p class="text-base-content/80 mt-2 text-sm md:mt-6 first-letter:uppercase">
            {listingLocation(listing.lat, listing.lng, listing.minsToOrg, 'cornell')}
          </p>

          <!-- map -->
          <div class="w-full max-w-xl mt-6">
            <div id="map" class="aspect-square bg-base-200 rounded-xl" />

            <div class="flex justify-center mt-3 md:mt-5">
              <p class="text-center text-xs text-base-content/80 w-3/4 md:w-2/3 md:text-sm">
                The exact location is not available for security and privacy purposes
              </p>
            </div>
          </div>

          <h2 class="text-xl mt-12 font-extrabold md:text-3xl">Description</h2>
          <p class="mt-4 text-sm text-base-content/80 md:text-md md:mt-6">{listing.desc}</p>
        </div>

        <!-- desktop: right side panel -->
        <div class="hidden md:flex justify-end items-start w-full col-span-2">
          <div
            class="max-w-xs w-full border border-base-content/10 rounded-xl divide-y divide-base-content/10 sticky top-24"
          >
            <div class="p-4">
              <p class="text-lg">
                <span class="font-extrabold">${listing.price}</span>
                <span class="opacity-80">/ month</span>
              </p>
            </div>
            <div class="p-4">
              {#if listing.host}
                <div class="flex justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="avatar">
                      <div class="w-10 rounded-full">
                        <img src={listing.host.avatarUrl} />
                      </div>
                    </div>
                    <p class="font-extrabold">{listing.host.firstName}</p>
                  </div>
                </div>
                <button class="mt-5 btn-block btn btn-primary btn-sm">Message host</button>
              {/if}
            </div>
          </div>
        </div>
      </div>

      <div class="my-16" />

      <!-- mobile: fixed bottom panel -->
      <div
        class="fixed bottom-0 left-0 right-0 border-t border-base-content/10 bg-base-100 z-10 p-4 pb-6 flex items-center justify-between md:hidden"
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

<dialog bind:this={dialogSeeAllPhotos} class="modal">
  <div class="modal-box relative box-border max-h-[70vh] w-full max-w-[80vw]">
    <h2 class="text-3xl font-extrabold">All listing photos</h2>

    <div class="grid grid-cols-2 gap-4 mt-8">
      {#await data.listing}
        <div class="flex justify-center">
          <span class="loading loading-spinner loading-sm" />
        </div>
      {:then listing}
        {#if listing}
          {#each listing.photoUrls as photoUrl}
            <img
              class="w-full h-full rounded-lg object-cover border border-base-content/10"
              src={photoUrl}
            />
          {/each}
        {/if}
      {/await}
    </div>
  </div>

  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
