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

  return Object.entries(groups).map(([startOfWeekString, transactions]) => {
    const date = new Date(startOfWeekString);
    const startOfWeekDate = startOfWeek(date);
    const endOfWeekDate = endOfWeek(date);
    const formattedStartDate = format(startOfWeekDate, 'MMM d');
    const formattedEndDate = format(
      endOfWeekDate,
      startOfWeekDate.getMonth() === endOfWeekDate.getMonth() ? 'd' : 'MMM d'
    );
    const totalAmount = transactions.reduce((accum, transaction) => accum + transaction.amount, 0);

    return {
      weekString: `${formattedStartDate} - ${formattedEndDate}`,
      totalAmount,
      transactions
    };
  });
};

export const formatMoney = (num: number) => {
  if (num % 1 !== 0) {
    return `$${num.toFixed(2)}`;
  } else {
    return `$${num}`;
  }
};
