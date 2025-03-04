<script setup lang="ts">
defineProps<{
  particle: {
    id: number;
    x: number;
    y: number;
    scale: number;
    opacity: number;
    rotation: number;
  };
  icon: any;
}>();
</script>

<template>
  <div 
    class="particle"
    :style="{
      transform: `translate(${particle.x}px, ${particle.y}px) scale(${particle.scale}) rotate(${particle.rotation}deg)`,
      opacity: particle.opacity
    }"
  >
    <component :is="icon" />
  </div>
</template>

<style lang="scss" scoped>
.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 1;
  pointer-events: none;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
}
</style>
