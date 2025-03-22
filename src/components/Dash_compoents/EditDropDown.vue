<template>
    <div class="floating-button-opt">
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

    <div class = "floating-button-edit">
      <el-button  type="success" 
      @click="isEditing_textarea = !isEditing_textarea" 
      :disabled="isDropdownOpen || isEditing || isEditingFinish"
      >
      <el-icon style="margin-right: 2px;" ><Edit /></el-icon>
      <span class="gradient-text">{{ isEditing_textarea ? '保存' : '编辑' }}</span>
      </el-button>
    </div>


  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import flash from '@/assets/icons/dashBoard/flash.png';

  const isEditing_textarea = ref(false);
  const emit = defineEmits(['update:is-editing-textarea']);

  // 当状态变化时触发事件
  watch(isEditing_textarea, (newVal) => {
    emit('update:is-editing-textarea', newVal);
  });


  
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


  .floating-button-opt {
    position: absolute;
    right: 120px;
    top: 10px;
    z-index: 1000;
  }

  .floating-button-edit {
    position: absolute;
    right: 30px;
    top: 10px;
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