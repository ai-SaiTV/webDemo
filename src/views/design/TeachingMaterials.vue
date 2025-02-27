<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { ElMessageBox, ElMessage } from 'element-plus';
import zh2vo from '@/assets/zh2vo.png'; // 原有封面图片示例
import zh3vo from '@/assets/zh3vo.png'; // 原有封面图片示例
import zh4vo from '@/assets/zh4vo.png'; // 原有封面图片示例
import zh5vo from '@/assets/zh5vo.png'; // 原有封面图片示例

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    owner: string;
    description: string | null;
    image: string | null;
    pdf: string | null;
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
                    pdf: '', 
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
                    pdf: '', 
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
                    pdf: '', 
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
                    pdf: '', 
                    showDetails: false
                }
            ] as Book[],
            isModalVisible: false,
            selectedBook: {} as Book,
            newBook: {
                title: '',
                author: '',
                isbn: '',
                owner: '',
                description: '',
                image: null as File | null,
                pdf: null as File | null
            },
            isAddBookModalVisible: false, // 新增书籍的弹窗显示状态
        };
    },
    methods: {
        toggleDetails(book: Book) {
            book.showDetails = !book.showDetails;
        },
        deleteBook(book: Book) {
            ElMessageBox.confirm(`确定要删除书籍《${book.title}》吗？`, '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            })
            .then(() => {
                this.books = this.books.filter((b) => b.id !== book.id);
                ElMessage.success('删除成功');
            })
            .catch(() => {
                ElMessage.info('已取消删除');
            });
        },
        openModal(book: Book) {
            this.selectedBook = book;
            this.isModalVisible = true;
        },
        closeModal() {
            this.isModalVisible = false;
        },
        openAddBookModal() {
            this.isAddBookModalVisible = true;
        },
        closeAddBookModal() {
            this.isAddBookModalVisible = false;
        },
        handleImageUpload(event: Event) {
            const input = event.target as HTMLInputElement;
            if (input.files && input.files[0]) {
                this.newBook.image = input.files[0];
            }
        },
        handlePdfUpload(event: Event) {
            const input = event.target as HTMLInputElement;
            if (input.files && input.files[0]) {
                this.newBook.pdf = input.files[0];
            }
        },
        addNewBook() {
            const newBook: Book = {
                id: Date.now(),  // 使用时间戳生成唯一ID
                title: this.newBook.title,
                author: this.newBook.author,
                isbn: this.newBook.isbn,
                owner: this.newBook.owner,
                description: this.newBook.description,
                image: this.newBook.image ? URL.createObjectURL(this.newBook.image!) : '', // 生成图片预览URL
                pdf: this.newBook.pdf ? URL.createObjectURL(this.newBook.pdf!) : '', // 生成PDF预览URL
                showDetails: false,
            };
            this.books.push(newBook);
            ElMessage.success('新增书籍成功');
            this.closeAddBookModal(); // 添加书籍后关闭弹窗
        }
    }
});
</script>

<template>
    <div>
        <div class="plan-header">
            <h2> 教学资源 </h2>
            <p class="subtitle">针对具体教学需求，辅助生成专业教案</p>
        </div>
        
        <!-- 按钮：打开新增教材的模态框 -->
        <button @click="openAddBookModal" class="add-book-btn">新增教材</button>

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

        <!-- 新增书籍的模态框 -->
        <div v-if="isAddBookModalVisible" class="modal-overlay">
            <div class="modal-content">
                <h3>添加新教材</h3>
                <form @submit.prevent="addNewBook">
                    <div class="input-group">
                        <label for="title">书名：</label>
                        <input type="text" v-model="newBook.title" required />
                    </div>
                    <div class="input-group">
                        <label for="author">作者：</label>
                        <input type="text" v-model="newBook.author" required />
                    </div>
                    <div class="input-group">
                        <label for="isbn">ISBN：</label>
                        <input type="text" v-model="newBook.isbn" required />
                    </div>
                    <div class="input-group">
                        <label for="owner">所有者：</label>
                        <input type="text" v-model="newBook.owner" required />
                    </div>
                    <div class="input-group">
                        <label for="description">描述：</label>
                        <textarea v-model="newBook.description"></textarea>
                    </div>
                    <div class="input-group">
                        <label for="image">封面图片：</label>
                        <input type="file" @change="handleImageUpload" accept="image/*" />
                    </div>
                    <div class="input-group">
                        <label for="pdf">教材PDF：</label>
                        <input type="file" @change="handlePdfUpload" accept="application/pdf" />
                    </div>
                    <div class="button-group">
                        <button type="submit" class="submit-btn">提交</button>
                        <button @click="closeAddBookModal" class="cancel-btn">取消</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- 书籍详情模态框 -->
        <div v-if="isModalVisible" class="modal-overlay">
            <div class="modal-content">
                <h3>{{ selectedBook.title }}</h3>
                <p><strong>ISBN：</strong>{{ selectedBook.isbn }}</p>
                <p><strong>所有者：</strong>{{ selectedBook.owner }}</p>
                <p><strong>描述：</strong>{{ selectedBook.description || '暂无描述' }}</p>
                <a v-if="selectedBook.pdf" :href="selectedBook.pdf" target="_blank">教材预览</a>
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
.add-book-btn {
    background-color: #4582de;
    color: white;
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
}

.add-book-btn:hover {
    background-color: #ef6917;
}

/* 新增书籍模态框样式 */
.modal-content form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.input-group {
    display: flex;
    flex-direction: column;
    
}

.input-group label {
    margin-bottom: 5px;
    font-weight: bold;
}

.input-group input,
.input-group textarea {
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.input-group textarea {
    height: 100px;
    resize: none;
}

.button-group {
    display: flex;
    justify-content: space-between;
}

.submit-btn {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.submit-btn:hover {
    background-color: #45a049;
}

.cancel-btn {
    background-color: #f44336;
    color: white;
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.cancel-btn:hover {
    background-color: #e53935;
}


</style>