export type Nav = {
  label: string;
  href?: string;
  children?: Nav[];
};

export type FooterNav = {
  heading: string;
  nav: Nav[];
};

export type ActionButton = {
  label: string;
  href: string;
  variant: 'primary' | 'ghost';
};

export type FormSelectOption = {
  value: string;
  label: string;
} & {
  [key: string]: any;
};

export type FormBlock =
  | FormFieldBlock
  | FormTextBlock
  | FormSpaceBlock
  | FormFileUploadBlock
  | FormTextareaBlock
  | FormSelectBlock
  | FormAddressBlock;

export type FormFieldBlock = {
  variant: 'field';
  column: string;
  label?: string;
  isHideLabel?: boolean;
  helperText?: string;
};

export type FormTextBlock = {
  variant: 'h1' | 'h2' | 'p';
  content: string;
};

export type FormSpaceBlock = {
  variant: 'space';
  spaceRem: number;
};

export type FormFileUploadBlock = FormFieldBlock & {
  component: 'file-upload';
  handleFileUpload: (files: FileList) => Promise<string[]>;
};

export type FormTextareaBlock = FormFieldBlock & {
  component: 'textarea';
};

export type FormSelectBlock = FormFieldBlock & {
  component: 'select';
  options?: FormSelectOption[];
  onOptionSelect?: (option: FormSelectOption) => void;
  onSearchTextChange?: (searchText: string) => void;
};

export type FormAddressBlock = FormFieldBlock & {
  component: 'address';
  onOptionSelect?: (option: FormSelectOption) => void;
};

export function isFormFieldBlock(block: any): block is FormFieldBlock {
  return block.variant === 'field';
}

export function isFormTextBlock(block: any): block is FormTextBlock {
  return ['h1', 'h2', 'p'].includes(block.variant);
}

export function isFormSpaceBlock(block: any): block is FormSpaceBlock {
  return block.variant === 'space';
}

export function isFormFileUploadBlock(block: any): block is FormFileUploadBlock {
  return block.component === 'file-upload';
}

export function isFormTextareaBlock(block: any): block is FormTextareaBlock {
  return block.component === 'textarea';
}

export function isFormSelectBlock(block: any): block is FormSelectBlock {
  return block.component === 'select';
}

export function isFormAddressBlock(block: any): block is FormAddressBlock {
  return block.component === 'address';
}

export interface GooglePlaceSuggestion extends Record<string, unknown> {
  description: string;
  matched_substrings: {
    length: number;
    offset: number;
  }[];
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    main_text_matched_substrings: {
      length: number;
      offset: number;
    }[];
    secondary_text: string;
  };
  terms: {
    offset: number;
    value: string;
  }[];
  types: string[];
}

export interface GoogleGeocodeAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GoogleGeocodeGeometry {
  bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  location: { lat: number; lng: number };
  location_type: string;
  viewport: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
}

export interface GoogleGeocodeResult {
  address_components: GoogleGeocodeAddressComponent[];
  formatted_address: string;
  geometry: GoogleGeocodeGeometry;
  place_id: string;
  types: string[];
}

export interface GoogleGeocodeResponse {
  results: GoogleGeocodeResult[];
  status: string;
}
