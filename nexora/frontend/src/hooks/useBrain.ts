import { useState, useCallback } from 'react';
import { brainApi } from '../api/brainApi';
import type { BrainMessage } from '../types/Brain';

export function useBrain() {
  const [messages, setMessages] = useState<BrainMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return { messages, isLoading, error, sendQuery, clearMessages };
}
