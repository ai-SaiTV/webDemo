<script setup lang="ts">
import { ref } from 'vue';
import { useChat } from '@/composables/useChat';
import { useChatPolling } from '@/composables/useChatPolling';

const apiKey = ref('pat_DdQD93S1Vy2WBf0KZdOJ1ob5U9GzeR2Yjmkzaj5xVBq7EAAwd6OmSLKRmMnI4WYw');
const botId = ref('7449786123129847845');
const message = ref('帮我生成你好');

const { error: chatError, sendMessage } = useChat();  // 从 useChat composable 中导入 error 和 sendMessage方法
const {                                               // 从 useChatPolling composable 中导入以下属性和方法
  currentResponse: response,
  chatMessages,
  isPolling,
  error: pollingError,
  startPolling
} = useChatPolling();

const handleSubmit = async () => {    // 按钮槽函数
  if (!apiKey.value || !botId.value || !message.value) {
    console.log('Please fill in all fields');
    return;
  }

  try {
    const initialResponse = await sendMessage(apiKey.value, botId.value, message.value);   //对api发送请求
    await startPolling(apiKey.value, initialResponse);    //开始异步轮询
  } catch (err) {
    // Error handling is already done in useChat composable
    console.error(err);
  }
};
import { useRouter } from 'vue-router';

const router = useRouter();

const startDesign = () => {
  router.push('/design');
};

const viewDashboard = () => {
  router.push('/backend');
};
</script>

<template>
  <div class="relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 bg-[#f6f8fa]">
      <div class="absolute inset-0 bg-gradient-to-br from-[#3451b2]/5 to-transparent"></div>
    </div>

    <!-- Content -->
    <div class="relative max-w-6xl mx-auto px-6 pt-32 pb-24">
      <div class="text-center">
        <div class="header flex items-center justify-center mb-6">
          <h1 class="text-5xl font-bold bg-gradient-to-r from-[#3451b2] to-[#5c6ac4] text-transparent bg-clip-text mr-4">
            教学管理系统
          </h1>
          <img src="@/assets/1.png" alt="教学管理系统" class="header-image">
        </div>
        <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          让教学设计更智能，课堂管理更高效。基于 AI 技术，为教师提供全方位的智能教学解决方案。
        </p>
        <div class="flex gap-4 justify-center">
          <button
              @click="handleSubmit"
              :disabled="isPolling || !apiKey || !botId || !message"
              class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {{ isPolling ? 'Generating Response...' : 'Send Message' }}
            </button>
          <button
            @click="startDesign"
            class="px-6 py-3 bg-[#3451b2] text-white rounded-lg hover:bg-[#2d469d] transition-colors"
          >
            教学设计
          </button>
          <button
            @click="viewDashboard"
            class="px-6 py-3 bg-white text-[#3451b2] rounded-lg hover:bg-gray-50 transition-colors border border-[#3451b2]"
          >
            后端管理系统
          </button>
          
        </div>
      </div>

      <!-- Preview Image -->
      <div class="mt-16 relative">
        <div class="absolute inset-0 bg-gradient-to-t from-[#f6f8fa] to-transparent z-10 h-20 bottom-0"></div>
        <div class="rounded-xl shadow-2xl border border-gray-200/50 bg-white p-8 aspect-[16/9]">
          <div class="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
            预览图片
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>

