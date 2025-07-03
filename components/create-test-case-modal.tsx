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

interface CreateTestCaseModalProps {
  children: React.ReactNode;
}

export function CreateTestCaseModal({ children }: CreateTestCaseModalProps) {
  const [formData, setFormData] = useState({
    testName: "",
    description: "",
    responseTime: "",
    transactionValue: "",
    transactionDate: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form data:", formData);
    // You can add logic to save the test case data
  };

  return (
    <Dialog>
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
            <Button type="submit" className="px-8">
              Criar Novo Teste de Caso
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
