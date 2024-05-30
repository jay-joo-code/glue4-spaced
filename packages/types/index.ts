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
  | FormSelectBlock;

export type FormFieldBlock = {
  variant: 'field';
  column: string;
  label?: string;
  isHideLabel?: boolean;
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
