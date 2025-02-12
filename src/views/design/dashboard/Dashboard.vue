<script setup lang="ts">

import DashMain from '@/components/Dash_compoents/DashMain.vue';
import Dashcard from '@/components/Dash_compoents/Dashcard.vue';
import { showResult } from './Dashboard';

</script>

<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="showResult ? 24 : 16">
        <el-card :body-style="{ padding: '0' }">
          <DashMain />
        </el-card>
      </el-col>
      <Dashcard />
    </el-row>
  </div>
</template>

