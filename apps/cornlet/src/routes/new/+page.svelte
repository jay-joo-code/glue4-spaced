<script lang="ts">
  import { goto } from '$app/navigation';
  import { listingTable } from '$root/src/db/schema';
  import { APP_NAME } from '$root/src/lib/config';
  import calculateMinsToOrg from '$root/src/lib/util/calculateMinsToOrg.js';
  import findClosestLocation from '$root/src/lib/util/findClosestLocation.js';
  import { Form, PageContainer } from '@glue/ui';
  import { uploadFile } from '@glue/utils';
  import { superForm, type FormOptions } from 'sveltekit-superforms';

  export let data;

  const formOptions: FormOptions = {
    onSubmit: ({ formData }) => {
      if (data.user) formData.set('userId', data.user.id);
    },
    onUpdated: () => {
      goto('/profile/listings');
    }
  };
  const superform = superForm(data.form, formOptions);
  const { form } = superform;
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
          // @ts-expect-error: superform table schema getting lost
          const minsToOrg = calculateMinsToOrg($form.lat, $form.lng, 'cornell');
          $form.minsToOrg = minsToOrg;
        },
        helperText: $form.minsToOrg
          ? // @ts-expect-error: superform table schema getting lost
            `${findClosestLocation($form.lat, $form.lng, 'cornell')} • ${
              $form.minsToOrg
            } mins to campus`
          : undefined
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
        label: 'Total rooms in property'
      },
      {
        variant: 'field',
        column: 'desc',
        label: 'Description',
        component: 'textarea'
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
          const uploadPromises = Array.from(files).map((file) => uploadFile(file, '/v2'));
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
