<script setup lang="ts">
import type { MessageObject } from '../types/api';

defineProps<{
  message: MessageObject;
}>();
</script>

<template>
  <div 
    class="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 shadow-sm"
  >
    <div class="text-purple-800 font-medium text-lg mb-2">Assistant</div>
    <div class="text-gray-800 whitespace-pre-wrap leading-relaxed">
      {{ message.content }}
    </div>
  </div>
</template>