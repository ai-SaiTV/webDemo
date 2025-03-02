<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import { ElMessageBox, ElMessage } from 'element-plus';
import zh2vo from '@/assets/zh2vo.png';
import zh3vo from '@/assets/zh3vo.png';
import zh4vo from '@/assets/zh4vo.png';
import zh5vo from '@/assets/zh5vo.png';
import Doc2 from '@/assets/Doc2.pdf';
import Doc3 from '@/assets/Doc3.pdf';
import Doc4 from '@/assets/Doc4.pdf';
import Doc5 from '@/assets/Doc5.pdf';

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    owner: string;
    description: string | null;
    image: string | null;
    pdf: string | null | undefined;
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
                    pdf: Doc2,
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
                    pdf: Doc3,
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
                    pdf: Doc4,
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
                    pdf: Doc5,
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
                pdf: null as File | string | null
            },
            isAddBookModalVisible: false,
            isPDFVisible: false 
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
            this.isPDFVisible = false; // 关闭时隐藏PDF预览
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
        addNewBook() {
            const newBook: Book = {
                id: Date.now(),
                title: this.newBook.title,
                author: this.newBook.author,
                isbn: this.newBook.isbn,
                owner: this.newBook.owner,
                description: this.newBook.description,
                image: this.newBook.image ? URL.createObjectURL(this.newBook.image!) : '',
                pdf: this.newBook.pdf ? (typeof this.newBook.pdf === 'string' ? this.newBook.pdf : URL.createObjectURL(this.newBook.pdf)) : '',
                showDetails: false,
            };
            this.books.push(newBook);
            ElMessage.success('新增书籍成功');
            this.closeAddBookModal();
        },
        handlePdfUpload(event: Event) {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file && file.type === 'application/pdf') {
                this.newBook.pdf = URL.createObjectURL(file);
            } else {
                ElMessage.error('请上传PDF文件');
            }
        },
        previewPDF() {
            this.isPDFVisible = true; // 显示PDF预览
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

        <div class="container">
            <div class="book-list">
                <!-- 新增书籍卡片 -->
                <div class="book-item add-book-card" @click="openAddBookModal">
                    <el-icon class="add-icon">
                        <Plus />
                    </el-icon><!-- 加号图标 -->
                    <h3>新增教材</h3>
                    <p>点击添加新书籍</p>
                </div>

                <!-- 原有书籍列表 -->
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
                        <el-input type="text" v-model="newBook.title"/>
                    </div>
                    <div class="input-group">
                        <label for="author">作者：</label>
                        <el-input type="text" v-model="newBook.author"/>
                    </div>
                    <div class="input-group">
                        <label for="isbn">ISBN：</label>
                        <el-input type="text" v-model="newBook.isbn"/>
                    </div>
                    <div class="input-group">
                        <label for="owner">所有者：</label>
                        <el-input type="text" v-model="newBook.owner"/>
                    </div>
                    <div class="input-group">
                        <label for="description">描述：</label>
                        <textarea v-model="newBook.description" placeholder="在这里输入书籍的描述（可不填）"></textarea>
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
                <div v-if="selectedBook.pdf">
                    <button @click="previewPDF">教材预览</button>
                </div>
                <div v-if="isPDFVisible" class="pdf-container">
                    <iframe v-if="selectedBook.pdf" :src="selectedBook.pdf" class="pdf-viewer" frameborder="0"></iframe>
                </div><br>
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
}

.plan-header h2 {
    margin: 0;
    font-size: 1.75rem;
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

.book-item img {
    width: 259px;
    height: 370px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 15px;
}

.pdf-container {
    margin: 20px 0;
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.pdf-viewer {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
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
    width: 80%;
    max-width: 900px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    text-align: center;
    position: relative;
    overflow: hidden;
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

.pdf-container {
    margin: 20px 0;
    width: 100%;
    height: 500px;
    /* Set fixed height for PDF viewer */
    display: flex;
    justify-content: center;
    align-items: center;
}

.pdf-viewer {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
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

/* 新增书籍卡片样式 */
.add-book-card {
    background-color: #f4f7f6;
    border: 2px dashed #dcdfe6;
    /* 加边框并设置为虚线 */
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

.add-book-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.add-book-card h3 {
    font-size: 1.4rem;
    margin-top: 10px;
    color: #2c3e50;
}

.add-book-card p {
    font-size: 1rem;
    opacity: 0.8;
    color: #7f8c8d;
}

.add-book-card i {
    font-size: 36px;
    color: #7f8c8d;
    margin-bottom: 10px;
}

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
    background-color: white;
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