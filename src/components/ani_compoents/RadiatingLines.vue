<template>
  <div class="radiating-lines"></div>
</template>

<style lang="scss" scoped>
// Radiating lines background
.radiating-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200%;
    height: 200%;
    background-image: repeating-conic-gradient(
      rgba(255, 255, 255, 0.1) 0deg,
      rgba(255, 255, 255, 0.1) 1deg,
      transparent 1deg,
      transparent 6deg
    );
    transform: translate(-50%, -50%);
  }
}
</style>