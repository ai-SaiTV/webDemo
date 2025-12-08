<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import ResourceHeader from './ResourceHeader.vue';
import BookList from './BookList.vue';
import BookModal from './BookModal.vue';
import VideoList from './VideoList.vue';
import VideoModal from './VideoModal.vue';
import TextList from './TextList.vue';
import TextModal from './TextModal.vue';
import DesignList from './DesignList.vue';
import DesignModal from './DesignModal.vue';
import AddResourceModal from './AddResourceModal.vue';
import { Book, Video, Text,Design,NewBook, NewVideo, NewText,NewDesign } from '@/types';
import { showCollect,Collectcontents } from '../Dash_compoents/DashCompoents';
// Import assets
import yszz from '@/assets/yszz.jpg';
import lxebr from '@/assets/lxebr.jpg';
import lxrbr_pdf from '@/assets/lxrbr.pdf';

// import Vid from '@/assets/田忌赛马.mp4';
// import Vid2 from '@/assets/两小儿辩日.mp4';
import text1 from '@/assets/text1.docx';
import text2 from '@/assets/text2.docx';
import word1 from '@/assets/word1.png';
import word2 from '@/assets/word2.png';
import nullvideoimg from '@/assets/OIP-C.jpg';
import childsun from '@/assets/两小儿辩日公开课.jpg';
import yangson from '@/assets/杨氏之子公开课.jpg';
import nulltextimg from '@/assets/nulltext.jpg';            

// interface Resource {
//     type: string;
//     title: string;
//     url: string;
// }

// interface Resources {
//     videos: Resource[];
//     coursewares: Resource[];
//     lessonPlans: Resource[];
//     images: Resource[];
// }

const books = ref<Book[]>([
    {
        id: 1,
        title: '杨氏之子课件',
        author: '张老师',
        isbn: '123-456-789',
        owner: '张三',
        description: '关于杨氏之子的课件。',
        image: yszz,
        pdf: lxrbr_pdf,
        showDetails: false
    },
    {
        id: 2,
        title: '两小儿辩日课件',
        author: '李老师',
        isbn: '987-654-321',
        owner: '李四',
        description: '关于两小儿辩日的课件。',
        image: lxebr,
        pdf: lxrbr_pdf,
        showDetails: false
    }
]);

const videos = ref<Video[]>([
    {
        id: 1,
        title: '田忌赛马优质公开课',
        duration: '36:44',
        description: '一个关于田忌赛马的公开课。',
        image: yangson,
        path: 'https://upos-sz-mirrorcos.bilivideo.com/upgcxcode/88/48/744504888/744504888-1-16.mp4?e=ig8euxZM2rNcNbRVhwdVhwdlhWdVhwdVhoNvNC8BqJIzNbfq9rVEuxTEnE8L5F6VnEsSTx0vkX8fqJeYTj_lta53NCM=&uipk=5&nbs=1&deadline=1743231916&gen=playurlv2&os=cosbv&oi=1782024106&trid=b62ba61df8f94ebd976fc58f5b859abdh&mid=0&platform=html5&og=cos&upsig=628525130021dd204d6d709d2c806521&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform,og&bvc=vod&nettype=0&f=h_0_0&bw=34696&logo=80000000'
    },
    {
        id: 2,
        title: '田忌赛马名师公开课',
        duration: '38:36',
        description: '一个关于田忌赛马的公开课。',
        image: childsun,
        path: 'https://upos-sz-mirror08c.bilivideo.com/upgcxcode/82/29/1055972982/1055972982-1-16.mp4?e=ig8euxZM2rNcNbRVhwdVhwdlhWdVhwdVhoNvNC8BqJIzNbfq9rVEuxTEnE8L5F6VnEsSTx0vkX8fqJeYTj_lta53NCM=&uipk=5&nbs=1&deadline=1743232153&gen=playurlv2&os=08cbv&oi=1782024106&trid=b15f16668d1443438ee0005872f991f5h&mid=0&platform=html5&og=hw&upsig=a8965961d097cb9017041fa500907371&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform,og&bvc=vod&nettype=0&f=h_0_0&bw=19786&logo=80000000'
    }
]);
const texts = ref<Text[]>([
    {
        id: 1,
        title: '田忌赛马教学大纲',
        description: '一份关于田忌赛马的教学大纲。',
        image: word1,
        words: text1,
    },
    {
        id: 2,
        title: '两小儿辩日教学大纲',
        description: '一份关于两小儿辩日的教学大纲。',
        image: word2,
        words: text2,
    },
]);
const designs = ref<Design[]>([
    {
        id: 1,
        title: '课堂环节设计1',
        description: '课堂环节设计1的描述',
        words: lxrbr_pdf,
        showDetails: false,
    },
    {
        id: 2,
        title: '课堂环节设计2',
        description: '课堂环节设计2的描述',
        words: lxrbr_pdf,
        showDetails: false,
    },
]);
const resourceType = ref('books');
const selectedBook = ref<Book | null>(null);
const selectedVideo = ref<Video | null>(null);
const selectedText = ref<Text | null>(null);
const selectedDesign = ref<Design | null>(null);
const isBookModalVisible = ref(false);
const isVideoModalVisible = ref(false);
const isTextModalVisible = ref(false);
const isDesignModalVisible = ref(false);
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

// const newDesign = ref<NewDesign>({
//     id: 0,
//     title: '',
//     description: '',
//     words: null as string | undefined |null,
//     showDetails: false,
// });

const addResource = (type: string, title: string, url: string): boolean =>{
  // 确保所有必要参数都有值
  if (!type || !title || !url) {
    console.error('添加资源失败：类型、标题和URL都必须提供');
    return false;
  }

  // 动态计算各类资源的ID
  let videoId = videos.value.length + 1;
  let bookId = books.value.length + 1;
  let textId = texts.value.length + 1;
  let designId = designs.value.length + 1;
  switch (type) {
    case '教学视频':
      videos.value.push({
        id: videoId,
        title: title,
        duration: '00:00', // 这里可以根据实际数据设置时长
        description: title+'的描述', // 这里可以填写新视频的描述
        image: null, // 这里可以设置默认图片路径
        path: url,
      });
      break;
    case '教学课件':
      books.value.push({
        id: bookId,
        title: title,
        author: '作者', // 这里可以根据实际数据设置作者
        isbn: 'ISBN', // 这里可以根据实际数据设置ISBN
        owner: '所有者', // 这里可以根据实际数据设置所有者
        description: title+'的描述', // 这里可以填写新课件的描述
        image: null, // 这里可以设置默认图片路径
        pdf: url,
        showDetails: false,
      });
      break;
    case '教学教案':
      texts.value.push({
        id: textId,
        title: title,
        description: title+'的描述', // 这里可以填写新教案的描述
        image: null, // 这里可以设置默认图片路径
        words: url,
      });
      break;
    case '课堂环节设计':
      designs.value.push({
        id: designId,
        title: title,
        description: title+'的描述', // 这里可以填写新课堂环节设计的描述
        words: url,
        showDetails: false,
      });
      console.log('添加课堂环节设计资源:', title, url);
      break;
    case '教学图片':
      // 处理图片链接
      // 这里可以根据实际需求处理图片链接，将其保存到相应的数据结构中
      console.log('添加图片资源:', title, url);
      break;
    default:
      console.error(`未知的资源类型: ${type}`);
      return false;
  }
  
  return true;
};
// const extractResources = (input: string): void => {
//     const lines = input.split('\n').filter(line => line.trim() !== '');

//     lines.forEach(line => {
//         const typeMatch = line.match(/#(\S+?)#/);
//         const titleMatch = line.match(/\[(.*?)\]/);
//         const urlMatch = line.match(/\((.*?)\)/);

//         addResource(typeMatch ? typeMatch[1] : '', titleMatch ? titleMatch[1] : '', urlMatch ? urlMatch[1] : '');
//     });
// };
onMounted(() => {
    console.log(showCollect.value);
    Collectcontents.value.forEach((item) => {
        addResource(item.type, item.title, item.url);
        const index = Collectcontents.value.findIndex(item1 => item1.title === item.title);
        if (index !== -1) {
            Collectcontents.value.splice(index, 1);
        }
    });
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
const deletedesign = async (design: Design) => {
    try {
        await ElMessageBox.confirm(`确定要删除设计《${design.title}》吗？`, '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        });
        designs.value = designs.value.filter((d) => d.id !== design.id);
        ElMessage.success('删除成功');
    } catch {
        ElMessage.info('已取消删除');
    }
};

const handleResource = (resourceType: string, bookvalue?: any, videosvalue?: any, textsvalue?: any) => {
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
const updateResource = (resourceType: string, value: any) => {
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
const handleFileUpload = (event: Event, fileType: 'image' | 'pdf' | 'video' | 'text') => {
    const file = (event.target as HTMLInputElement).files?.[0];
    console.log(file);
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
        case resourceType.value === 'texts' && fileType === 'image':
            newText.value.image = file;
            break;
        case resourceType.value === 'texts' && fileType === 'text':
            if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                newText.value.words = file;
            } else {
                ElMessage.error('请上传正确的.docx格式');
            }
            break;
        default:
            ElMessage.error('文件类型不匹配');
            break;
    }
};
const handleSubmit = () => {
    // console.log(resourceType.value)
    switch (resourceType.value) {
        case 'books':
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
            break;
        case 'videos':
            if (newVideo.value.video && newVideo.value.video instanceof File) {
                const video: Video = {
                    id: Date.now(),
                    title: newVideo.value.title,
                    duration: newVideo.value.duration,
                    description: newVideo.value.description,
                    image: newVideo.value.image ? URL.createObjectURL(newVideo.value.image) : nullvideoimg,
                    path: URL.createObjectURL(newVideo.value.video)
                };
                videos.value.push(video);
                ElMessage.success('新增视频成功');
                break;
            } else {
                ElMessage.error('请上传视频文件');
                break;
            }
        case 'texts':
            if (newText.value.words && newText.value.words instanceof File) {
                const text: Text = {
                    id: Date.now(),
                    title: newText.value.title,
                    description: newText.value.description,
                    image: newText.value.image ? URL.createObjectURL(newText.value.image) : nulltextimg,
                    words: URL.createObjectURL(newText.value.words)
                };
                texts.value.push(text);
                ElMessage.success('新增文本成功');
                break;
            } else {
                ElMessage.error('请上传文本文件');
                break;
            }
        default:
            break;
    }
    isAddModalVisible.value = false;
    resetForm();
};
const resetForm = () => {
    switch (resourceType.value) {
        case 'books':
            newBook.value = {
                title: '',
                author: '',
                isbn: '',
                owner: '',
                description: '',
                image: null,
                pdf: null,
            };
            break;
        case 'videos':
            newVideo.value = {
                title: '',
                duration: '',
                description: '',
                image: null,
                video: null,
            };

            break;
        case 'texts':
            newText.value = {
                title: '',
                description: '',
                image: null,
                words: null,
            };

            break;
        default:
            break;
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
        <ResourceHeader title="教学资源库" subtitle="存储备课助手生成的备课资源,便于查看调用。" />

        <div class="container">
            <!-- 使用 el-tabs 替换 el-select -->
            <el-tabs v-model="resourceType" class="resource-tabs">
                <el-tab-pane label="课件" name="books">
                    <BookList :books="books"
                        @open-book-modal="(book: NewBook) => { selectedBook = book; isBookModalVisible = true; }"
                        @delete-book="deleteBook" @open-add-book-modal="isAddBookModalVisible = true"
                        @open-add-modal="isAddModalVisible = true" />
                </el-tab-pane>
                <el-tab-pane label="视频" name="videos">
                    <VideoList :videos="videos"
                        @open-video-modal="(video: NewVideo) => { selectedVideo = video; isVideoModalVisible = true; }"
                        @delete-video="deleteVideo" @open-add-video-modal="isAddVideoModalVisible = true"
                        @open-add-modal="isAddModalVisible = true" />
                </el-tab-pane>
                <el-tab-pane label="教案" name="texts">
                    <TextList :texts="texts"
                        @open-text-modal="(text: NewText) => { selectedText = text; isTextModalVisible = true; }"
                        @delete-text="deleteText" @open-add-text-modal="isAddTextModalVisible = true"
                        @open-add-modal="isAddModalVisible = true" />
                </el-tab-pane>
                <el-tab-pane label="课堂环节设计" name="designs">
                    <DesignList :designs="designs"
                        @open-design-modal="(design: NewDesign) => { selectedDesign = design; isDesignModalVisible = true; }"
                        @delete-design="deletedesign" @open-add-design-modal="isAddDesignModalVisible = true"
                        @open-add-modal="isAddModalVisible = true" />
                </el-tab-pane>
                <el-tab-pane label="练习题" name="exercises">
                    <TextList :texts="exercises"
                        @open-text-modal="(text: NewText) => { selectedText = text; isTextModalVisible = true; }"
                        @delete-text="deleteText" @open-add-text-modal="isAddTextModalVisible = true"
                        @open-add-modal="isAddModalVisible = true" />
                </el-tab-pane>
            </el-tabs>
        </div>

        <BookModal v-if="selectedBook" :book="selectedBook" :visible="isBookModalVisible"
            @close="isBookModalVisible = false" />

        <VideoModal v-if="selectedVideo" :video="selectedVideo" :visible="isVideoModalVisible"
            @close="isVideoModalVisible = false" @error="handleVideoError" />
        <TextModal v-if="selectedText" :text="selectedText" :visible="isTextModalVisible"
            @close="isTextModalVisible = false" @error="handleTextError" />
        <DesignModal v-if="selectedDesign" :design="selectedDesign" :visible="isDesignModalVisible"
            @close="isDesignModalVisible = false" />
        <AddResourceModal :visible="isAddModalVisible" :type="handleResource(resourceType, 'book', 'video', 'text')"
            :model-value="handleResource(resourceType, newBook, newVideo, newText)"
            @update:model-value="updateResource(resourceType, $event)" @file-upload="handleFileUpload"
            @submit="handleSubmit" @close="isAddModalVisible = false" />
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