<script lang="ts" generics="T extends Record<string, unknown>">
  import type { GooglePlaceSuggestion } from '@glue/types';
  import type { FormSelectOption } from '@glue/types';
  import debounce from 'just-debounce-it';
  import { type FormPathLeaves, type SuperForm } from 'sveltekit-superforms';
  import SelectInput from './SelectInput.svelte';

  export let superform: SuperForm<T>;
  export let field: FormPathLeaves<T, string>;
  export let label: string = undefined;
  export let isHideLabel: boolean = false;
  export let onOptionSelect: (option: FormSelectOption) => void = undefined;

  let addressSuggestions: GooglePlaceSuggestion[] = [];

  const fetchAddressSuggestions = async (address: string) => {
    if (!address || address.length === 0) return [];
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

<SelectInput
  {superform}
  {field}
  {label}
  {isHideLabel}
  {onOptionSelect}
  options={addressSuggestions.map((suggestion) => ({
    label: suggestion.description,
    value: suggestion.description
  }))}
  onSearchTextChange={(searchText) => {
    if (searchText) {
      debouncedFetchAddressSuggestions(searchText);
    }
  }}
/>
