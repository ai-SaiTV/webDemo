<script setup lang="ts">
import { ref, onMounted } from '@vue/runtime-core';
import { Document, TrendCharts, Collection } from '@element-plus/icons-vue';
import RadiatingLines from './RadiatingLines.vue';
import ContentFrame from './ContentFrame.vue';

const currentFeature = ref(0);
const features = [
  {
    title: '智能生成',
    subtitle: '基于AI技术，快速生成专业教案',
    icon: Document,
    images: [
      { id: 1, position: { x: -400, y: -300 } },
      { id: 2, position: { x: 400, y: -240 } },
      { id: 3, position: { x: -370, y: 220 } },
      { id: 4, position: { x: 300, y: 210 } }
    ]
  },
  {
    title: '数据分析',
    subtitle: '深入分析学情，优化教学策略',
    icon: TrendCharts,
    images: [
      { id: 1, position: { x: -400, y: -300 } },
      { id: 2, position: { x: 400, y: -240 } },
      { id: 3, position: { x: -370, y: 220 } },
      { id: 4, position: { x: 300, y: 210 } }
    ]
  },
  {
    title: '资源管理',
    subtitle: '教学资源智能管理与推荐',
    icon: Collection,
    images: [
      { id: 1, position: { x: -400, y: -300 } },
      { id: 2, position: { x: 400, y: -240 } },
      { id: 3, position: { x: -370, y: 220 } },
      { id: 4, position: { x: 300, y: 210 } }
    ]
  }
];

// Handle scroll event
const handleScroll = (event: WheelEvent) => {
  
  if (event.deltaY > 0) {
    // Scrolling down
    if (currentFeature.value < features.length - 1) {
      currentFeature.value++;
    }
  } else {
    // Scrolling up
    if (currentFeature.value > 0) {
      currentFeature.value--;
    }
  }
};

onMounted(() => {
  window.addEventListener('wheel', handleScroll);
});
</script>

<template>
  <div class="app-container">
    <!-- Radiating lines background -->
    <RadiatingLines />
    
    <div class="hero-section">
      <!-- Rectangular frame around content -->
      <ContentFrame 
        :features="features" 
        :currentFeature="currentFeature"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a2a6c, #1890ff, #36cfc9);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  overflow: hidden;
  position: relative;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.hero-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
  width: 100%;
  text-align: center;
  padding: 0 2rem;
  transition: all 0.5s ease;
  position: relative;
  z-index: 1;
}
</style>