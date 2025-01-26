import { ref, onUnmounted } from 'vue';
import { checkResponseStatus } from '../services/cozeApi';
import type { ChatResponse } from '../types/api';

export function useResponsePolling() {
  const pollingInterval = ref<number | null>(null);
  const currentResponse = ref<ChatResponse | null>(null);
  const isPolling = ref(false);
  const error = ref('');

  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value);
      pollingInterval.value = null;
    }
    isPolling.value = false;
  };

  const startPolling = async (apiKey: string, initialResponse: ChatResponse) => {
    currentResponse.value = initialResponse;
    isPolling.value = true;
    error.value = '';

    // Stop any existing polling
    stopPolling();

    // Start new polling
    pollingInterval.value = setInterval(async () => {
      try {
        const response = await checkResponseStatus(apiKey, initialResponse.data.id);
        currentResponse.value = response;

        // Stop polling if the status is no longer in_progress
        if (response.data.status !== 'in_progress') {
          stopPolling();
        }
      } catch (err: any) {
        error.value = err.message || 'Failed to check response status';
        stopPolling();
      }
    }, 2000) as unknown as number; // Poll every 2 seconds
  };

  // Clean up on component unmount
  onUnmounted(() => {
    stopPolling();
  });

  return {
    currentResponse,
    isPolling,
    error,
    startPolling,
    stopPolling
  };
}