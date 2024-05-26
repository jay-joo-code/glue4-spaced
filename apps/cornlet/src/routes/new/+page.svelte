<script lang="ts">
  import { uploadFile } from '@glue/utils';
  import { browser, dev } from '$app/environment';
  import { goto } from '$app/navigation';
  import { listingTable } from '$root/src/db/schema';
  import { APP_NAME } from '$root/src/lib/config';
  import type { GooglePlaceSuggestion } from '$root/src/lib/types/places.type.js';
  import { Autocomplete, Form, PageContainer, PhotoUpload } from '@glue/ui';
  import firebase from '$lib/firebase';
  import debounce from 'just-debounce-it';

  export let data;

  let address: string;
  let addressSuggestions: GooglePlaceSuggestion[] = [];
  let photoItems = dev
    ? [
        {
          id: 'https://firebasestorage.googleapis.com/v0/b/cornlet-prod.appspot.com/o/v2%2Fcornlet-home.png?alt=media&token=c1099aa9-eb84-482e-8207-b89f69c85256',
          name: 'cornlet'
        },
        {
          id: 'https://firebasestorage.googleapis.com/v0/b/cornlet-prod.appspot.com/o/v2%2Frevy-home.png?alt=media&token=4fc2ca8b-d4eb-431f-a2a0-835a0f08a846',
          name: 'revy'
        },
        {
          id: 'https://firebasestorage.googleapis.com/v0/b/cornlet-prod.appspot.com/o/v2%2FScreenshot%202024-03-23%20at%2012.07.53%20AM.png?alt=media&token=2fa41cb2-29f8-4bb4-b097-f2166d053c7e',
          name: 'type'
        }
      ]
    : [];

  $: if (address) {
    debouncedFetchAddressSuggestions(address);
  }

  const fetchAddressSuggestions = async (address: string) => {
    if (!browser || !address || address.length === 0) return [];
    const query = Object.entries({
      address
    })
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const response = await (await fetch(`/api/places/address-autocomplete?${query}`)).json();
    addressSuggestions = response && response.status === 'OK' ? response.predictions : [];
  };
  const debouncedFetchAddressSuggestions = debounce(fetchAddressSuggestions, 500);
</script>

<PageContainer {APP_NAME} title="Create new listing">
  <h1 class="text-3xl font-extrabold mb-8">Create new sublet listing</h1>

  <Autocomplete
    bind:value={address}
    suggestions={addressSuggestions}
    getSuggestionLabel={(suggestion) => suggestion.description}
    onSuggestionSelect={(suggestion) => {
      address = suggestion.description;
    }}
  />

  <Form
    form={data.form}
    table={listingTable}
    actionPath="?/insertListing"
    formOptions={{
      onSubmit: ({ formData }) => {
        if (data.user) formData.set('userId', data.user.id);
        formData.set('address', address);
        formData.set('lat', '28492');
        formData.set('lng', '28492');
        formData.set('minsToCampus', '28');
        for (const photoItem of photoItems) {
          formData.append('photoUrls', photoItem.id);
        }
      },
      onUpdated: () => {
        goto('/profile/listings');
      }
    }}
    fieldConfigs={{
      address: {
        isHidden: true
      },
      lat: {
        isHidden: true
      },
      lng: {
        isHidden: true
      },
      minsToCampus: {
        isHidden: true
      },
      femaleRoommates: {
        label: 'Number of female roommates'
      },
      maleRoommates: {
        label: 'Number of male roommates'
      },
      nonbinaryRoommates: {
        label: 'Number of non-binary roommates'
      },
      start: {
        label: 'Start date'
      },
      end: {
        label: 'End date'
      },
      price: {
        label: 'Price per month ($)'
      }
    }}
  >
    <div class="my-8">
      <p class="text-2xl font-extrabold">Photos</p>
      <p class="mt-2 text-sm text-base-content/80">
        Good photos can significantly increase interest in your sublet
      </p>
      <PhotoUpload
        bind:photoItems
        {firebase}
        handleFileUpload={async (files) => {
          const uploadPromises = Array.from(files).map((file) => uploadFile(file, '/v2', firebase));
          const urls = await Promise.all(uploadPromises);
          return [...photoItems, ...urls.map((url) => ({ id: url }))];
        }}
      />
    </div>
  </Form>
</PageContainer>
