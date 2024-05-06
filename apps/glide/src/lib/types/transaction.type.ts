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
