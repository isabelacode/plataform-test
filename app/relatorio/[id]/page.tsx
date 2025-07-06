"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserMenu } from "@/components/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    ArrowLeft,
    FileText,
    Download,
    CheckCircle,
    Clock,
    Zap,
    Activity
} from "lucide-react";
import { getTestCase } from "@/services/dataTestsParameterized";
import { TestCase } from "@/types";

export default function RelatorioPage() {
    const router = useRouter();
    const params = useParams();
    const testId = params.id as string;
    const [currentTest, setCurrentTest] = useState<TestCase | null>(null);
    const [reportData, setReportData] = useState({
        executedAt: new Date().toLocaleDateString('pt-BR'),
        executedBy: 'João Silva (usuário ID 12345)',
        environment: 'Homologação',
        services: 'Auth-Service, Payment-Gateway, Notification-Service',
        status: 'Sucesso',
        executionTime: '0.43s'
    });

    useEffect(() => {
        const loadTest = async () => {
            try {
                const testIdNum = parseInt(testId);
                const testCase = await getTestCase(testIdNum);
                if (testCase) {
                    setCurrentTest(testCase);
                }
            } catch (error) {
                console.error('Erro ao carregar teste:', error);
            }
        };

        if (testId) {
            loadTest();
        }
    }, [testId]);

    const handleExportPDF = () => {
        console.log('Exportando relatório para PDF...');
    };

    const handleBackToList = () => {
        router.push('/');
    };

    if (!currentTest) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando relatório...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-card border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.back()}
                                className="flex items-center space-x-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center space-x-3">
                               <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Relatório</h1>
                                <span className="text-sm text-muted-foreground hidden sm:inline">
                                    Relatório de Execução de Testes - Plataforma de Micro-serviços
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <ThemeToggle />
                            <UserMenu />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <FileText className="h-5 w-5" />
                                <span>Relatório de Execução de Testes - Plataforma de Micro-serviços</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">**Teste executado em:**</span>
                                    <p className="text-sm">{reportData.executedAt} às 14:45</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">**Executado por:**</span>
                                    <p className="text-sm">{reportData.executedBy}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">**Ambiente:**</span>
                                    <p className="text-sm">{reportData.environment}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-muted-foreground">**Serviços envolvidos:**</span>
                                    <p className="text-sm">{reportData.services}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">## Etapa 1: Autenticação do Usuário</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm mb-2">##### Entrada esperada:</h4>
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    <pre className="text-xs text-gray-700 dark:text-gray-300">
                                        {`*json
{
  "email": "usuario@example.com",
  "senha": "********"
}
...`}
                                    </pre>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-sm mb-2">##### Saída final:</h4>
                                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    <pre className="text-xs text-gray-700 dark:text-gray-300">
                                        {`*json
{
  "status": "autenticado",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
...`}
                                    </pre>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium">**Resultado:** Sucesso</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span className="text-sm">**Tempo de execução:** {reportData.executionTime}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-center space-x-4 pt-6">
                        <Button
                            variant="outline"
                            onClick={handleBackToList}
                            className="flex items-center space-x-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Lista de Testes</span>
                        </Button>
                        <Button
                            onClick={handleExportPDF}
                            className="flex items-center space-x-2"
                        >
                            <Download className="h-4 w-4" />
                            <span>Exportar para PDF</span>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
