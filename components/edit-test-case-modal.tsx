"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateTransaction, getTestCase } from "@/services/dataTestsParameterized";
import { TestsParameterized, TestCase } from "@/types";

interface EditTestCaseModalProps {
  children: React.ReactNode;
  testCase: TestsParameterized;
  onTestCaseUpdated?: () => void;
}

export function EditTestCaseModal({ children, testCase, onTestCaseUpdated }: EditTestCaseModalProps) {
  const [formData, setFormData] = useState({
    testName: "",
    description: "",
    responseTime: "",
    transactionValue: "",
    transactionDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fullTestCase, setFullTestCase] = useState<TestCase | null>(null);

  useEffect(() => {
    if (isOpen && testCase) {
      const loadTestCase = async () => {
        try {
          const fullTest = await getTestCase(testCase.id);
          if (fullTest) {
            setFullTestCase(fullTest);
            setFormData({
              testName: fullTest.name || "",
              description: fullTest.description || "",
              responseTime: testCase.responseTime || "",
              transactionValue: testCase.transactionValue || "",
              transactionDate: testCase.transactionDate || "",
            });
          } else {
            setFormData({
              testName: "",
              description: "",
              responseTime: testCase.responseTime || "",
              transactionValue: testCase.transactionValue || "",
              transactionDate: testCase.transactionDate || "",
            });
          }
        } catch (error) {
          console.error("Erro ao carregar dados do teste:", error);
          setFormData({
            testName: "",
            description: "",
            responseTime: testCase.responseTime || "",
            transactionValue: testCase.transactionValue || "",
            transactionDate: testCase.transactionDate || "",
          });
        }
      };
      
      loadTestCase();
    }
  }, [isOpen, testCase]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedTransaction = await updateTransaction(testCase.id, {
        responseTime: formData.responseTime,
        transactionValue: formData.transactionValue,
        transactionDate: formData.transactionDate,
      });

      if (updatedTransaction) {
        setIsOpen(false);
        
        if (onTestCaseUpdated) {
          onTestCaseUpdated();
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar caso de teste:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] w-[95vw] max-w-[600px] px-8 sm:px-12 py-6 sm:py-10 rounded-2xl">
        <DialogHeader className="pb-6 sm:pb-8">
          <DialogTitle className="text-lg sm:text-xl">Editar Teste de Caso</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <Label htmlFor="editTestName" className="text-sm sm:text-base">Nome do Teste</Label>
            <Input
              id="editTestName"
              placeholder="Adicione um nome"
              value={formData.testName}
              onChange={(e) => handleInputChange("testName", e.target.value)}
              className="h-11 sm:h-12 rounded-xl"
            />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Label htmlFor="editDescription" className="text-sm sm:text-base">Descrição</Label>
            <Textarea
              id="editDescription"
              placeholder="Adicione uma descrição"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-[100px] sm:min-h-[120px] resize-none rounded-xl"
            />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Label htmlFor="editResponseTime" className="text-sm sm:text-base">Tempo de resposta do banco:</Label>
            <Input
              id="editResponseTime"
              placeholder="Adicione um valor"
              value={formData.responseTime}
              onChange={(e) => handleInputChange("responseTime", e.target.value)}
              className="h-11 sm:h-12 rounded-xl"
            />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Label htmlFor="editTransactionValue" className="text-sm sm:text-base">Valor da Transição:</Label>
            <Input
              id="editTransactionValue"
              placeholder="Adicione um valor"
              value={formData.transactionValue}
              onChange={(e) => handleInputChange("transactionValue", e.target.value)}
              className="h-11 sm:h-12 rounded-xl"
            />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Label htmlFor="editTransactionDate" className="text-sm sm:text-base">Data da Transição:</Label>
            <Input
              id="editTransactionDate"
              type="date"
              placeholder="Adicione um valor"
              value={formData.transactionDate}
              onChange={(e) => handleInputChange("transactionDate", e.target.value)}
              className="h-11 sm:h-12 rounded-xl"
            />
          </div>

          <div className="flex justify-center pt-6 sm:pt-8">
            <Button type="submit" className="px-8 sm:px-12 py-3 sm:py-4 h-11 sm:h-12 text-sm sm:text-base w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
