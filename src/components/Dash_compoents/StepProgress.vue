<template>
    <el-progress
      v-if="isProcessing || isEditing"
      :percentage="progress"
      :stroke-width="8"
      :color="gradientColor"
      :status="progressStatus"
    />
</template>
  
<script setup>
import {
  isProcessing, progress,
  showResult, progressStatus,
  isEditing,
} from '@/components/Dash_compoents/DashCompoents.ts'

</script>