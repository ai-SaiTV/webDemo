import type { ChatRequest, ChatResponse, ChatMessagesResponse } from '@/types/api';
import { createApiClient } from '@/utils/api';

export const chatApi = {
  sendMessage: async (apiKey: string, botId: string, message: string): Promise<ChatResponse> => {
    const client = createApiClient(apiKey);
    const payload: ChatRequest = {
      bot_id: botId,
      user_id: "11",
      stream: false,
      auto_save_history: true,
      additional_messages: [
        {
          role: "user",
          content: message,
          content_type: "text"
        }
      ]
    };

    const response = await client.post<ChatResponse>('/chat', payload);
    return response.data;
  },

  retrieveChat: async (apiKey: string, chatId: string, conversationId: string): Promise<ChatResponse> => {
    const client = createApiClient(apiKey);
    const response = await client.get<ChatResponse>('/chat/retrieve', {
      params: {
        chat_id: chatId,
        conversation_id: conversationId
      }
    });
    return response.data;
  },

  retrieveChatMessages: async (apiKey: string, chatId: string, conversationId: string): Promise<ChatMessagesResponse> => {
    const client = createApiClient(apiKey);
    const response = await client.get<ChatMessagesResponse>('/chat/message/list', {
      params: {
        chat_id: chatId,
        conversation_id: conversationId
      }
    });
    return response.data;
  }
};