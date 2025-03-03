<script setup lang="ts">
import { ref, onMounted, reactive } from '@vue/runtime-core';
import FeatureImage from '@/components/ani_compoents/FeatureImages.vue';
import Particles from '@/components/ani_compoents/Particles.vue';
import FeatureContent from '@/components/ani_compoents/FeatureContent.vue';
import { Document, TrendCharts, Collection } from '@element-plus/icons-vue';


interface Image {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
}

interface Feature {
  title: string;
  subtitle: string;
  icon: any;
  images: { id: number; position: { x: number; y: number } }[];
}


const currentFeature = ref<number>(0);


const features: Feature[] = [
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


const featureImages = reactive<{
  current: Image[];
  previous: Image[];
}>({
  current: features[0].images.map((img) => ({
    id: img.id,
    x: img.position.x,
    y: img.position.y,
    scale: 1,
    opacity: 1,
    rotation: Math.random() * 20 - 10
  })),
  previous: []
});


const particles = reactive<{ items: Image[] }>({
  items: Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    rotation: Math.random() * 360
  }))
});


const handleScroll = (event: WheelEvent) => {
  const prevFeatureIndex = currentFeature.value;

  if (event.deltaY > 0 && currentFeature.value < features.length - 1) {
    currentFeature.value++;
  } else if (event.deltaY < 0 && currentFeature.value > 0) {
    currentFeature.value--;
  } else {
    return;
  }
  animateFeatureTransition(prevFeatureIndex);
};


const animateFeatureTransition = (prevFeatureIndex: number) => {

    featureImages.previous = [...featureImages.current];

  featureImages.previous.forEach((img) => {
    img.opacity = 0;
    img.scale = 0.2;
  });

  featureImages.current = features[currentFeature.value].images.map((img) => ({
    id: img.id,
    x: 0,
    y: 0,
    scale: 0,
    opacity: 0,
    rotation: Math.random() * 20 - 10
  }));

  setTimeout(() => {
    featureImages.current.forEach((img, index) => {
      img.x = features[currentFeature.value].images[index].position.x;
      img.y = features[currentFeature.value].images[index].position.y;
      img.scale = 1;
      img.opacity = 1;
    });
  }, 50);

  animateParticles();
};


const animateParticles = () => {
  particles.items.forEach((particle, index) => {
    particle.x = 0;
    particle.y = 0;
    particle.scale = 1;
    particle.opacity = 1;

    setTimeout(() => {
      const angle = (index / particles.items.length) * Math.PI * 2;
      const distance = 100 + Math.random() * 200;
      particle.x = Math.cos(angle) * distance;
      particle.y = Math.sin(angle) * distance;
      particle.scale = 0.2 + Math.random() * 0.3;
      particle.opacity = 0;
    }, 50);
  });
};


onMounted(() => {
  window.addEventListener('wheel', handleScroll);

  setTimeout(() => {
    featureImages.current.forEach((img, index) => {
      img.x = features[currentFeature.value].images[index].position.x;
      img.y = features[currentFeature.value].images[index].position.y;
      img.scale = 1;
      img.opacity = 1;
    });
  }, 500);
});
</script>

<template>
  <div class="app-container">
    <div class="radiating-lines"></div>

    <div class="hero-section">
      <div class="content-frame">
        <FeatureImage :images="featureImages.current" />
        <FeatureImage :images="featureImages.previous" :is-fading="true" />
        <Particles :particles="particles.items" :icon="features[currentFeature].icon" />
        <FeatureContent :feature="features[currentFeature]" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/components/ani_compoents/IntrCard.scss';
</style>
