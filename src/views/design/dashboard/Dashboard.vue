<script setup lang="ts">

import DashMain from '@/components/Dash_compoents/DashMain.vue';
import Dashcard from '@/components/Dash_compoents/Dashcard.vue';
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
      <Dashcard/>
    </el-row>   
  </div>
</template>

<style scoped lang="scss">
@import "./Dashstyle.css";
</style>