import type {
  ChaseTransaction,
  TransactionReduceGroup,
  TransactionWithRefunds,
  VenmoTransaction
} from '$lib/types/transaction.type';
import type { InsertTransaction, SelectTransaction } from '$root/src/db/schema.server';
import { endOfWeek, format, isAfter, parse, startOfDay, startOfWeek } from 'date-fns';
import Papa from 'papaparse';

export const groupTransactionsByWeek = (transactions: TransactionWithRefunds[]) => {
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
    const totalAmount = transactions.reduce((accum, transaction) => {
      let sum = accum + transaction.amount;
      for (const refund of transaction.refunds) {
        sum += refund.amount;
      }
      return sum;
    }, 0);

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

  const WEEKLY_BUDGET = 250;
  let budgetRollover = 0;
  const transactionGroupsWithBudgetTracking = transactionGroups
    .reverse()
    .map((transactionGroup) => {
      const budgetDiff =
        transactionGroup.weekString === 'Date unset'
          ? 0
          : WEEKLY_BUDGET + transactionGroup.totalAmount;
      budgetRollover += budgetDiff;

      return {
        ...transactionGroup,
        budgetDiff,
        budgetRollover
      };
    });
  return transactionGroupsWithBudgetTracking;
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
      return `+$${num.toFixed(2)}`;
    } else {
      return `+$${num}`;
    }
  }
};

export const transactionIdentifier = (
  postingDateString: string | undefined,
  name: string,
  amount: number,
  balance: string
) => {
  return `${postingDateString}_${name}_${amount}_${balance}`;
};

export const parseTransactionsCSV = (file: File): Promise<Omit<InsertTransaction, 'userId'>[]> => {
  return new Promise(async (resolve, reject) => {
    Papa.parse<ChaseTransaction | VenmoTransaction>(file, {
      download: true,
      header: true,
      skipEmptyLines: false,
      complete: (results) => {
        const CHASE_FIELDS = 'Details,Posting Date,Description,Amount,Type,Balance,Check or Slip #';
        const VENDMO_FIELDS_SUBSTR = 'Account Statement - (@jj534)';
        const inputCsvFields = results.meta.fields?.join(',');

        if (inputCsvFields?.includes(CHASE_FIELDS)) {
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
              const postingDateString = format(postingDate, 'yyyy-MM-dd');
              const date = match ? parse(match[0], 'MM/dd', postingDate) : postingDate;
              const dateString = format(date, 'yyyy-MM-dd');
              const name = transaction.Description.replace(dateRegex, '')
                .replace(/\s+/g, ' ')
                .trim();
              const amount = Number(transaction.Amount);
              const balance = transaction['Balance'];
              const identifier = transactionIdentifier(postingDateString, name, amount, balance);
              const isIgnore = name.includes('VENMO') || name.includes('Wealthfront');

              const transactionData = {
                amount,
                date: dateString,
                usageDate: dateString,
                name,
                source: 'chase',
                identifier,
                displayName: name,
                isIgnore
              };

              return transactionData;
            })
            // prevent duplicate transactions after appeding balance to identifier
            .filter((transaction) => isDateAfterJuly72024(transaction.date));
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
                identifier: transactionIdentifier(dateString, name, amount, 'N/A'),
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

export const aggregateRefunds = (
  transactionJoinRefund: { transaction: SelectTransaction; refund: SelectTransaction | null }[]
): TransactionWithRefunds[] => {
  const idToTransaction = transactionJoinRefund.reduce<Record<string, TransactionWithRefunds>>(
    (acc, row) => {
      const transaction = row.transaction;
      const refund = row.refund;
      if (!acc[transaction.id]) {
        acc[transaction.id] = { ...transaction, refunds: [] };
      }
      if (refund) {
        acc[transaction.id].refunds.push(refund);
      }
      return acc;
    },
    {}
  );

  return Object.values(idToTransaction);
};

const isDateAfterJuly72024 = (dateString: string): boolean => {
  const inputDate = startOfDay(parse(dateString, 'yyyy-MM-dd', new Date()));
  const july72024 = startOfDay(new Date(2024, 6, 7)); // Note: month is 0-indexed, so 6 represents July
  return isAfter(inputDate, july72024);
};
