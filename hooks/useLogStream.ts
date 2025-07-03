import { useEffect, useState, useRef } from 'react';

export type LogEntry = {
    id: number;
    message: string;
    timestamp: string;
    testId: number;
};

export type LogStreamStatus = 'idle' | 'connecting' | 'connected' | 'complete' | 'error';

export function useLogStream(testId: number | null) {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [status, setStatus] = useState<LogStreamStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    const startStream = () => {
        if (!testId || eventSourceRef.current) return;

        setLogs([]);
        setStatus('connecting');
        setError(null);

        const eventSource = new EventSource(`/api/logs/${testId}`);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            setStatus('connected');
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === 'complete') {
                    setStatus('complete');
                    eventSource.close();
                    eventSourceRef.current = null;
                } else {
                    setLogs(prev => [...prev, data]);
                }
            } catch (err) {
                console.error('Error parsing log data:', err);
                setError('Error parsing log data');
            }
        };

        eventSource.onerror = (event) => {
            console.error('EventSource error:', event);
            setStatus('error');
            setError('Connection error');
            eventSource.close();
            eventSourceRef.current = null;
        };
    };

    const stopStream = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
            setStatus('idle');
        }
    };

    const clearLogs = () => {
        setLogs([]);
        setStatus('idle');
        setError(null);
    };

    useEffect(() => {
        return () => {
            stopStream();
        };
    }, []);

    return {
        logs,
        status,
        error,
        startStream,
        stopStream,
        clearLogs,
        isConnected: status === 'connected',
        isComplete: status === 'complete'
    };
}
