<template>
    <div class="flex h-screen">
      <!-- 左侧分类 -->
      <div class="w-1/4 bg-gray-200 p-4">
        <ul>
          <li @click="setActiveTab('design')" :class="{'active': activeTab === 'design'}" class="p-2 cursor-pointer hover:bg-gray-300 rounded">教学设计</li>
          <li @click="setActiveTab('resources')" :class="{'active': activeTab === 'resources'}" class="p-2 cursor-pointer hover:bg-gray-300 rounded">教育资源</li>
          <li @click="setActiveTab('questionBank')" :class="{'active': activeTab === 'questionBank'}" class="p-2 cursor-pointer hover:bg-gray-300 rounded">练习题库</li>
          <li @click="setActiveTab('analysis')" :class="{'active': activeTab === 'analysis'}" class="p-2 cursor-pointer hover:bg-gray-300 rounded">学情分析</li>
        </ul>
      </div>
  
      <!-- 右侧内容 -->
      <div class="w-3/4 p-4 bg-gray-100">
        <div v-if="activeTab === 'design'" class="p-6 bg-white rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">教学设计</h2>
          <!-- 教学设计内容 -->
        </div>
        <div v-if="activeTab === 'resources'" class="p-6 bg-white rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">教育资源</h2>
          <div class="grid grid-cols-3 gap-4">
            <div class="resource-card" @click="navigateTo('videos')">视频</div>
            <div class="resource-card" @click="navigateTo('textbooks')">教科书</div>
            <div class="resource-card" @click="navigateTo('questionSets')">练习题集合</div>
          </div>
        </div>
        <div v-if="activeTab === 'questionBank'" class="p-6 bg-white rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">练习题库</h2>
          <!-- 练习题库内容 -->
        </div>
        <div v-if="activeTab === 'analysis'" class="p-6 bg-white rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">学情分析</h2>
          <div class="flex">
            <div class="w-2/3 p-4 bg-white rounded-lg shadow-md">
              <!-- 折线图 -->
              <h3 class="text-xl font-bold mb-4">折线图</h3>
              <div class="chart h-64"></div>
            </div>
            <div class="w-1/3 p-4">
              <h3 class="text-xl font-bold mb-4">学生名单</h3>
              <ul>
                <li v-for="student in students" :key="student.id" @click="selectStudent(student)" class="p-2 cursor-pointer hover:bg-gray-200 rounded">{{ student.name }}</li>
              </ul>
            </div>
          </div>
          <div v-if="selectedStudent" class="mt-4 p-4 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-bold mb-4">{{ selectedStudent.name }}的学情分析</h3>
            <!-- 学生作业，错题分析 -->
            <div class="chart h-64 mb-4"></div>
            <div class="analysis">
              <p>错题分析数据</p>
              <!-- 假数据 -->
              <ul>
                <li v-for="(error, index) in selectedStudent.errors" :key="index">{{ error }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Backend',
    data() {
      return {
        activeTab: 'design',
        students: [
          { id: 1, name: '学生A', errors: ['错题1', '错题2'] },
          { id: 2, name: '学生B', errors: ['错题3', '错题4'] },
          // 更多学生数据
        ],
        selectedStudent: null,
      };
    },
    methods: {
      setActiveTab(tab) {
        this.activeTab = tab;
        this.selectedStudent = null;
      },
      navigateTo(resource) {
        console.log(`Navigating to ${resource}`);
      },
      selectStudent(student) {
        this.selectedStudent = student;
      },
    },
  };
  </script>
  
  <style scoped>
  .active {
    background-color: #007bff;
    color: white;
  }
  .resource-card {
  padding: 1rem; 
  background-color: white; 
  border-radius: 0.5rem; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
  cursor: pointer; 
  transition: background-color 0.3s ease; 
}

.resource-card:hover {
  background-color: #f3f4f6; 
}

.chart {
  background-color: #f3f4f6; 
  border-radius: 0.5rem; 
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1); 
}
  </style>