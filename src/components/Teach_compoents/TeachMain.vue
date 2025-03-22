<script setup lang="ts">
import { ref } from '@vue/runtime-core';
import { ElMessageBox, ElMessage } from 'element-plus';
import ResourceHeader from './ResourceHeader.vue';
import BookList from './BookList.vue';
import VideoList from './VideoList.vue';
import TextList from './TextList.vue';
import BookModal from './BookModal.vue';
import VideoModal from './VideoModal.vue';
import TextModal from './TextModal.vue';
import AddResourceModal from './AddResourceModal.vue';
import { Book, Video,Text,NewBook, NewVideo,NewText } from '@/types';

// Import assets
import zh2vo from '@/assets/zh2vo.png';
import zh3vo from '@/assets/zh3vo.png';
import zh4vo from '@/assets/zh4vo.png';
import zh5vo from '@/assets/zh5vo.png';
import Doc2 from '@/assets/Doc2.pdf';
import Doc3 from '@/assets/Doc3.pdf';
import Doc4 from '@/assets/Doc4.pdf';
import Doc5 from '@/assets/Doc5.pdf';
import Vid from '@/assets/田忌赛马.mp4';
import Vid2 from '@/assets/两小儿辩日.mp4';
import text1 from '@/assets/text1.docx';
import nullvideoimg from '@/assets/OIP-C.jpg';
import nulltextimg from '@/assets/nulltext.jpg';
const books = ref<Book[]>([
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
]);

const videos = ref<Video[]>([
    {
        id: 1,
        title: '田忌赛马',
        duration: '15:30',
        description: '一个关于田忌赛马的教学视频。',
        image: nullvideoimg,
        path: Vid
    },
    {
        id: 2,
        title: '两小儿辩日',
        duration: '12:45',
        description: '一个关于两小儿辩日的教学视频。',
        image: nullvideoimg,
        path: Vid2
    }
]);
const texts = ref<Text[]>([
    {
        id: 1,
        title: '田忌赛马教学大纲',
        description: '一份关于田忌赛马的教学大纲。',
        image: nulltextimg,
        words: text1,
    }
]);    
const resourceType = ref('books');
const selectedBook = ref<Book | null>(null);
const selectedVideo = ref<Video | null>(null);
const selectedText = ref<Text | null>(null);
const isBookModalVisible = ref(false);
const isVideoModalVisible = ref(false);
const isTextModalVisible = ref(false);
const isAddModalVisible = ref(false);

const newBook = ref<NewBook>({
    title: '',
    author: '',
    isbn: '',
    owner: '',
    description: '',
    image: null as File | null,
    pdf: null as File | string | null,
});

const newVideo = ref<NewVideo>({
    title: '',
    duration: '',
    description: '',
    image: null as File | null,
    video: null as File | string | null
});

const newText = ref<NewText>({
    title: '',
    description: '',
    image: null as File | null,
    words: null as File | string | null
});
const deleteBook = async (book: Book) => {
    try {
        await ElMessageBox.confirm(`确定要删除书籍《${book.title}》吗？`, '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        });
        books.value = books.value.filter((b) => b.id !== book.id);
        ElMessage.success('删除成功');
    } catch {
        ElMessage.info('已取消删除');
    }
};

const deleteVideo = async (video: Video) => {
    try {
        await ElMessageBox.confirm(`确定要删除视频《${video.title}》吗？`, '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        });
        videos.value = videos.value.filter((v) => v.id !== video.id);
        ElMessage.success('删除成功');
    } catch {
        ElMessage.info('已取消删除');
    }
};

const deleteText = async (text: Text) => {
    try {
        await ElMessageBox.confirm(`确定要删除文本《${text.title}》吗？`, '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        });
        texts.value = texts.value.filter((t) => t.id !== text.id);
        ElMessage.success('删除成功');
    } catch {
        ElMessage.info('已取消删除');
    }
};
const handleResource = (resourceType: string,bookvalue?:any,videosvalue?:any,textsvalue?:any) => {
    switch (resourceType) {
        case 'books':
            return bookvalue;
        case 'videos':
            return videosvalue;
        case 'texts':
            return textsvalue;
        default:
            return '';
    }
};
const updateResource=(resourceType: string, value: any) =>{
  switch (resourceType) {
    case 'books':
      newBook.value = value as NewBook;
      break;
    case 'videos':
      newVideo.value = value as NewVideo;
      break;
    case 'texts':
      newText.value = value as NewText;
      break;
    default:
      break;
  }
};
const handleFileUpload = (event: Event, fileType: 'image' | 'pdf' | 'video') => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    switch (true) {
        case resourceType.value === 'books' && fileType === 'image':
            newBook.value.image = file;
            break;

        case resourceType.value === 'books' && fileType === 'pdf':
            if (file.type === 'application/pdf') {
                newBook.value.pdf = URL.createObjectURL(file);
            } else {
                ElMessage.error('请上传正确的文件格式');
            }
            break;

        case resourceType.value !== 'books' && fileType === 'image':
            newVideo.value.image = file;
            break;

        case resourceType.value !== 'books' && fileType === 'video':
            const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-matroska', 'video/webm'];
            if (validVideoTypes.includes(file.type)) {
                newVideo.value.video = file;
            } else {
                ElMessage.error('请上传正确的视频格式');
            }
            break;

        default:
            ElMessage.error('文件类型不匹配');
            break;
    }
};
const handleSubmit = () => {
    if (resourceType.value === 'books') {
        const book: Book = {
            id: Date.now(),
            title: newBook.value.title,
            author: newBook.value.author,
            isbn: newBook.value.isbn,
            owner: newBook.value.owner,
            description: newBook.value.description,
            image: newBook.value.image ? URL.createObjectURL(newBook.value.image) : null,
            pdf: newBook.value.pdf ? newBook.value.pdf as string : null,
            showDetails: false,
        };
        books.value.push(book);
        ElMessage.success('添加成功');
    } else {
        if (newVideo.value.video && newVideo.value.video instanceof File) {
            const video: Video = {
                id: Date.now(),
                title: newVideo.value.title,
                duration: newVideo.value.duration,
                description: newVideo.value.description,
                image: newVideo.value.image ? URL.createObjectURL(newVideo.value.image) : null,
                path: URL.createObjectURL(newVideo.value.video)
            };
            videos.value.push(video);
            ElMessage.success('新增视频成功');
        } else {
            ElMessage.error('请上传视频文件');
        }
    }
    isAddModalVisible.value = false;
    resetForm();
};
const resetForm = () => {
    if (resourceType.value === 'books') {
        newBook.value = {
            title: '',
            author: '',
            isbn: '',
            owner: '',
            description: '',
            image: null,
            pdf: null,
        };
    } else {
        newVideo.value = {
            title: '',
            duration: '',
            description: '',
            image: null,
            video: null,
        };
    }
};
const handleVideoError = () => {
    ElMessage.error('视频加载失败，请检查文件格式或网络连接');
};
const handleTextError = () => {
    ElMessage.error('文本加载失败，请检查文件格式或网络连接');
};
</script>

<template>
    <div>
        <ResourceHeader title="教学资源" subtitle="针对具体教学需求，辅助生成专业教案" />

        <div class="container">
            <el-select v-model="resourceType" placeholder="请选择资源类型" class="resource-selector">
                <el-option label="教材" value="books"></el-option>
                <el-option label="视频" value="videos"></el-option>
                <el-option label="文本大纲" value="texts"></el-option>
            </el-select>

            <BookList v-if="resourceType === 'books'" :books="books"
                @open-book-modal="(book: NewBook) => { selectedBook = book; isBookModalVisible = true; }"
                @delete-book="deleteBook" @open-add-book-modal="isAddBookModalVisible = true" 
                @open-add-modal="isAddModalVisible = true"
                />

            <VideoList v-if="resourceType === 'videos'" :videos="videos"
                @open-video-modal="(video: NewVideo) => { selectedVideo = video; isVideoModalVisible = true; }"
                @delete-video="deleteVideo" @open-add-video-modal="isAddVideoModalVisible = true" 
                @open-add-modal="isAddModalVisible = true"
                />
            
            <TextList v-if="resourceType === 'texts'" :texts="texts"
                @open-text-modal="(text: NewText) => { selectedText = text; isTextModalVisible = true; }"
                @delete-text="deleteText" @open-add-text-modal="isAddTextModalVisible = true" 
                @open-add-modal="isAddModalVisible = true"
                />
        </div>

        <BookModal v-if="selectedBook" :book="selectedBook" :visible="isBookModalVisible"
            @close="isBookModalVisible = false" />

        <VideoModal v-if="selectedVideo" :video="selectedVideo" :visible="isVideoModalVisible"
            @close="isVideoModalVisible = false" @error="handleVideoError" />
        <TextModal v-if="selectedText" :text="selectedText" :visible="isTextModalVisible"
            @close="isTextModalVisible = false" @error="handleTextError" />
        <AddResourceModal :visible="isAddModalVisible" :type="handleResource(resourceType,'book','video','text')"
            :model-value="handleResource(resourceType, newBook, newVideo, newText)"
            @update:model-value="updateResource(resourceType, $event)"
            @file-upload="handleFileUpload" @submit="handleSubmit" @close="isAddModalVisible = false" />
    </div>
</template>

<style scoped>
.container {
    margin: 20px auto;
    padding: 0 20px;
    max-width: 1200px;
    gap: 20px;
}

.resource-selector {
    margin-bottom: 20px;
}

@media (max-width: 768px) {
    .container {
        padding: 0 10px;
    }
}
</style>