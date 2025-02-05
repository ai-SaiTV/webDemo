<template>
  <div class="flex flex-col items-center justify-center h-screen text-center bg-gray-100">
    <!-- 步骤 1: 填写课程信息 -->
    <div v-if="step === 1" class="step p-6 bg-white rounded-lg shadow-md w-3/4">
      <h2 class="text-2xl font-bold mb-4">步骤 1: 填写课程基本信息</h2>
      <p class="mb-4">请输入课程基本信息，生成教学大纲。</p>
      
      <div class="mb-4">
        <label for="courseName" class="block font-semibold">课程名称:</label>
        <input v-model="courseName" id="courseName" type="text" class="input-field" placeholder="请输入课程名称" />
      </div>
      
      <div class="mb-4">
        <label for="chapter" class="block font-semibold">章节:</label>
        <input v-model="chapter" id="chapter" type="text" class="input-field" placeholder="请输入章节" />
      </div>
      
      <div class="mb-4">
        <label for="content" class="block font-semibold">具体内容:</label>
        <textarea v-model="content" id="content" class="input-field" rows="4" placeholder="请输入具体内容"></textarea>
      </div>
      
      <button @click="generateOutline" class="btn mb-4">生成大纲</button>

      <div v-if="outlineGenerated" class="output mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
        <h3 class="text-xl font-bold mb-2">教学大纲：</h3>
        <ul>
          <li><strong>课程名称：</strong>{{ courseName }}</li>
          <li><strong>章节：</strong>{{ chapter }}</li>
          <li><strong>具体内容：</strong>{{ content }}</li>
        </ul>
      </div>
      
      <button @click="nextStep" class="btn">下一步</button>
    </div>

    <!-- 步骤 2: 辅助生成思维导图 -->
    <div v-if="step === 2" class="step p-6 bg-white rounded-lg shadow-md w-3/4">
      <h2 class="text-2xl font-bold mb-4">步骤 2: 辅助生成思维导图</h2>
      <p class="mb-4">我们将根据您填写的教学大纲信息，帮助您构建思维导图。</p>

      <div class="output mb-4 p-4 bg-gray-50 rounded-lg shadow-inner" id="mindmap">
        <h3 class="text-xl font-bold mb-2">思维导图结构：</h3>
        <ul>
          <li><strong>课程名称：</strong>{{ courseName }}</li>
          <li><strong>章节：</strong>{{ chapter }}</li>
          <li><strong>具体内容：</strong>{{ content }}</li>
        </ul>
        <p class="mt-2">根据上述内容，您可以在思维导图工具中创建您的思维导图。</p>
        <!-- D3 渲染树状图的容器 -->
        <div ref="mindmapContainer" class="relative w-full h-96"></div>
      </div>

      <button @click="nextStep" class="btn">下一步</button>
      <button @click="addRootNode" class="btn">添加根节点</button>
      <button @click="addChildNode" class="btn">添加子节点</button>
      <div ref="mindmapContainer" ></div>
    </div>

    <!-- 后续步骤 -->
    <div v-if="step === 3" class="step p-6 bg-white rounded-lg shadow-md w-3/4">
      <h2 class="text-2xl font-bold mb-4">步骤 3: 生成PPT</h2>
      <p class="mb-4">在这里，您可以生成PPT。</p>
      <div class="output mb-4 p-4 bg-gray-50 rounded-lg shadow-inner h-32"></div>
      <button @click="nextStep" class="btn">下一步</button>
      <button @click="goToPPTGenerator" class="btn mt-4">生成PPT</button>
    </div>

    <div v-if="step === 4" class="step p-6 bg-white rounded-lg shadow-md w-3/4">
      <h2 class="text-2xl font-bold mb-4">步骤 4: 生成练习题</h2>
      <p class="mb-4">在这里，您可以生成练习题。</p>
      <div class="output mb-4 p-4 bg-gray-50 rounded-lg shadow-inner h-32"></div>
      <button @click="resetSteps" class="btn">完成</button>
    </div>
  </div>
</template>

<script>
// 引入外部的 design.js 文件
import DesignMethods from '@/views/design/design.js';

export default {
  name: 'Design',
  data() {
    return DesignMethods.data();
  },
  methods: DesignMethods.methods,
};
</script>

<style scoped>
/* 输入框样式 */
.input-field {
  @apply w-full p-2 border border-gray-300 rounded-md;
}

/* 按钮样式 */
.btn {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300;
}

/* 树状图样式 */
.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 2px;
}

.node circle {
  fill: lightsteelblue;
  stroke: steelblue;
  stroke-width: 2px;
}

.node text {
  font-size: 14px;
  text-anchor: middle;
}
</style>
