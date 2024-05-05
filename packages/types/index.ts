export type Nav = {
  label: string;
  href?: string;
  children?: Nav[];
};

export type FooterNav = {
  heading: string;
  nav: Nav[];
};
