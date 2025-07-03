"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "@/components/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { SimpleLogViewer } from "@/components/simple-log-viewer";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
    Target,
    FileText
} from "lucide-react";
import {
    getTestCase,
    startTransaction,
    stopTransaction,
    pauseTransaction,
    restartTransaction
} from "@/services/dataTestsParameterized";
import { TestCase } from "@/types";

type ExecutionStatus = "idle" | "running" | "success" | "error" | "paused";

export default function ExecutionPage() {
    const router = useRouter();
    const params = useParams();
    const testId = params.id as string;

    const [status, setStatus] = useState<ExecutionStatus>("idle");
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);
    const [currentTest, setCurrentTest] = useState<TestCase | null>(null);

    useEffect(() => {
        const loadTest = async () => {
            try {
                const testIdNum = parseInt(testId);
                const testCase = await getTestCase(testIdNum);

                if (testCase) {
                    setCurrentTest(testCase);
                } else {
                    router.push('/execution/1');
                }
            } catch (error) {
                console.error('Erro ao carregar teste:', error);
                router.push('/execution/1');
            }
        };

        if (testId) {
            loadTest();
        }
    }, [testId, router]);

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

    const handleStart = async () => {
        if (!currentTest) return;

        try {
            setStatus("running");
            setProgress(0);
            setDuration(0);
            setLogs([]);

            const result = await startTransaction(currentTest.id);

            if (result) {
                const testLogs = currentTest.logs;

                testLogs.forEach((log, index) => {
                    setTimeout(() => {
                        setLogs(prev => [...prev, log]);
                    }, (index + 1) * 1000);
                });
            }
        } catch (error) {
            console.error('Erro ao iniciar teste:', error);
            setStatus("error");
        }
    };

    const handlePause = async () => {
        if (!currentTest) return;

        try {
            const result = await pauseTransaction(currentTest.id);
            if (result) {
                setStatus("paused");
            }
        } catch (error) {
            console.error('Erro ao pausar teste:', error);
        }
    };

    const handleStop = async () => {
        if (!currentTest) return;

        try {
            const result = await stopTransaction(currentTest.id);
            if (result) {
                setStatus("idle");
                setProgress(0);
                setDuration(0);
                setLogs([]);
            }
        } catch (error) {
            console.error('Erro ao parar teste:', error);
        }
    };

    const handleReset = async () => {
        if (!currentTest) return;

        try {
            const result = await restartTransaction(currentTest.id);
            if (result) {
                setStatus("idle");
                setProgress(0);
                setDuration(0);
                setLogs([]);
            }
        } catch (error) {
            console.error('Erro ao reiniciar teste:', error);
        }
    };

    const handleGenerateReport = () => {
        if (!currentTest) return;
        router.push(`/relatorio/${currentTest.id}`);
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

    if (!currentTest) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando teste...</p>
                </div>
            </div>
        );
    }

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
                                <h1 className="text-xl sm:text-2xl font-bold">Execução de Teste </h1>
                                <p className="text-sm text-muted-foreground">
                                    {currentTest.description}
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

                        <SimpleLogViewer 
                            testId={currentTest.id}
                            testName={currentTest.name}
                        />
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
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">ID:</span>
                                        <span className="text-sm font-medium">#{currentTest.id}</span>
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
                                        <span className="text-sm font-medium">{currentTest.transactionValue}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Data:</span>
                                        <span className="text-sm font-medium">{currentTest.transactionDate}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Tempo de Resposta:</span>
                                        <span className="text-sm font-medium">{currentTest.responseTime}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Tempo esperado:</span>
                                        <span className="text-sm font-medium">{currentTest.expectedTime}ms</span>
                                    </div>
                                </div>
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

                                <div className="pt-4 border-t">
                                    <Button 
                                        onClick={handleGenerateReport}
                                        disabled={status !== "success" && status !== "error"}
                                        className="w-full flex items-center justify-center space-x-2"
                                        variant={status === "success" || status === "error" ? "default" : "outline"}
                                    >
                                        <FileText className="h-4 w-4" />
                                        <span>Gerar Relatório</span>
                                    </Button>
                                    {status !== "success" && status !== "error" && (
                                        <p className="text-xs text-muted-foreground text-center mt-2">
                                            Disponível após conclusão do teste
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
