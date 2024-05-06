import type { SelectTransaction } from '$root/src/db/schema.server';

export type TransactionReduceGroup = {
  [key: string]: SelectTransaction[];
};
