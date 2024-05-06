import type { SelectTransaction } from '$root/src/db/schema.server';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import type { TransactionReduceGroup } from '../types/transaction.type';

export const groupTransactionsByWeek = (transactions: SelectTransaction[]) => {
  const groups = transactions.reduce((groups: TransactionReduceGroup, transaction) => {
    let weekKey;

    if (transaction.usageDatetime) {
      const weekStartDate = startOfWeek(transaction.usageDatetime, { weekStartsOn: 1 });
      weekKey = weekStartDate.toISOString().slice(0, 10);
    } else {
      weekKey = 'DATE_UNSET';
    }

    if (!groups[weekKey]) {
      groups[weekKey] = [];
    }
    groups[weekKey].push(transaction);
    return groups;
  }, {});

  return Object.entries(groups).map(([key, value]) => {
    const date = new Date(key);
    const startOfWeekDate = startOfWeek(date);
    const endOfWeekDate = endOfWeek(date);
    const formattedStartDate = format(startOfWeekDate, 'MMM d');
    const formattedEndDate = format(
      endOfWeekDate,
      startOfWeekDate.getMonth() === endOfWeekDate.getMonth() ? 'd' : 'MMM d'
    );

    return {
      weekString: `${formattedStartDate} - ${formattedEndDate}`,
      transactions: value
    };
  });
};
