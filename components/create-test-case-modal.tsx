"use client";

import { useState } from "react";
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
import { createTransaction } from "@/services/dataTestsParameterized";

interface CreateTestCaseModalProps {
  children: React.ReactNode;
  onTestCaseCreated?: () => void;
}

export function CreateTestCaseModal({ children, onTestCaseCreated }: CreateTestCaseModalProps) {
  const [formData, setFormData] = useState({
    testName: "",
    description: "",
    responseTime: "",
    transactionValue: "",
    transactionDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
      await createTransaction({
        responseTime: formData.responseTime,
        transactionValue: formData.transactionValue,
        transactionDate: formData.transactionDate,
      });

      setFormData({
        testName: "",
        description: "",
        responseTime: "",
        transactionValue: "",
        transactionDate: "",
      });

      setIsOpen(false);

      if (onTestCaseCreated) {
        onTestCaseCreated();
      }
    } catch (error) {
      console.error("Erro ao criar caso de teste:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Teste de Caso</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testName">Nome do Teste</Label>
            <Input
              id="testName"
              placeholder="Adicione um nome"
              value={formData.testName}
              onChange={(e) => handleInputChange("testName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Adicione uma descrição"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responseTime">Tempo de resposta do banco:</Label>
            <Input
              id="responseTime"
              placeholder="Adicione um valor"
              value={formData.responseTime}
              onChange={(e) => handleInputChange("responseTime", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionValue">Valor da Transição:</Label>
            <Input
              id="transactionValue"
              placeholder="Adicione um valor"
              value={formData.transactionValue}
              onChange={(e) => handleInputChange("transactionValue", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transactionDate">Data da Transição:</Label>
            <Input
              id="transactionDate"
              type="date"
              placeholder="Adicione um valor"
              value={formData.transactionDate}
              onChange={(e) => handleInputChange("transactionDate", e.target.value)}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="px-8" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Novo Teste de Caso"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
