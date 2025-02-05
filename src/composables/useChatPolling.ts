import { ref, onUnmounted } from 'vue';
import { chatApi } from '@/services/api/chatApi';
import type { ChatResponse, ChatMessagesResponse } from '@/types/api';
import { POLLING_INTERVAL, CHAT_STATUS } from '@/utils/constants';

export function useChatPolling() {
  const currentResponse = ref<ChatResponse | null>(null);
  const chatMessages = ref<ChatMessagesResponse | null>(null);
  const isPolling = ref(false);
  const error = ref('');
  const pollingInterval = ref<number | null>(null);

  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value);
      pollingInterval.value = null;
    }
    isPolling.value = false;
  };

  const fetchChatMessages = async (apiKey: string, chatId: string, conversationId: string) => {
    try {
      const messages = await chatApi.retrieveChatMessages(apiKey, chatId, conversationId);
      chatMessages.value = messages;
    } catch (err: any) {
      error.value = err.message || 'Failed to retrieve chat messages';
    }
  };

  const startPolling = async (apiKey: string, initialResponse: ChatResponse) => {
    currentResponse.value = initialResponse;
    const { id: chatId, conversation_id: conversationId } = initialResponse.data;
    
    if (!chatId || !conversationId) {
      error.value = 'Invalid chat or conversation ID';
      return;
    }

    isPolling.value = true;
    error.value = '';

    pollingInterval.value = setInterval(async () => {
      try {
        const response = await chatApi.retrieveChat(apiKey, chatId, conversationId);
        currentResponse.value = response;

        if (response.data.status !== CHAT_STATUS.IN_PROGRESS) {
          await fetchChatMessages(apiKey, chatId, conversationId);
          stopPolling();
        }
      } catch (err: any) {
        error.value = err.message || 'Failed to retrieve chat status';
        stopPolling();
      }
    }, POLLING_INTERVAL) as unknown as number;
  };

  onUnmounted(stopPolling);

  return {
    currentResponse,
    chatMessages,
    isPolling,
    error,
    startPolling,
    stopPolling
  };
}