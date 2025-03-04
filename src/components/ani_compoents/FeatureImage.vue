<script setup lang="ts">
defineProps<{
  image: {
    id: number;
    x: number;
    y: number;
    scale: number;
    opacity: number;
    rotation: number;
  };
  type: string;
}>();
</script>

<template>
  <div 
    class="feature-image"
    :style="{
      transform: `translate(${image.x}px, ${image.y}px) scale(${image.scale}) rotate(${image.rotation}deg)`,
      opacity: image.opacity,
      backgroundImage: 'url(https://th.bing.com/th/id/R.78023632193598e9c1ca70ffeff37e4c?rik=6XNyq%2f7lUyVyAw&riu=http%3a%2f%2fseopic.699pic.com%2fphoto%2f40006%2f0222.jpg_wh1200.jpg&ehk=hXVlRfNjTyibP2U96UDOFgGgQ%2fdhAGrLCLNBd8CHEME%3d&risl=&pid=ImgRaw&r=0)'
    }"
  ></div>
</template>

<style lang="scss" scoped>
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

@media (max-width: 768px) {
  .feature-image {
    width: 80px;
    height: 80px;
  }
}
</style>