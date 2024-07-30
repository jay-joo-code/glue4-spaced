<script lang="ts">
  import type {
    GoogleGeocodeResponse,
    GooglePlaceSuggestion,
    HelperText,
    HelperTextStatus,
    OnOptionSelect
  } from '@glue/types';
  import debounce from 'just-debounce-it';
  import queryString from 'query-string';
  import { type FormPathLeaves, type SuperForm } from 'sveltekit-superforms';
  import SelectInput from './SelectInput.svelte';

  type T = $$Generic<Record<string, unknown>>;

  export let superform: SuperForm<T>;
  export let field: FormPathLeaves<T, string>;
  export let label: string = undefined;
  export let isHideLabel: boolean = false;
  export let onOptionSelect: OnOptionSelect = undefined;
  export let helperText: HelperText = undefined;
  export let helperTextStatus: HelperTextStatus = undefined;
  export let inputClass: string = undefined;
  export let inputProps: Record<string, any> = {};

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

  const handleOptionSelect: OnOptionSelect = async ({ option, superform }) => {
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
      onOptionSelect({ option, superform });
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
  {helperTextStatus}
  {inputClass}
  {inputProps}
/>
