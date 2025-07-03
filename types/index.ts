export type TestsAvailable = {
  id: number;
  title: string;
};

export type TestsParameterized = {
  id: number;
  responseTime: string;
  transactionValue: string;
  transactionDate: string;
};

export type TestCase = {
  id: number;
  name: string;
  description: string;
  type: string;
  responseTime: string;
  transactionValue: string;
  transactionDate: string;
  expectedTime: number;
  logs: string[];
};


