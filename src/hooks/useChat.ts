// Custom hook for managing chat state

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Message } from '@/types';
import { generateId, detectIntent } from '@/utils/helpers';

export interface UseChatOptions {
  initialMessages?: Message[];
  conversationId?: string;
  systemPrompt?: string;
}

export function useChat(options?: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(options?.initialMessages ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationId = useRef(options?.conversationId ?? generateId());
  const systemPromptRef = useRef(options?.systemPrompt);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      createdAt: new Date(),
      metadata: {
        intent: detectIntent(content),
      },
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages
            .concat(userMessage)
            .map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          systemPrompt: systemPromptRef.current,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.reply,
        createdAt: new Date(),
        metadata: {
          intent: 'general',
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save conversation to database
      try {
        const updatedMessages = [...messages, userMessage, assistantMessage];
        await fetch('/api/chat/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationId: conversationId.current,
            messages: updatedMessages.map((msg) => ({
              role: msg.role,
              content: msg.content,
              timestamp: msg.createdAt,
            })),
          }),
        });
      } catch (saveErr) {
        console.warn('Failed to save conversation:', saveErr);
        // Don't fail the chat if save fails
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    conversationId.current = generateId();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    conversationId: conversationId.current,
    sendMessage,
    clearMessages,
    clearError,
  };
}
