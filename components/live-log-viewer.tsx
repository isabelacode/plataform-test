'use client';

import { useLogStream, LogEntry } from '@/hooks/useLogStream';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Square, RotateCcw, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface LiveLogViewerProps {
  testId: number | null;
  testName?: string;
  onLogEntry?: (log: LogEntry) => void;
}

export function LiveLogViewer({ testId, testName, onLogEntry }: LiveLogViewerProps) {
  const { logs, status, error, startStream, stopStream, clearLogs, isConnected, isComplete } = useLogStream(testId);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (logs.length > 0 && onLogEntry) {
      onLogEntry(logs[logs.length - 1]);
    }
  }, [logs, onLogEntry]);

  const getStatusColor = () => {
    switch (status) {
      case 'connecting':
        return 'bg-yellow-500';
      case 'connected':
        return 'bg-green-500';
      case 'complete':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connecting':
        return 'Conectando...';
      case 'connected':
        return 'Conectado';
      case 'complete':
        return 'Concluído';
      case 'error':
        return 'Erro';
      default:
        return 'Parado';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Logs em Tempo Real
              <Badge variant="outline" className={`${getStatusColor()} text-white`}>
                {getStatusText()}
              </Badge>
            </CardTitle>
            {testName && (
              <CardDescription>
                {testName} {testId && `(ID: ${testId})`}
              </CardDescription>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={startStream}
              disabled={!testId || isConnected || status === 'connecting'}
              size="sm"
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Iniciar
            </Button>
            
            <Button
              onClick={stopStream}
              disabled={!isConnected && status !== 'connecting'}
              size="sm"
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Square className="h-4 w-4" />
              Parar
            </Button>
            
            <Button
              onClick={clearLogs}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Limpar
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        <ScrollArea className="h-96 w-full border rounded-md p-4" ref={scrollAreaRef}>
          {logs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {testId ? 'Nenhum log ainda. Clique em "Iniciar" para começar.' : 'Selecione um teste para ver os logs.'}
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md">
                  <Badge variant="outline" className="text-xs font-mono shrink-0">
                    {formatTimestamp(log.timestamp)}
                  </Badge>
                  <span className="text-sm leading-relaxed">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {logs.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            {logs.length} log{logs.length !== 1 ? 's' : ''} • {getStatusText()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
