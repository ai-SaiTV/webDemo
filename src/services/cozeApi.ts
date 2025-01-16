import axios from 'axios';
import type { ChatRequest, ChatResponse } from '../types/api';

const BASE_URL = 'https://api.coze.cn/v3';

export const sendChatMessage = async (apiKey: string, botId: string, message: string): Promise<ChatResponse> => {
  const payload: ChatRequest = {
    bot_id: botId,
    user_id: "0",
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

  const response = await axios.post<ChatResponse>(`${BASE_URL}/chat`, payload, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
};

export const checkResponseStatus = async (apiKey: string, responseId: string): Promise<ChatResponse> => {
  const response = await axios.get<ChatResponse>(`${BASE_URL}/chat/${responseId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
};