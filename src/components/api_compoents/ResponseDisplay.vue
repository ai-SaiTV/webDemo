<script setup lang="ts">
import type { ChatResponse, ChatMessagesResponse } from '@/types/api';
import ChatMessage from './ChatMessage.vue';
import { computed } from '@vue/runtime-core';

const props = defineProps<{
  response: ChatResponse | null;
  messages: ChatMessagesResponse | null;
}>();

const assistantAnswers = computed(() => {
  if (!props.messages) return [];
  return props.messages.data.filter(
    message => message.role === 'assistant' && message.type === 'answer'
  );
});
</script>

<template>
  <div v-if="messages && assistantAnswers.length > 0" class="mt-6 space-y-4">
    <ChatMessage 
      v-for="message in assistantAnswers" 
      :key="message.id"
      :message="message"
    />
  </div>
</template>