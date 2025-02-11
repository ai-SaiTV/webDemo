<template>
  <el-col  :span="8">
    <el-card class="stat-card">
      <template #header>
        <div class="stat-header">
          <h3>数据概览</h3>
        </div>
      </template>
      <div class="stat-grid">
        <div class="stat-item">
          <div class="stat-value">{{ plan_Num }}</div>
          <div class="stat-label">已创建教案</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ resource_Num }}</div>
          <div class="stat-label">收藏资源</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ applause_rate }}</div>
          <div class="stat-label">好评率</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ time_sum }}</div>
          <div class="stat-label">课时总数</div>
        </div>
      </div>
    </el-card>

    <el-card class="recent-card">
      <template #header>
        <div class="recent-header">
          <h3>最近生成</h3>
        </div>
      </template>
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in 4" :key="index"
          :timestamp="'2024-0' + (activity + 1) + '-0' + (index + 1)" placement="top">
          <div class="timeline-content">
            <h4>{{ ['语文', '数学', '英语', '科学'][index] }}教案</h4>
            <p>{{ ['阅读理解', '分数运算', '语法练习', '植物生长'][index] }}</p>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </el-col>

</template>
<script setup lang="ts">
import { ref } from 'vue';
const plan_Num = ref(12)
const resource_Num = ref(25)
const applause_rate = ref("98%")
const time_sum = ref(45)
</script>

<style scoped lang="scss">
@import "./Dashstyle.css";
</style>