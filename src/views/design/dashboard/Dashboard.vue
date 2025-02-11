<script setup lang="ts">

import DashMain from '@/components/Dash_compoents/DashMain.vue';
import { showResult } from './Dashboard';


</script>

<template>
  <div class="dashboard-container">

        

    <el-row :gutter="24">
      <el-col :span="showResult ? 24 : 16">
        <el-card class="main-card" :body-style="{ padding: '0' }">
          <DashMain/>
        </el-card>
      </el-col>

      <el-col v-if="!showResult" :span="8">
        <el-card class="stat-card">
          <template #header>
            <div class="stat-header">
              <h3>数据概览</h3>
            </div>
          </template>
          <div class="stat-grid">
            <div class="stat-item">
              <div class="stat-value">12</div>
              <div class="stat-label">已创建教案</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">25</div>
              <div class="stat-label">收藏资源</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">98%</div>
              <div class="stat-label">好评率</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">45</div>
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
    </el-row>
  </div>
</template>

<style scoped lang="scss">
@import "./Dashstyle.css";
</style>