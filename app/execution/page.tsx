"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "@/components/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  Zap,
  Target
} from "lucide-react";

type ExecutionStatus = "idle" | "running" | "success" | "error" | "paused";

interface TestCase {
  id: string;
  name: string;
  description: string;
  type: string;
  value: string;
  date: string;
  expectedTime: number;
  logs: string[];
}

export default function ExecutionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get('id');

  const [status, setStatus] = useState<ExecutionStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentTest, setCurrentTest] = useState<TestCase | null>(null);

  // Mock data for different test cases
  const testCases: Record<string, TestCase> = {
    "1": {
      id: "1",
      name: "Teste de Transação de Crédito",
      description: "Validação de transação de crédito à vista",
      type: "Transação de Crédito",
      value: "R$ 100,00",
      date: "03/07/2025",
      expectedTime: 3000,
      logs: [
        "Iniciando teste de transação de crédito...",
        "Conectando com o banco de dados...",
        "Validando parâmetros da transação...",
        "Processando transação de R$ 100,00...",
        "Verificando tempo de resposta do banco...",
        "Validando regras de negócio...",
        "Finalizando processo de teste...",
        "Teste concluído com sucesso!"
      ]
    },
    "2": {
      id: "2",
      name: "Teste de Transação de Débito",
      description: "Validação de transação de débito automático",
      type: "Transação de Débito",
      value: "R$ 250,00",
      date: "03/07/2025",
      expectedTime: 2500,
      logs: [
        "Iniciando teste de transação de débito...",
        "Conectando com sistema de débito automático...",
        "Validando saldo disponível...",
        "Processando débito de R$ 250,00...",
        "Verificando autorização bancária...",
        "Confirmando transação...",
        "Enviando comprovante...",
        "Teste de débito finalizado com sucesso!"
      ]
    },
    "3": {
      id: "3",
      name: "Teste de PIX",
      description: "Validação de transferência via PIX",
      type: "PIX",
      value: "R$ 75,50",
      date: "03/07/2025",
      expectedTime: 1500,
      logs: [
        "Iniciando teste de PIX...",
        "Conectando com sistema PIX...",
        "Validando chave PIX...",
        "Processando transferência de R$ 75,50...",
        "Verificando disponibilidade do banco receptor...",
        "Confirmando transferência instantânea...",
        "Enviando comprovante PIX...",
        "Teste PIX concluído com sucesso!"
      ]
    }
  };

  useEffect(() => {
    if (testId && testCases[testId]) {
      setCurrentTest(testCases[testId]);
    } else {
      // Fallback to default test if no ID or invalid ID
      setCurrentTest(testCases["1"]);
    }
  }, [testId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "running") {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setStatus("success");
            return 100;
          }
          return prev + 2;
        });
        setDuration((prev) => prev + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleStart = () => {
    if (!currentTest) return;

    setStatus("running");
    setProgress(0);
    setDuration(0);
    setLogs([]);

    // Use logs específicos do teste atual
    const testLogs = currentTest.logs;

    testLogs.forEach((log, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, (index + 1) * 1000);
    });
  };

  const handlePause = () => {
    setStatus("paused");
  };

  const handleStop = () => {
    setStatus("idle");
    setProgress(0);
    setDuration(0);
    setLogs([]);
  };

  const handleReset = () => {
    setStatus("idle");
    setProgress(0);
    setDuration(0);
    setLogs([]);
  };

  const getStatusColor = () => {
    switch (status) {
      case "running": return "bg-blue-500";
      case "success": return "bg-green-500";
      case "error": return "bg-red-500";
      case "paused": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "running": return <Activity className="h-4 w-4" />;
      case "success": return <CheckCircle className="h-4 w-4" />;
      case "error": return <XCircle className="h-4 w-4" />;
      case "paused": return <AlertCircle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-4 gap-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Execução de Teste</h1>
                <p className="text-sm text-muted-foreground">
                  {currentTest?.description || "Carregando teste..."}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 w-full lg:w-auto justify-end">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {getStatusIcon()}
                    <span>Status da Execução</span>
                  </CardTitle>
                  <Badge variant="secondary" className={`${getStatusColor()} text-white`}>
                    {status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStatusColor()}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Tempo decorrido: {formatTime(duration)}</span>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  <Button
                    onClick={handleStart}
                    disabled={status === "running"}
                    className="flex items-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Iniciar</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handlePause}
                    disabled={status !== "running"}
                    className="flex items-center space-x-2"
                  >
                    <Pause className="h-4 w-4" />
                    <span>Pausar</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleStop}
                    disabled={status === "idle"}
                    className="flex items-center space-x-2"
                  >
                    <Square className="h-4 w-4" />
                    <span>Parar</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="flex items-center space-x-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reiniciar</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Logs de Execução</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto">
                  <div className="font-mono text-sm space-y-1">
                    {logs.length === 0 ? (
                      <p className="text-muted-foreground">Nenhum log disponível. Clique em "Iniciar" para começar.</p>
                    ) : (
                      logs.map((log, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <span className="text-muted-foreground text-xs">
                            {formatTime(index + 1)}
                          </span>
                          <span className="text-sm">{log}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Detalhes do Teste</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentTest ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">ID:</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Nome:</span>
                      <span className="text-sm font-medium">{currentTest.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tipo:</span>
                      <span className="text-sm font-medium">{currentTest.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valor:</span>
                      <span className="text-sm font-medium">{currentTest.value}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Data:</span>
                      <span className="text-sm font-medium">{currentTest.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tempo esperado:</span>
                      <span className="text-sm font-medium">{currentTest.expectedTime}ms</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">Carregando dados do teste...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {status === "success" ? "100%" : `${progress}%`}
                    </div>
                    <div className="text-xs text-muted-foreground">Conclusão</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatTime(duration)}
                    </div>
                    <div className="text-xs text-muted-foreground">Tempo</div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Performance:</span>
                    <Badge variant={status === "success" ? "default" : "secondary"}>
                      {status === "success" ? "Excelente" : "Executando..."}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
