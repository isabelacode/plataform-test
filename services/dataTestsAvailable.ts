import { TestsAvailable } from "@/types";


const mockCards: TestsAvailable[] = [
  {
    id: 1,
    title: "Recebidos"
  },
  {
    id: 2,
    title: "Pendentes"
  },
  {
    id: 3,
    title: "Saque disponível"
  },
   {
    id: 4,
    title: "Recebidos"
  },
  {
    id: 5,
    title: "Pendentes"
  },
  {
    id: 6,
    title: "Saque disponível"
  },
];

export async function getTestsAvailable(): Promise<TestsAvailable[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCards);
    }, 500);
  });
}

export async function createtTestsAvailable(
  newCard: Omit<TestsAvailable, "id">
): Promise<TestsAvailable> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id =
        mockCards.length > 0 ? mockCards[mockCards.length - 1].id + 1 : 1;
      const card: TestsAvailable = { id, ...newCard };
      mockCards.push(card);
      resolve(card);
    }, 500);
  });
}