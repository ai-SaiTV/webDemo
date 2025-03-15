<template>
    <div class="floating-button">
      <el-dropdown
        trigger="click"
        placement="bottom-end"
        @visible-change="handleDropdownChange"
      >
        <el-button type="primary">
          <img :src="flash" alt="icon" style="width: 16px; height: 16px; margin-right: 8px;" />
          优化
        </el-button>
        <template #dropdown>
          <el-dropdown-menu class="custom-dropdown">
            <div v-if="!isEditing && !isEditingFinish" class="opt-content">
              <el-input 
                v-model="localOptimizationSuggestion" 
                type="textarea" 
                :rows="2" 
                :placeholder="placeholder"
                resize="none"
                style="border: 15px;"
              />
            </div>
            <div v-else-if="isEditing && !isEditingFinish" class="opt-content">
              正在生成中⏲️...
            </div>
            <div v-else class="opt-content">
              <div v-html="editZoneContent" class="markdown-content" style="max-height: 600px; overflow-y: auto;">
              </div>
            </div>
            <div class="dropdown-footer">
              <el-button 
                @click="handleReplaceClick" 
                :disabled="isEditing || !isEditingFinish"
              >替换</el-button>
              <el-button 
                type="primary" 
                @click="handleConfirmClick" 
                :disabled="isEditing || isEditingFinish"
              >确认</el-button>
            </div>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import flash from '@/assets/icons/dashBoard/flash.png';
  
  const props = defineProps({
    isEditing: {
      type: Boolean,
      required: true
    },
    isEditingFinish: {
      type: Boolean,
      required: true
    },
    optimizationSuggestion: {
      type: String,
      default: ''
    },
    editZoneContent: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: '你希望如何修改'
    }
  });
  
  const emit = defineEmits([
    'update:optimizationSuggestion',
    'dropdownChange',
    'replace',
    'confirm'
  ]);
  
  const localOptimizationSuggestion = ref(props.optimizationSuggestion);
  
  watch(() => props.optimizationSuggestion, (newVal) => {
    localOptimizationSuggestion.value = newVal;
  });
  
  watch(localOptimizationSuggestion, (newVal) => {
    emit('update:optimizationSuggestion', newVal);
  });
  
  const handleDropdownChange = (visible) => {
    emit('dropdownChange', visible);
  };
  
  const handleReplaceClick = () => {
    emit('replace');
  };
  
  const handleConfirmClick = () => {
    emit('confirm');
  };
  </script>
  
  <style scoped lang="scss">
  .floating-button {
    position: absolute;
    right: 20px;
    z-index: 1000;
  }
  
  .opt-content {
    padding: 15px;
    min-width: 300px;
  }
  
  .dropdown-footer {
    display: flex;
    justify-content: flex-end;
    padding: 10px 15px;
    border-top: 1px solid #eee;
  }
  </style>