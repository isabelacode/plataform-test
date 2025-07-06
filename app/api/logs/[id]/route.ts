import { NextRequest, NextResponse } from 'next/server';
import { getTestCase } from '@/services/dataTestsParameterized';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params
    const resolvedParams = await Promise.resolve(params);
    const testId = parseInt(resolvedParams.id);
    
    if (isNaN(testId)) {
      return NextResponse.json({ error: 'Invalid test ID' }, { status: 400 });
    }

    const testCase = await getTestCase(testId);
    
    if (!testCase) {
      return NextResponse.json({ error: 'Test case not found' }, { status: 404 });
    }

    const headers = new Headers({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    });

  const stream = new ReadableStream({
    start(controller) {
      const sendLog = (log: string, index: number) => {
        const data = JSON.stringify({
          id: index,
          message: log,
          timestamp: new Date().toISOString(),
          testId: testId
        });
        
        controller.enqueue(`data: ${data}\n\n`);
      };

      const sendComplete = () => {
        const data = JSON.stringify({
          type: 'complete',
          testId: testId,
          timestamp: new Date().toISOString()
        });
        
        controller.enqueue(`data: ${data}\n\n`);
        controller.close();
      };

      let logIndex = 0;
      const intervalTime = testCase.expectedTime / testCase.logs.length;

      const interval = setInterval(() => {
        if (logIndex < testCase.logs.length) {
          sendLog(testCase.logs[logIndex], logIndex);
          logIndex++;
        } else {
          clearInterval(interval);
          sendComplete();
        }
      }, intervalTime);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, { headers });
  
  } catch (error) {
    console.error('Error in logs API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
