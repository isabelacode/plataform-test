"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestsAvailable } from "@/types";
import { TestsParameterized } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, Filter } from "lucide-react";
import { UserMenu } from "@/components/user-menu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { getTestsAvailable } from "@/services/dataTestsAvailable";
import { getTransactions } from "@/services/dataTestsParameterized";
import { CreateTestCaseModal } from "@/components/create-test-case-modal";

export default function Home() {
  const [activeTab, setActiveTab] = useState("disponivel");
  const router = useRouter();
  const [testsAvailables, setTestsAvailables] = useState<TestsAvailable[]>([]);
  const [transactions, setTransactions] = useState<TestsParameterized[]>([])

  useEffect(() => {
    loadTestsAvailable();
    loadTransactions();
  }, []);

  const loadTestsAvailable = async () => {
    try {
      const data = await getTestsAvailable();
      setTestsAvailables(data);
    } catch (error) {
      console.error("Error loading tests available:", error);
    }
  };
  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Erro ao carregar transações:", error);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-4 gap-4">
            <div className="w-full lg:w-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:w-auto">
                <TabsList className="grid w-full grid-cols-2 lg:w-auto">
                  <TabsTrigger value="disponivel" className="text-xs sm:text-sm">
                    Testes Disponíveis
                  </TabsTrigger>
                  <TabsTrigger value="parametrizados" className="text-xs sm:text-sm">
                    Testes Parametrizados
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Pesquisar ou publicar o slug..."
                  className="pl-10 w-full lg:w-80"
                />
              </div>
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "disponivel" && (
          <>
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2 w-full sm:w-auto">
                      <Filter className="h-4 w-4" />
                      <span>Filtros</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Tipo de transação</DropdownMenuItem>
                    <DropdownMenuItem>Valor</DropdownMenuItem>
                    <DropdownMenuItem>Data</DropdownMenuItem>
                    <DropdownMenuItem>Status</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm whitespace-nowrap">
                    Personalizações de crédito a vista
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
                    R$ 00,00
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {testsAvailables.map((testsAvailable) => (
                <Card key={testsAvailable.id} className="hover:shadow-md transition-shadow">

                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg leading-tight">
                      {testsAvailable.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CreateTestCaseModal>
                      <Button
                        variant="default"
                        className="w-full text-sm sm:text-base py-2"
                      >
                        Criar Caso de Teste
                      </Button>
                    </CreateTestCaseModal>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === "parametrizados" && (
          <>
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center space-x-2 w-full sm:w-auto">
                      <Filter className="h-4 w-4" />
                      <span>Filtros</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Tempo de resposta do banco</DropdownMenuItem>
                    <DropdownMenuItem>Valor da Transação</DropdownMenuItem>
                    <DropdownMenuItem>Data da Transação</DropdownMenuItem>
                    <DropdownMenuItem>Status</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm whitespace-nowrap">
                    Transações de crédito a vista
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-xs sm:text-sm">
                    R$ 100,00
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg leading-tight">
                      Transação de crédito a vista
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Tempo de resposta do banco:</span>
                        <span className="font-medium text-foreground">{transaction.responseTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor da Transação:</span>
                        <span className="font-medium text-foreground">{transaction.transactionValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data da Transação:</span>
                        <span className="font-medium text-foreground">{transaction.transactionDate}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 text-sm"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="default"
                        className="flex-1 text-sm"
                        onClick={() => router.push(`/execution/${transaction.id}`)}
                      >
                        Iniciar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
