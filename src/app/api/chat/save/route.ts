// API route for saving conversations to database
// POST /api/chat/save

import { NextRequest, NextResponse } from 'next/server';
import { saveConversation } from '@/lib/supabase';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, messages } = body as {
      conversationId: string;
      messages: ConversationMessage[];
    };

    if (!conversationId || !messages) {
      return NextResponse.json(
        { error: 'Missing conversationId or messages' },
        { status: 400 },
      );
    }

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages must be an array' },
        { status: 400 },
      );
    }

    // Save conversation to database
    const result = await saveConversation(conversationId, messages);

    return NextResponse.json(
      { success: true, conversationId, result },
      { status: 200 },
    );
  } catch (error) {
    console.error('Save conversation error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to save conversation';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
