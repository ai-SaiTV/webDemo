<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import zh2vo from '@/assets/zh2vo.png';
import zh3vo from '@/assets/zh3vo.png';
import zh4vo from '@/assets/zh4vo.png';
import zh5vo from '@/assets/zh5vo.png';
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
                    title: '二年级上册教师用书',
                    author: '人民教育出版社',
                    isbn: '123-456-789',
                    owner: '张三',
                    description: '一本关于二年级语文上册的教师用书。',
                    image: zh2vo,
                    showDetails: false
                },
                {
                    id: 2,
                    title: '三年级上册教师用书',
                    author: '人民教育出版社',
                    isbn: '987-654-321',
                    owner: '李四',
                    description: '一本关于三年级语文上册的教师用书。',
                    image: zh3vo,
                    showDetails: false
                },
                {
                    id: 3,
                    title: '四年级上册教师用书',
                    author: '人民教育出版社',
                    isbn: '555-444-333',
                    owner: '王五',
                    description: '一本关于四年级语文上册的教师用书。',
                    image: zh4vo,
                    showDetails: false
                },
                {
                    id: 4,
                    title: '五年级上册教师用书',
                    author: '人民教育出版社',
                    isbn: '555-444-333',
                    owner: '赵六',
                    description: '一本关于五年级语文上册的教师用书。',
                    image: zh5vo,
                    showDetails: false
                }
            ] as Book[],
            isModalVisible: false,
            selectedBook: {} as Book
        };
    },
    methods: {
        toggleDetails(book: Book) {
            book.showDetails = !book.showDetails;
        },
        deleteBook(book: Book) {
            this.books = this.books.filter((b: Book) => b.id !== book.id);
        },
        openModal(book: Book) {
            this.selectedBook = book;
            this.isModalVisible = true;
        },
        closeModal() {
            this.isModalVisible = false;
        }
    }
});
</script>



<template>
    <div>
        <!-- <header>教学资源</header> -->
        <div class="plan-header">
            <h2> 教学资源 </h2>
            <p class="subtitle">针对具体教学需求，辅助生成专业教案</p>
        </div>
        <div class="container">
            <div class="book-list">
                <div v-for="book in books" :key="book.id" class="book-item" :data-id="book.id">
                    <div class="book-header">
                        <img :src="book.image || 'default.jpg'" :alt="book.title" />
                        <h3>{{ book.title }}</h3>
                        <p><strong>作者：</strong>{{ book.author }}</p>
                    </div>
                    <button class="more-details" @click="openModal(book)">更多详情</button>
                    <button class="delete-button" @click="deleteBook(book)">删除</button>
                    </div>
                </div>
            </div>

         <!-- 弹出窗口 -->
         <div v-if="isModalVisible" class="modal-overlay">
            <div class="modal-content">
                <h3>{{ selectedBook.title }}</h3>
                <p><strong>ISBN：</strong>{{ selectedBook.isbn }}</p>
                <p><strong>所有者：</strong>{{ selectedBook.owner }}</p>
                <p><strong>描述：</strong>{{ selectedBook.description || '暂无描述' }}</p>
                <button @click="closeModal">关闭</button>
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


.plan-header {
  background: linear-gradient(135deg, #1890ff 0%, #8000ff 100%);
  color: #fff;
  padding: 20px;
  border-radius: 8px;

  h2 {
    margin: 0;
    font-size: 1.75rem;
  }

  .subtitle {
    margin: 0.5rem 0 0;
    opacity: 0.9;
  }
}

.subtitle {
    margin: 0.5rem 0 0;
    opacity: 0.9;
}

.container {
    margin: 20px auto;
    padding: 0 20px;
    max-width: 1200px;
    gap: 20px;
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
    background: linear-gradient(135deg, #1890ff 0%, #8000ff 100%);
    /* 从蓝色渐变到紫色 */
    color: #fff;
    padding: 1.5rem;
    border-radius: 8px 8px 0 0;
    width: 100%;
    display: flex;
    flex-direction: column; /* Arrange title and description vertically */
    justify-content: center; /* Vertically center content inside the header */
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

.book-item img {
    width: 259px;
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

.more-info {
    display: none;
    margin-top: 10px;
    text-align: left;
    color: #555;
    font-size: 0.9rem;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.modal-content h3 {
    margin-bottom: 20px;
}

.modal-content button {
    background-color: #007BFF;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
}

.modal-content button:hover {
    background-color: #0056b3;
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