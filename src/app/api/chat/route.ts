// API route for chat completions
// POST /api/chat

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { PERSONA, MAX_RESPONSE_TOKENS } from '@/lib/config';

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
});

interface MessageParam {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, systemPrompt } = body as { 
      messages: MessageParam[];
      systemPrompt?: string;
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 },
      );
    }

    if (messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: at least one message required' },
        { status: 400 },
      );
    }

    // Use provided system prompt or default
    const finalSystemPrompt = systemPrompt || PERSONA;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: MAX_RESPONSE_TOKENS,
      system: finalSystemPrompt,
      messages,
    });

    const content = response.content[0];

    if (content.type !== 'text') {
      return NextResponse.json(
        { error: 'Unexpected response type from AI model' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        reply: content.text,
        modelId: response.model,
        stopReason: response.stop_reason,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `API Error: ${error.message}` },
        { status: error.status || 500 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
