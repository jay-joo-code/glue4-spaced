import type { SelectTransaction } from '$root/src/db/schema.server';

export type TransactionReduceGroup = {
  [key: string]: SelectTransaction[];
};

export type ChaseTransaction = {
  Details: string;
  'Posting Date': string;
  Description: string;
  Amount: string;
  Type: string;
  Balance: string;
  'Check or Slip #': string;
};

export type VenmoTransaction = {
  [key: string]: string;
  'Account Statement - (@jj534) - April 30th to June 1st 2024': string;
  '': string;
  _1: string;
  _2: string;
  _3: string;
  _4: string;
  _5: string;
  _6: string;
  _7: string;
  _8: string;
  _9: string;
  _10: string;
  _11: string;
  _12: string;
  _13: string;
  _14: string;
  _15: string;
  _16: string;
  _17: string;
  _18: string;
  _19: string;
  _20: string;
};
