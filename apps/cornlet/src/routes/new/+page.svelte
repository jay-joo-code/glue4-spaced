<script lang="ts">
  import { dev } from '$app/environment';
  import { goto } from '$app/navigation';
  import { listingTable } from '$root/src/db/schema';
  import { APP_NAME } from '$root/src/lib/config';
  import firebase from '$root/src/lib/firebase.js';
  import calculateMinsToOrg from '$root/src/lib/util/calculateMinsToOrg.js';
  import dummyListingData from '$root/src/lib/util/dummyListingData.js';
  import listingLocation from '$root/src/lib/util/listingLocation.js';
  import { Form, PageContainer } from '@glue/ui';
  import { uploadFile } from '@glue/utils';
  import { onMount } from 'svelte';
  import { superForm } from 'sveltekit-superforms';

  export let data;

  const superform = superForm(data.form, {
    dataType: 'json',
    onUpdated: ({ form }) => {
      if (form.valid) {
        goto('/profile/listings');
      }
    }
  });
  const { form } = superform;

  onMount(() => {
    if (dev) $form = dummyListingData;
    if (data.user) $form.userId = data.user.id;
  });
</script>

<PageContainer {APP_NAME} title="Create new listing" isInvalidateOnFocus={false}>
  <Form
    {superform}
    table={listingTable}
    actionPath="?/insertListing"
    formBlocks={[
      {
        variant: 'h1',
        content: 'Create new sublet listing'
      },
      {
        variant: 'space',
        spaceRem: 2
      },
      {
        variant: 'field',
        column: 'address',
        component: 'address',
        onOptionSelect: async () => {
          const minsToOrg = calculateMinsToOrg($form.lat, $form.lng, 'cornell');
          $form.minsToOrg = minsToOrg;
        },
        helperText:
          $form.lat && $form.lng && $form.minsToOrg
            ? listingLocation($form.lat, $form.lng, $form.minsToOrg, 'cornell')
            : undefined,
        helperTextStatus: 'success'
      },
      {
        variant: 'field',
        column: 'propertyType',
        component: 'select',
        options: [
          {
            label: 'Apartment',
            value: 'apt'
          },
          {
            label: 'House',
            value: 'house'
          },
          {
            label: 'Studio',
            value: 'studio'
          }
        ]
      },
      {
        variant: 'field',
        column: 'totalRooms',
        label: 'Total rooms in property',
        inputClass: 'max-w-[6rem]'
      },
      {
        variant: 'field',
        column: 'availableRooms',
        label: 'Rooms available',
        inputClass: 'max-w-[6rem]'
      },
      {
        variant: 'field',
        column: 'bathrooms',
        label: 'Number of bathrooms',
        helperText: '0.5 bathrooms is a "half bathroom" without a tub or shower.',
        inputClass: 'max-w-[6rem]'
      },
      {
        variant: 'h2',
        content: 'Sublet details'
      },
      {
        variant: 'p',
        content: 'Give additional information about your sublet'
      },
      {
        variant: 'field',
        column: 'price',
        label: 'Price per month ($)',
        helperText:
          'Successful sublet listings often have a price much lower than the original lease rent',
        inputClass: 'max-w-[10rem]'
      },
      {
        variant: 'field',
        column: 'start',
        label: 'Start date',
        inputClass: 'max-w-[12rem]'
      },
      {
        variant: 'field',
        column: 'end',
        label: 'End date',
        inputClass: 'max-w-[12rem]'
      },
      {
        variant: 'field',
        column: 'desc',
        label: 'Description',
        component: 'textarea'
      },
      {
        variant: 'h2',
        content: 'Roommates during the sublet'
      },
      {
        variant: 'p',
        content: 'Only indicate roommates that will be present during the sublet'
      },
      {
        variant: 'field',
        column: 'femaleRoommates',
        inputClass: 'max-w-[6rem]'
      },
      {
        variant: 'field',
        column: 'maleRoommates',
        inputClass: 'max-w-[6rem]'
      },
      {
        variant: 'field',
        column: 'nonbinaryRoommates',
        inputClass: 'max-w-[6rem]'
      },
      {
        variant: 'h2',
        content: 'Photos'
      },
      {
        variant: 'p',
        content: 'Good photos can significantly increase interest in your sublet'
      },
      {
        variant: 'field',
        component: 'file-upload',
        column: 'photoUrls',
        handleFileUpload: async (files) => {
          const uploadPromises = Array.from(files).map((file) =>
            uploadFile(file, `/v2/${$form.id}`, firebase)
          );
          const urls = await Promise.all(uploadPromises);
          return urls;
        },
        isHideLabel: true
      },
      {
        variant: 'h2',
        content: 'Settings'
      },
      {
        variant: 'p',
        content: 'Configure settings for your sublet listing'
      },
      {
        variant: 'field',
        component: 'toggle',
        column: 'isRequireVerification',
        label: 'Only receive messages from Cornellians',
        helperText: 'Enabling can reduce the number of messages you receive'
      }
    ]}
  />
</PageContainer>
