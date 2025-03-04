<script setup lang="ts">
import {  reactive, onMounted, watch } from '@vue/runtime-core';
import FeatureContent from './FeatureContent.vue';
import FeatureImage from './FeatureImage.vue';
import AnimatedParticle from './AnimatedParticle.vue';

const props = defineProps<{
  features: Array<{
    title: string;
    subtitle: string;
    icon: any;
    images: Array<{
      id: number;
      position: {
        x: number;
        y: number;
      };
    }>;
  }>;
  currentFeature: number;
}>();

// Animation state for feature images
const featureImages = reactive({
  current: Array.from({ length: 4 }, (_, i) => ({
    id: i,
    x: 0,
    y: 0,
    scale: 0,
    opacity: 0,
    rotation: Math.random() * 20 - 10
  })),
  previous: Array.from({ length: 4 }, (_, i) => ({
    id: i,
    x: 0,
    y: 0,
    scale: 0,
    opacity: 0,
    rotation: 0
  }))
});

// Animation state for particles
const particles = reactive({
  items: Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    rotation: Math.random() * 360
  }))
});

// Animate feature transition
const animateFeatureTransition = () => {
  // Store previous feature images state
  featureImages.previous = featureImages.current.map(img => ({...img}));
  
  // Fade out previous feature images
  featureImages.previous.forEach(img => {
    img.opacity = 0;
    img.scale = 0.2;
  });
  
  // Animate new feature images
  featureImages.current.forEach((img, i) => {
    // Start from center
    img.x = 0;
    img.y = 0;
    img.scale = 0;
    img.opacity = 0;
    
    // Animate to final position
    setTimeout(() => {
      const targetPositions = props.features[props.currentFeature].images[i].position;
      img.x = targetPositions.x;
      img.y = targetPositions.y;
      img.scale = 1;
      img.opacity = 1;
      img.rotation = Math.random() * 20 - 10;
    }, 50);
  });
  
  // Also animate particles
  animateParticles();
};

// Animate particles outward
const animateParticles = () => {
  particles.items.forEach((particle, index) => {
    // Reset particle position
    particle.x = 0;
    particle.y = 0;
    particle.scale = 1;
    particle.opacity = 1;
    
    // Animate to new position
    setTimeout(() => {
      const angle = (index / particles.items.length) * Math.PI * 2;
      const distance = 100 + Math.random() * 200;
      
      particle.x = Math.cos(angle) * distance;
      particle.y = Math.sin(angle) * distance;
      particle.scale = 0.2 + Math.random() * 0.3;
      particle.opacity = 0;
      particle.rotation = Math.random() * 360;
    }, 50);
  });
};



watch(() => props.currentFeature, () => {
  animateFeatureTransition();
});

// Initialize feature images on mount
onMounted(() => {
  // Initialize first feature images
  setTimeout(() => {
    featureImages.current.forEach((img, i) => {
      const targetPositions = props.features[props.currentFeature].images[i].position;
      img.x = targetPositions.x;
      img.y = targetPositions.y;
      img.scale = 1;
      img.opacity = 1;
      img.rotation = Math.random() * 20 - 10;
    });
  }, 500);
});
</script>

<template>
  <div class="content-frame">
    <!-- Feature images for current feature -->
    <FeatureImage 
      v-for="(image) in featureImages.current" 
      :key="`current-${image.id}`" 
      :image="image"
      type="current"
    />
    
    <!-- Feature images for previous feature (fading out) -->
    <FeatureImage 
      v-for="(image) in featureImages.previous" 
      :key="`previous-${image.id}`" 
      :image="image"
      type="previous"
    />
    
    <!-- Animated particles -->
    <AnimatedParticle 
      v-for="particle in particles.items" 
      :key="`particle-${particle.id}`" 
      :particle="particle"
      :icon="features[currentFeature].icon"
    />
    
    <FeatureContent 
      :title="features[currentFeature].title"
      :subtitle="features[currentFeature].subtitle"
      :icon="features[currentFeature].icon"
    />
  </div>
</template>

<style lang="scss" scoped>
// Rectangular frame
.content-frame {
  position: relative;
  max-width: 800px;
  padding: 3rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
  overflow: visible;
}

@media (max-width: 768px) {
  .content-frame {
    padding: 2rem;
  }
}
</style>