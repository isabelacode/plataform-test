"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, Filter } from "lucide-react";
import { UserMenu } from "@/components/user-menu";
import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("disponivel");
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Pesquisar ou publicar o slug..."
                  className="pl-10 w-full lg:w-80"
                />
              </div>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "disponivel" && (
          <>
            {/* Filters */}
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

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg leading-tight">
                      Transação de crédito a vista
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      variant="default" 
                      className="w-full bg-gray-800 hover:bg-gray-900 text-white text-sm sm:text-base py-2"
                    >
                      Criar Caso de Teste
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === "parametrizados" && (
          <>
            {/* Filters for Parametrizados */}
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

            {/* Cards Grid for Parametrizados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={`param-${index}`} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg leading-tight">
                      Transação de crédito a vista
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Tempo de resposta do banco:</span>
                        <span className="font-medium">3000ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor da Transação:</span>
                        <span className="font-medium">R$ 100,00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data da Transação:</span>
                        <span className="font-medium">02/04/2024</span>
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
                        className="flex-1 bg-gray-800 hover:bg-gray-900 text-white text-sm"
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
