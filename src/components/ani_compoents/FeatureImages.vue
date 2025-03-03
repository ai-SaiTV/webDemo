<script setup lang="ts">
import { computed,PropType } from '@vue/runtime-core';

interface Image {
  id: number;
  position: { x: number; y: number };
}

interface AnimatedImage {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
}


defineProps({
  images: {
    type: Array as PropType<Image[]>,
    required: true
  },
  transitionKey: {
    type: Number,
    required: false
  }
});

const animatedImages = computed<AnimatedImage[]>(() =>
  Array.from({ length: 4 }, (_, index) => ({
    id: index,
    x: 0,
    y: 0,
    scale: 0,
    opacity: 0,
    rotation: Math.random() * 20 - 10
  }))
);
</script>

<template>
    <div>
      <div
        v-for="(img) in animatedImages"
        :key="`feature-${img.id}`"
        class="feature-image"
        :style="{
          transform: `translate(${img.x}px, ${img.y}px) scale(${img.scale}) rotate(${img.rotation}deg)`,
          opacity: img.opacity,
          backgroundImage: 'url(https://th.bing.com/th/id/R.78023632193598e9c1ca70ffeff37e4c?rik=6XNyq%2f7lUyVyAw&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f40006%2f0222.jpg_wh1200.jpg&ehk=hXVlRfNjTyibP2U96UDOFgGgQ%2fdhAGrLCLNBd8CHEME%3d&risl=&pid=ImgRaw&r=0)'
        }"
      ></div>
    </div>
  </template>

<style scoped>
.feature-image {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transition: all 1.2s cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 1;
  pointer-events: none;
}
</style>
