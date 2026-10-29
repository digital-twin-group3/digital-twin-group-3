// Neon database client initialization

import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL environment variable');
}

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

// Types for database operations
export interface ConversationRow {
  id: string;
  user_id?: string;
  messages: unknown;
  metadata?: unknown;
  created_at: string;
  updated_at: string;
}

export interface LeadRow {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  conversation_id: string;
  created_at: string;
}

// Database operations

export async function saveConversation(conversationId: string, messages: unknown, metadata?: unknown) {
  const query = `
    INSERT INTO conversations (id, messages, metadata, updated_at)
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (id) DO UPDATE SET messages = $2, metadata = $3, updated_at = NOW()
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [conversationId, JSON.stringify(messages), metadata ? JSON.stringify(metadata) : null]);
    return result.rows[0];
  } catch (error) {
    console.error('Error saving conversation:', error);
    throw error;
  }
}

export async function saveLead(lead: Omit<LeadRow, 'created_at'>) {
  const query = `
    INSERT INTO leads (name, email, company, role, conversation_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [
      lead.name,
      lead.email,
      lead.company || null,
      lead.role || null,
      lead.conversation_id,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error('Error saving lead:', error);
    throw error;
  }
}

export async function getConversation(conversationId: string) {
  const query = `SELECT * FROM conversations WHERE id = $1;`;
  
  try {
    const result = await pool.query(query, [conversationId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
}
