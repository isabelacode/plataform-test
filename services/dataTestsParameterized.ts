import { TestsParameterized, TestCase } from "@/types";

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

export const mockTestCases: Record<number, Omit<TestCase, keyof TestsParameterized>> = {
  1: {
    name: "Teste de Transação de Crédito",
    description: "Validação de transação de crédito à vista",
    type: "Transação de Crédito",
    expectedTime: 3000,
    logs: [
      "Iniciando teste de transação de crédito...",
      "Conectando com o banco de dados...",
      "Validando parâmetros da transação...",
      "Processando transação...",
      "Verificando tempo de resposta do banco...",
      "Validando regras de negócio...",
      "Finalizando processo de teste...",
      "Teste concluído com sucesso!"
    ]
  },
  2: {
    name: "Teste de Transação de Débito",
    description: "Validação de transação de débito automático",
    type: "Transação de Débito",
    expectedTime: 2500,
    logs: [
      "Iniciando teste de transação de débito...",
      "Conectando com sistema de débito automático...",
      "Validando saldo disponível...",
      "Processando débito...",
      "Verificando autorização bancária...",
      "Confirmando transação...",
      "Enviando comprovante...",
      "Teste de débito finalizado com sucesso!"
    ]
  },
  3: {
    name: "Teste de PIX",
    description: "Validação de transferência via PIX",
    type: "PIX",
    expectedTime: 1500,
    logs: [
      "Iniciando teste de PIX...",
      "Conectando com sistema PIX...",
      "Validando chave PIX...",
      "Processando transferência...",
      "Verificando disponibilidade do banco receptor...",
      "Confirmando transferência instantânea...",
      "Enviando comprovante PIX...",
      "Teste PIX concluído com sucesso!"
    ]
  },
  4: {
    name: "Teste de Transferência Bancária",
    description: "Validação de transferência entre contas",
    type: "Transferência Bancária",
    expectedTime: 2800,
    logs: [
      "Iniciando teste de transferência...",
      "Conectando com sistema bancário...",
      "Validando contas origem e destino...",
      "Processando transferência...",
      "Verificando limites de transação...",
      "Confirmando operação...",
      "Enviando comprovante de transferência...",
      "Teste de transferência concluído com sucesso!"
    ]
  },
  5: {
    name: "Teste de Pagamento de Boleto",
    description: "Validação de pagamento de boleto bancário",
    type: "Pagamento de Boleto",
    expectedTime: 2200,
    logs: [
      "Iniciando teste de pagamento de boleto...",
      "Conectando com sistema de cobrança...",
      "Validando código de barras...",
      "Processando pagamento...",
      "Verificando vencimento e juros...",
      "Confirmando pagamento...",
      "Enviando comprovante de pagamento...",
      "Teste de pagamento concluído com sucesso!"
    ]
  },
  6: {
    name: "Teste de Depósito",
    description: "Validação de depósito em conta",
    type: "Depósito",
    expectedTime: 1800,
    logs: [
      "Iniciando teste de depósito...",
      "Conectando com sistema de depósitos...",
      "Validando dados da conta...",
      "Processando depósito...",
      "Verificando disponibilidade de saldo...",
      "Confirmando depósito...",
      "Atualizando saldo da conta...",
      "Teste de depósito concluído com sucesso!"
    ]
  }
};

const defaultTestCase: Omit<TestCase, keyof TestsParameterized> = {
  name: "Teste Padrão",
  description: "Validação de transação genérica",
  type: "Transação Genérica",
  expectedTime: 2000,
  logs: [
    "Iniciando teste...",
    "Conectando com sistema...",
    "Validando parâmetros...",
    "Processando transação...",
    "Verificando resposta...",
    "Finalizando teste...",
    "Teste concluído!"
  ]
};

export function getTestDetails(transaction: TestsParameterized): TestCase {
  const testDetails = mockTestCases[transaction.id] || defaultTestCase;

  const personalizedLogs = testDetails.logs.map(log => {
    if (log.includes("Processando")) {
      return log.replace("Processando", `Processando ${transaction.transactionValue} -`);
    }
    return log;
  });

  return {
    ...transaction,
    ...testDetails,
    logs: personalizedLogs
  };
}

export async function getTransactions(): Promise<TestsParameterized[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTransactions);
    }, 500);
  });
}

export async function getTestCase(testId: number): Promise<TestCase | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transaction = mockTransactions.find(t => t.id === testId);
      if (transaction) {
        resolve(getTestDetails(transaction));
      } else {
        resolve(null);
      }
    }, 500);
  });
}

export async function getAllTestCases(): Promise<TestCase[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const testCases = mockTransactions.map(transaction => getTestDetails(transaction));
      resolve(testCases);
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
export async function startTransaction(
  transactionId: number
): Promise<TestsParameterized | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transaction = mockTransactions.find(
        (t) => t.id === transactionId
      );
      resolve(transaction || null);
    }, 500);
  });
}

export async function stopTransaction(
  transactionId: number
): Promise<TestsParameterized | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transaction = mockTransactions.find(
        (t) => t.id === transactionId
      );
      resolve(transaction || null);
    }, 500);
  });
}

export async function pauseTransaction(
  transactionId: number
): Promise<TestsParameterized | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transaction = mockTransactions.find(
        (t) => t.id === transactionId
      );
      resolve(transaction || null);
    }, 500);
  });
}

export async function restartTransaction(
  transactionId: number
): Promise<TestsParameterized | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const transaction = mockTransactions.find(
        (t) => t.id === transactionId
      );
      resolve(transaction || null);
    }, 500);
  });
}
