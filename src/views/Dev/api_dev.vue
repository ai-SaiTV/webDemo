<template>
    <ChatInterface />
    <div class="text-center">
      Hello!
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import ChatInterface from '@/components/ChatInterface.vue'
  
  const message = ref<string>("hello")
  
  onMounted(() => {
    console.log('mounted')
  })
  </script>
  
  <style scoped>
  </style>