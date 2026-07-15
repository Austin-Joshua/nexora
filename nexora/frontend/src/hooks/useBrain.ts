import { useState, useCallback, useEffect, useRef } from 'react';
import { brainApi } from '../api/brainApi';
import type { BrainMessage } from '../types/Brain';

export function useBrain() {
  const [messages, setMessages] = useState<BrainMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const historyLoaded = useRef(false);

  // Load conversation history on first mount
  useEffect(() => {
    if (historyLoaded.current) return;
    historyLoaded.current = true;

    const loadHistory = async () => {
      try {
        const history = await brainApi.getHistory();
        if (history && history.length > 0) {
          // Convert backend conversation records → BrainMessage pairs
          const historicMessages: BrainMessage[] = [];
          history.slice().reverse().forEach((conv) => {
            historicMessages.push({
              id: `h-user-${conv.id}`,
              type: 'user',
              content: conv.userQuery,
              timestamp: conv.createdAt ? new Date(conv.createdAt) : new Date(),
            });
            historicMessages.push({
              id: `h-ai-${conv.id}`,
              type: 'assistant',
              content: conv.aiResponse,
              timestamp: conv.createdAt ? new Date(conv.createdAt) : new Date(),
            });
          });
          setMessages(historicMessages);
        }
      } catch {
        // history load failing is non-fatal – start fresh
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();
  }, []);

  const sendQuery = useCallback(async (query: string) => {
    const userMessage: BrainMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await brainApi.query(query);
      const assistantMessage: BrainMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        referencedEmails: response.referencedEmails,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errMsg = err?.response?.status === 429
        ? 'Query limit reached (20/hour). Please try again later.'
        : 'Something went wrong. Please try again.';
      setError(errMsg);
      const errorMsg: BrainMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: errMsg,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, isLoading, historyLoading, error, sendQuery, clearMessages };
}
