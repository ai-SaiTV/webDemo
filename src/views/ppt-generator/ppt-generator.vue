<template>
  <div class="ppt-generator">
    <h2 class="text-2xl font-bold mb-4">辅助生成PPT</h2>
    <p class="mb-4">在这里，您可以生成PPT。</p>
    <div ref="editor" class="quill-editor"></div>
    <div class="flex gap-4 justify-center mt-4">
      <button @click="saveContent" class="btn">保存内容</button>
      <button @click="addTemplate" class="btn">更多幻灯片模板</button>
      <button @click="addAnimation" class="btn">动画效果</button>
      <button @click="changeTheme" class="btn">主题切换</button>
      <button @click="collaborativeEdit" class="btn">协同编辑</button>
    </div>
  </div>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default {
  name: 'PPTGenerator',
  data() {
    return {
      editor: null,
    };
  },
  mounted() {
    this.initQuill();
  },
  methods: {
    initQuill() {
      this.$nextTick(() => {
        this.editor = new Quill(this.$refs.editor, {
          theme: 'snow',
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ direction: 'rtl' }],
              [{ size: ['small', false, 'large', 'huge'] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ['link', 'image', 'video'],
              ['clean'],
            ],
          },
        });
      });
    },
    saveContent() {
      const content = this.editor.root.innerHTML;
      console.log('Saved content:', content);
      // 这里可以添加保存内容的逻辑，例如发送到服务器或下载为文件
      
    },
    addTemplate() {
      // 添加更多幻灯片模板的逻辑
      console.log('添加更多幻灯片模板');
      
    },
    addAnimation() {
      // 添加动画效果的逻辑
      console.log('添加动画效果');
    },
    changeTheme() {
      // 主题切换的逻辑
      console.log('主题切换');
    },
    collaborativeEdit() {
      // 协同编辑的逻辑
      console.log('协同编辑');
    },
  },
};
</script>

<style scoped>
.ppt-generator {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quill-editor {
  height: 400px;
}

.btn {
  padding: 0.5rem 1rem; 
  background-color: #3b82f6; 
  color: white; 
  border-radius: 0.375rem; 
  transition: background-color 0.3s, transform 0.3s; 
}
.btn:hover {
  background-color: #1d4ed8; 
  transform: scale(1.05); 
}
</style>