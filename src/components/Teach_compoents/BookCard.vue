<script setup lang="ts">
import { Book } from '@/types/index';

defineProps<{
  book: Book;
}>();

const emit = defineEmits<{
  (e: 'openModal', book: Book): void;
  (e: 'delete', book: Book): void;
}>();
</script>

<template>
  <div class="book-item" :data-id="book.id">
    <div class="book-header">
      <img :src="book.image || 'default.jpg'" :alt="book.title" />
      <h3>{{ book.title }}</h3>
      <p><strong>作者：</strong>{{ book.author }}</p>
    </div>
    <button class="more-details" @click="emit('openModal', book)">更多详情</button>
    <button class="delete-button" @click="emit('delete', book)">删除</button>
  </div>
</template>

<style scoped>
.book-item {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: left;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  min-height: 470px;
  position: relative;
}

.book-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.book-header {
  background: linear-gradient(135deg, #a5c5ff 0%, #6200ff 100%);
  color: #fff;
  padding: 1.5rem;
  border-radius: 8px 8px 0 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.book-header h3 {
  margin: 0;
  font-size: 1.4rem;
}

.book-header p {
  margin: 0.5rem 0 0;
  opacity: 0.9;
}

.book-header img {
  width: 100%;
  height: 370px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

.more-details,
.delete-button {
  margin-top: 15px;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.more-details {
  background: linear-gradient(145deg, #007BFF, #0056b3);
}

.more-details:hover {
  background: linear-gradient(145deg, #0056b3, #003d80);
  transform: scale(1.05);
}

.delete-button {
  background: linear-gradient(145deg, #FF3B30, #e60000);
}

.delete-button:hover {
  background: linear-gradient(145deg, #e60000, #cc0000);
}
</style>