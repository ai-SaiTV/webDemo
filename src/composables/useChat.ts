import { ref } from 'vue';
import { chatApi } from '@/services/api/chatApi';
import type { ChatResponse, ApiError } from '@/types/api';

export function useChat() {
  const response = ref<ChatResponse | null>(null);
  const error = ref<string>('');
  const isLoading = ref(false);

  const sendMessage = async (apiKey: string, botId: string, message: string) => {
    isLoading.value = true;
    error.value = '';

    try {
      response.value = await chatApi.sendMessage(apiKey, botId, message);
      return response.value;
    } catch (err) {
      const apiError = err as ApiError;
      error.value = apiError.response?.data.msg || 'Failed to send message';
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    response,
    error,
    isLoading,
    sendMessage
  };
}