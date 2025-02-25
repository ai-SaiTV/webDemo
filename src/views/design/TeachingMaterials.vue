<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    owner: string;
    description: string | null;
    image: string | null;
    showDetails: boolean;
}

export default defineComponent({
    data() {
        return {
            books: [
                {
                    id: 1,
                    title: 'Vue.js 实战',
                    author: 'John Doe',
                    isbn: '123-456-789',
                    owner: '张三',
                    description: '一本关于 Vue.js 的教程。',
                    image: 'https://example.com/vue-book.jpg',
                    showDetails: false
                },
                {
                    id: 2,
                    title: '深入浅出 Node.js',
                    author: 'Jane Smith',
                    isbn: '987-654-321',
                    owner: '李四',
                    description: '一本关于 Node.js 的深入解析书籍。',
                    image: 'https://example.com/node-book.jpg',
                    showDetails: false
                },
                {
                    id: 3,
                    title: '前端工程化',
                    author: 'Alice',
                    isbn: '555-444-333',
                    owner: '王五',
                    description: '前端开发的最佳实践。',
                    image: 'https://example.com/frontend-book.jpg',
                    showDetails: false
                }
            ] as Book[]
        };
    },
    methods: {
        toggleDetails(book: Book) {
            book.showDetails = !book.showDetails;
        },
        deleteBook(book: Book) {
            this.books = this.books.filter((b: Book) => b.id !== book.id);
        }
    }
});
</script>



<template>
    <div>
        <header>图书信息</header>
        <div class="container">
            <div class="book-list">
                <div v-for="book in books" :key="book.id" class="book-item" :data-id="book.id">
                    <div class="book-header">
                        <img :src="book.image || 'default.jpg'" :alt="book.title" />
                        <h3>{{ book.title }}</h3>
                        <p><strong>作者：</strong>{{ book.author }}</p>
                    </div>
                    <button class="more-details" @click="toggleDetails(book)">更多详情</button>
                    <div v-if="book.showDetails" class="more-info">
                        <p><strong>ISBN：</strong>{{ book.isbn }}</p>
                        <p><strong>所有者：</strong>{{ book.owner }}</p>
                        <p><strong>描述：</strong>{{ book.description || '暂无描述' }}</p>
                    </div>
                    <button class="delete-button" @click="deleteBook(book)">删除</button>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
body {
    background-color: #f4f7f6;
    margin: 0;
    font-family: 'Arial', sans-serif;
    color: #333;
}

header {
    background: linear-gradient(135deg, #1890ff 0%, #8000ff 100%);
    color: #fff;
    padding: 20px;
    text-align: center;
    font-size: 2rem;
    font-weight: 600;
    text-transform: uppercase;
}

.container {
    margin: 20px auto;
    padding: 0 20px;
    max-width: 1200px;
}

.book-list {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.book-item {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: left;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 500px;
    position: relative;
}

.book-item:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.book-header {
    background: linear-gradient(135deg, #1890ff 0%, #8000ff 100%);
    /* 从蓝色渐变到紫色 */
    color: white;
    padding: 1.5rem;
    border-radius: 8px 8px 0 0;
}

.book-header h3 {
    margin: 0;
    font-size: 1.4rem;
}

.book-header p {
    margin: 0.5rem 0 0;
    opacity: 0.9;
}

.book-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 15px;
}

.more-details,
.delete-button {
    margin-top: 15px;
    padding: 10px 20px;
    font-size: 1rem;
    color: white;
    border: none;
    border-radius: 30px;
    cursor: pointer;
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

.more-info {
    display: none;
    margin-top: 10px;
    text-align: left;
    color: #555;
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .book-list {
        gap: 15px;
    }

    .book-item {
        height: 300px;
    }

    .more-details,
    .delete-button {
        padding: 8px 15px;
        font-size: 0.9rem;
    }
}
</style>