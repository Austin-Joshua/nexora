import type { Email } from './Email';

export interface BrainMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  referencedEmails?: Email[];
  timestamp: Date;
}

export interface BrainQueryResponse {
  answer: string;
  referencedEmails?: Email[];
  conversationId?: number;
}

export interface BrainConversation {
  id: number;
  userId: number;
  userQuery: string;
  aiResponse: string;
  referencedEmailIds?: string;
  createdAt?: string;
}
