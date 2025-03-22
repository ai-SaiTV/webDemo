<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <div class="add-resource-card">
    <el-icon class="add-icon">
      <Plus />
    </el-icon>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<style scoped>
.add-resource-card {
  background-color: #f4f7f6;
  border: 2px dashed #dcdfe6;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 200px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.add-resource-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.add-resource-card h3 {
  font-size: 1.4rem;
  margin-top: 10px;
  color: #2c3e50;
}

.add-resource-card p {
  font-size: 1rem;
  opacity: 0.8;
  color: #7f8c8d;
}

.add-icon {
  font-size: 36px;
  color: #7f8c8d;
  margin-bottom: 10px;
}
</style>