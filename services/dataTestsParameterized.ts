import { TestsParameterized } from "@/types";

export const mockTransactions: TestsParameterized[] = [
  {
    id: 1,
    responseTime: "3000ms",
    transactionValue: "R$ 100,00",
    transactionDate: "02/04/2024",
  },
  {
    id: 2,
    responseTime: "1250ms",
    transactionValue: "R$ 250,00",
    transactionDate: "15/05/2024",
  },
  {
    id: 3,
    responseTime: "980ms",
    transactionValue: "R$ 78,90",
    transactionDate: "10/06/2024",
  },
  {
    id: 4,
    responseTime: "2100ms",
    transactionValue: "R$ 312,45",
    transactionDate: "21/06/2024",
  },
  {
    id: 5,
    responseTime: "1890ms",
    transactionValue: "R$ 56,70",
    transactionDate: "01/07/2024",
  },
  {
    id: 6,
    responseTime: "1420ms",
    transactionValue: "R$ 130,00",
    transactionDate: "03/07/2024",
  },
];


export async function getTransactions(): Promise<TestsParameterized[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTransactions);
    }, 500);
  });
}

export async function createTransaction(
  newTransaction: Omit<TestsParameterized, "id">
): Promise<TestsParameterized> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id =
        mockTransactions.length > 0
          ? mockTransactions[mockTransactions.length - 1].id + 1
          : 1;
      const transaction: TestsParameterized = { id, ...newTransaction };
      mockTransactions.push(transaction);
      resolve(transaction);
    }, 500);
  });
}
