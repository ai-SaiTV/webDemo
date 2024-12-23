import type { AxiosError } from 'axios';

export interface ChatMessage {
  role: string;
  content: string;
  content_type: string;
}

export interface ChatRequest {
  bot_id: string;
  user_id: string;
  stream: false;
  auto_save_history: boolean;
  additional_messages: ChatMessage[];
}

export interface ErrorResponse {
  code: number;
  msg: string;
}

export interface ChatUsage {
  token_count: number;
  output_count: number;
  input_count: number;
}

export interface ChatData {
  id: string;
  conversation_id: string;
  bot_id: string;
  created_at: number;
  completed_at?: number;
  failed_at?: number;
  last_error: ErrorResponse;
  status: 'created' | 'in_progress' | 'completed' | 'failed' | 'requires_action' | 'canceled';
  usage?: ChatUsage;
}

export interface ChatResponse {
  data: ChatData;
  code: number;
  msg: string;
}

export interface MessageObject {
  id: string;
  conversation_id: string;
  bot_id: string;
  chat_id: string;
  content: string;
  content_type: string;
  role: 'user' | 'assistant';
  type: 'question' | 'answer' | 'function_call' | 'tool_output' | 'tool_response' | 'follow_up' | 'verbose';
  created_at?: number;
  updated_at?: number;
}

export interface ChatMessagesResponse {
  data: MessageObject[];
  code: number;
  msg: string;
}

export type ApiError = AxiosError<ChatResponse>;