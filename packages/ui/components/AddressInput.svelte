<script lang="ts" generics="T extends Record<string, unknown>">
  import type { GooglePlaceSuggestion, GoogleGeocodeResponse } from '@glue/types';
  import type { FormSelectOption } from '@glue/types';
  import debounce from 'just-debounce-it';
  import { type FormPathLeaves, type SuperForm } from 'sveltekit-superforms';
  import SelectInput from './SelectInput.svelte';
  import queryString from 'query-string';

  export let superform: SuperForm<T>;
  export let field: FormPathLeaves<T, string>;
  export let label: string = undefined;
  export let isHideLabel: boolean = false;
  export let onOptionSelect: (option: FormSelectOption) => void = undefined;
  export let helperText: string = undefined;

  const { form } = superform;
  let addressSuggestions: GooglePlaceSuggestion[] = [];

  const fetchAddressSuggestions = async (address: string) => {
    if (!address || address.length === 0) return [];
    const response = await (
      await fetch(`/api/places/address-autocomplete?${queryString.stringify({ address })}`)
    ).json();
    addressSuggestions = response && response.status === 'OK' ? response.predictions : [];
  };

  const debouncedFetchAddressSuggestions = debounce(fetchAddressSuggestions, 500);

  const handleOptionSelect = async (option: FormSelectOption) => {
    const address = option.value;
    const response: GoogleGeocodeResponse = await (
      await fetch(`/api/places/geocode?${queryString.stringify({ address })}`)
    ).json();

    if (response.status === 'OK' && response.results?.length > 0) {
      const { lat, lng } = response.results[0].geometry.location;
      // @ts-expect-error: limitation of sveltekit typescript generics
      $form.lat = lat;
      // @ts-expect-error: limitation of sveltekit typescript generics
      $form.lng = lng;
    }

    if (onOptionSelect) {
      onOptionSelect(option);
    }
  };
</script>

<SelectInput
  {superform}
  {field}
  {label}
  {isHideLabel}
  onOptionSelect={handleOptionSelect}
  options={addressSuggestions.map((suggestion) => ({
    label: suggestion.description,
    value: suggestion.description
  }))}
  onSearchTextChange={(searchText) => {
    if (searchText) {
      debouncedFetchAddressSuggestions(searchText);
    }
  }}
  {helperText}
/>
