'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SimpleLogViewerProps {
  testId: number;
  testName?: string;
}

export function SimpleLogViewer({ testId, testName }: SimpleLogViewerProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState<'idle' | 'streaming' | 'complete' | 'error'>('idle');

  const startLogStream = () => {
    if (isStreaming) return;

    setLogs([]);
    setIsStreaming(true);
    setStatus('streaming');

    const eventSource = new EventSource(`/api/logs/${testId}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'complete') {
          setStatus('complete');
          setIsStreaming(false);
          eventSource.close();
        } else {
          setLogs(prev => [...prev, data.message]);
        }
      } catch (error) {
        console.error('Erro ao processar log:', error);
        setStatus('error');
        setIsStreaming(false);
        eventSource.close();
      }
    };

    eventSource.onerror = (error) => {
      console.error('Erro no EventSource:', error);
      setStatus('error');
      setIsStreaming(false);
      eventSource.close();
    };
  };

  const stopLogStream = () => {
    setIsStreaming(false);
    setStatus('idle');
  };

  const clearLogs = () => {
    setLogs([]);
    setStatus('idle');
  };

  const getStatusColor = () => {
    switch (status) {
      case 'streaming':
        return 'bg-green-500';
      case 'complete':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Logs em Tempo Real
              <Badge variant="outline" className={`${getStatusColor()} text-white`}>
                {status === 'streaming' ? 'Conectado' : 
                 status === 'complete' ? 'Concluído' : 
                 status === 'error' ? 'Erro' : 'Parado'}
              </Badge>
            </CardTitle>
            {testName && (
              <CardDescription>
                {testName} (ID: {testId})
              </CardDescription>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={startLogStream}
              disabled={isStreaming}
              size="sm"
            >
              {isStreaming ? 'Streaming...' : 'Iniciar'}
            </Button>
            
            <Button
              onClick={clearLogs}
              size="sm"
              variant="outline"
            >
              Limpar
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto">
          <div className="font-mono text-sm space-y-1">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">
                Nenhum log ainda. Clique em "Iniciar" para começar o streaming.
              </p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-muted-foreground text-xs">
                    {new Date().toLocaleTimeString()}
                  </span>
                  <span className="text-sm">{log}</span>
                </div>
              ))
            )}
          </div>
        </div>
        
        {logs.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            {logs.length} log{logs.length !== 1 ? 's' : ''} recebido{logs.length !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
