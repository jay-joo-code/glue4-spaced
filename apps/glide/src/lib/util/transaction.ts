import type {
  ChaseTransaction,
  TransactionReduceGroup,
  VenmoTransaction
} from '$lib/types/transaction.type';
import type { InsertTransaction, SelectTransaction } from '$root/src/db/schema.server';
import { endOfWeek, format, parse, startOfWeek } from 'date-fns';
import Papa from 'papaparse';

export const groupTransactionsByWeek = (transactions: SelectTransaction[]) => {
  const groups = transactions.reduce((groups: TransactionReduceGroup, transaction) => {
    let weekKey;

    if (transaction.usageDate) {
      const weekStartDate = startOfWeek(parse(transaction.usageDate, 'yyyy-MM-dd', new Date()), {
        weekStartsOn: 1
      });
      weekKey = weekStartDate.toISOString().split('T')[0];
    } else {
      weekKey = 'DATE_UNSET';
    }

    if (!groups[weekKey]) {
      groups[weekKey] = [];
    }
    groups[weekKey].push(transaction);
    return groups;
  }, {});

  const transactionGroups = Object.entries(groups).map(([weekKey, transactions]) => {
    let weekString;

    if (weekKey === 'DATE_UNSET') {
      weekString = 'Date unset';
    } else {
      const date = parse(weekKey, 'yyyy-MM-dd', new Date());
      const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 });
      const formattedStartDate = format(date, 'MMM dd');
      const formattedEndDate = format(
        endOfWeekDate,
        date.getMonth() === endOfWeekDate.getMonth() ? 'dd' : 'MMM dd'
      );
      weekString = `Week ${formattedStartDate} - ${formattedEndDate}`;
    }
    const totalAmount = transactions.reduce((accum, transaction) => accum + transaction.amount, 0);

    return {
      weekString,
      totalAmount,
      transactions
    };
  });

  const index = transactionGroups.findIndex((obj) => obj.weekString === 'Date unset');
  if (index !== -1) {
    const [obj] = transactionGroups.splice(index, 1);
    transactionGroups.unshift(obj);
  }

  return transactionGroups;
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

export const transactionIdentifier = (
  dateString: string | undefined,
  name: string,
  amount: number
) => {
  return `${dateString}_${name}_${amount}`;
};

export const parseTransactionsCSV = (file: File): Promise<Omit<InsertTransaction, 'userId'>[]> => {
  return new Promise(async (resolve, reject) => {
    Papa.parse<ChaseTransaction | VenmoTransaction>(file, {
      download: true,
      header: true,
      skipEmptyLines: false,
      complete: (results) => {
        console.log('results', results);
        const CHASE_FIELDS = 'Details,Posting Date,Description,Amount,Type,Balance,Check or Slip #';
        const VENDMO_FIELDS_SUBSTR = 'Account Statement - (@jj534)';

        if (results.meta.fields?.join(',') === CHASE_FIELDS) {
          const dateRegex = /(\d{2}\/\d{2})$/;
          const transactions = (results.data as ChaseTransaction[])
            .filter(
              (transaction) =>
                transaction &&
                transaction.Description &&
                !transaction.Description.includes('POS DEBIT')
            )
            .map((transaction) => {
              const match = transaction.Description.match(dateRegex);
              const postingDate = parse(transaction['Posting Date'], 'MM/dd/yyyy', new Date());
              const date = match ? parse(match[0], 'MM/dd', postingDate) : undefined;
              const dateString = date ? format(date, 'yyyy-MM-dd') : undefined;
              const name = transaction.Description.replace(dateRegex, '')
                .replace(/\s+/g, ' ')
                .trim();
              const amount = Number(transaction.Amount);

              return {
                amount,
                date: dateString,
                usageDate: dateString,
                name,
                source: 'chase',
                identifier: transactionIdentifier(dateString, name, amount),
                displayName: name
              };
            })
            .filter(
              (transaction) =>
                !transaction.name.includes('VENMO PAYMENT') &&
                !transaction.name.includes('CAPITAL ONE CRCARDPMT')
            );
          resolve(transactions);
        } else if (results.meta.fields?.join(',').includes(VENDMO_FIELDS_SUBSTR)) {
          const transactions = (results.data as VenmoTransaction[])
            .filter(
              (transaction) =>
                transaction &&
                transaction._1 &&
                transaction._6 !== '' &&
                !['', 'Datetime'].includes(transaction._1)
            )
            .map((transaction) => {
              const date = new Date(transaction._1 + 'z');
              const dateString = date ? format(date, 'yyyy-MM-dd') : undefined;
              const otherPersonName =
                transaction._6 === 'Jay Joo' ? transaction._5 : transaction._6;
              const name = `${transaction._4} (${otherPersonName})`;
              const numericStr = transaction._7.replace('$', '').replace(' ', '');
              let amount = parseFloat(numericStr);

              return {
                amount,
                date: dateString,
                usageDate: dateString,
                name,
                source: 'venmo',
                identifier: transactionIdentifier(dateString, name, amount),
                displayName: name
              };
            });
          resolve(transactions);
        } else {
          resolve([]);
        }
      }
    });
  });
};
