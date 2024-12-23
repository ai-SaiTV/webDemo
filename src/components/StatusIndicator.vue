<script setup lang="ts">
// 定义所有可能的状态类型
type StatusType = 'created' | 'in_progress' | 'completed' | 'failed' | 'requires_action' | 'canceled' | null;

// 更新 props 定义
defineProps<{
  status: StatusType;
}>();
</script>

<template>
  <div v-if="status" class="flex items-center justify-center space-x-2 p-2">
    <div 
      class="w-2 h-2 rounded-full"
      :class="{
        'bg-yellow-400 animate-pulse': status === 'in_progress' || status === 'created',
        'bg-green-500': status === 'completed',
        'bg-red-500': status === 'failed' || status === 'canceled',
        'bg-blue-500': status === 'requires_action'
      }"
    ></div>
    <span 
      class="text-sm font-medium"
      :class="{
        'text-yellow-600': status === 'in_progress' || status === 'created',
        'text-green-600': status === 'completed',
        'text-red-600': status === 'failed' || status === 'canceled',
        'text-blue-600': status === 'requires_action'
      }"
    >
      {{ status === 'created' ? 'Request created...' :
         status === 'in_progress' ? 'AI is generating your response...' : 
         status === 'completed' ? 'Response complete!' : 
         status === 'requires_action' ? 'Action required' :
         status === 'canceled' ? 'Request canceled' :
         'Failed to generate response' }}
    </span>
  </div>
</template>