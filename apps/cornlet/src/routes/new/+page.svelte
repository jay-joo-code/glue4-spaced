<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { listingTable } from '$root/src/db/schema';
  import { APP_NAME } from '$root/src/lib/config';
  import type { GooglePlaceSuggestion } from '$root/src/lib/types/places.type.js';
  import { Form, PageContainer } from '@glue/ui';
  import debounce from 'just-debounce-it';

  export let data;

  let address: string;
  let addressSuggestions: GooglePlaceSuggestion[] = [];
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
    const response = await (await fetch(`/api/address-autocomplete?${query}`)).json();
    addressSuggestions = response && response.status === 'OK' ? response.predictions : [];
  };
  const debouncedFetchAddressSuggestions = debounce(fetchAddressSuggestions, 500);
</script>

<PageContainer {APP_NAME} title="Create new listing">
  <h1 class="text-3xl font-extrabold mb-8">Create new sublet listing</h1>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">Address</span>
    </div>
    <input type="text" class="input input-bordered w-full max-w-lg" bind:value={address} />
  </label>
  <Form
    form={data.form}
    table={listingTable}
    actionPath="?/insertListing"
    formOptions={{
      onSubmit: ({ formData }) => {
        if (data.user) formData.set('userId', data.user.id);
        formData.set('lat', '28492');
        formData.set('lng', '28492');
        formData.set('minsToCampus', '28');
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
  />
</PageContainer>
