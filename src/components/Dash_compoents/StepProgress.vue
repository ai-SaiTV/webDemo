<template>
  <div class="step-progress">
    <el-progress
      v-if="isProcessing || isEditing"
      :percentage="Math.floor(progress)"
      :text-inside="true"
      :stroke-width="16"
      :color="gradientColor"
    />
  </div>
    
</template>
  
<script setup>
import {
  isProcessing, isEditing,
  progressStatus, gradientColor, progress

} from "@/components/Dash_compoents/DashCompoents.ts"

</script>

<style scoped>
.step-progress {
  padding: 2px 2px 0;
}
</style>