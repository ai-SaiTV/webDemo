<script setup lang="ts">
import { PropType, computed } from '@vue/runtime-core';


interface Particle {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation: number;
}


defineProps({
  particles: {
    type: Array as PropType<Particle[]>,
    required: true
  }
});


const particleStyles = computed(() =>
  (particles: Particle[]) =>
    particles.map((particle) => ({
      transform: `translate(${particle.x}px, ${particle.y}px) scale(${particle.scale}) rotate(${particle.rotation}deg)`,
      opacity: particle.opacity
    }))
);
</script>

<template>
  <div>
    <div
      v-for="(particle, index) in particles"
      :key="`particle-${particle.id}`"
      class="particle"
      :style="particleStyles(particles)[index]"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
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
