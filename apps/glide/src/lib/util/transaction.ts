import type { ChaseTransaction, TransactionReduceGroup } from '$lib/types/transaction.type';
import type { InsertTransaction, SelectTransaction } from '$root/src/db/schema.server';
import { endOfWeek, format, parse, startOfWeek } from 'date-fns';
import Papa from 'papaparse';

export const groupTransactionsByWeek = (transactions: SelectTransaction[]) => {
  const groups = transactions.reduce((groups: TransactionReduceGroup, transaction) => {
    let weekKey;

    if (transaction.usageDate) {
      const weekStartDate = startOfWeek(transaction.usageDate, { weekStartsOn: 1 });
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

  return Object.entries(groups).map(([weekKey, transactions]) => {
    let weekString;

    if (weekKey === 'DATE_UNSET') {
      weekString = 'Date unset';
    } else {
      const date = new Date(weekKey);
      const startOfWeekDate = startOfWeek(date);
      const endOfWeekDate = endOfWeek(date);
      const formattedStartDate = format(startOfWeekDate, 'MMM d');
      const formattedEndDate = format(
        endOfWeekDate,
        startOfWeekDate.getMonth() === endOfWeekDate.getMonth() ? 'd' : 'MMM d'
      );
      weekString = `${formattedStartDate} - ${formattedEndDate}`;
    }
    const totalAmount = transactions.reduce((accum, transaction) => accum + transaction.amount, 0);

    return {
      weekString,
      totalAmount,
      transactions
    };
  });
};

export const formatMoney = (num: number) => {
  if (num < 0) {
    if (num % 1 !== 0) {
      return `-$${Math.abs(num).toFixed(2)}`;
    } else {
      return `-$${Math.abs(num)}`;
    }
  } else {
    if (num % 1 !== 0) {
      return `$${num.toFixed(2)}`;
    } else {
      return `$${num}`;
    }
  }
};

export const parseTransactionsCSV = (file: File): Promise<Omit<InsertTransaction, 'userId'>[]> => {
  return new Promise(async (resolve, reject) => {
    Papa.parse<ChaseTransaction>(file, {
      download: true,
      header: true,
      skipEmptyLines: false,
      complete: (results) => {
        console.log('results', results);
        const CHASE_FIELDS = 'Details,Posting Date,Description,Amount,Type,Balance,Check or Slip #';

        if (results.meta.fields?.join(',') === CHASE_FIELDS) {
          const dateRegex = /(\d{2}\/\d{2})$/;
          const transactions = results.data
            .filter(
              (transaction) =>
                transaction &&
                transaction.Description &&
                !transaction.Description?.includes('POS DEBIT')
            )
            .map((transaction) => {
              const match = transaction.Description.match(dateRegex);
              const date = match ? parse(match[0], 'MM/dd', new Date()) : undefined;
              const name = transaction.Description.replace(dateRegex, '')
                .replace(/\s+/g, ' ')
                .trim();

              return {
                amount: Number(transaction.Amount),
                date,
                usageDate: date,
                name
              };
            });
          resolve(transactions);
        }
      }
    });
  });
};
