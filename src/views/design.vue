<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Menu as IconMenu, Document, Collection, TrendCharts, Calendar } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isCollapse = ref(true)


const handleSidebarToggle = (event: Event) => {
  const { detail } = event as CustomEvent;
  isCollapse.value = detail; // 更新侧边栏状态
};

onMounted(() => {
  window.addEventListener('toggleSidebar', handleSidebarToggle);
});

onBeforeUnmount(() => {
  window.removeEventListener('toggleSidebar', handleSidebarToggle);
});

const handleMenuSelect = (index: string) => {
  switch (index) {
    case '1':
      router.push('/dashboard')
      break
    case '2':
      // 教学资源页面待开发
      break
    case '3':
      router.push('/analysis')
      break
    case '4':
      router.push('/course')
      break
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
      <div class="logo">
        <img src="/vite.svg" alt="Logo" class="logo-img" />
        <span v-show="!isCollapse">智慧备课平台</span>
      </div>
      <el-menu
        :collapse="isCollapse"
        class="menu"
        default-active="1"
        background-color="#001529"
        text-color="#fff"
        @select="handleMenuSelect"
      >
        <el-menu-item index="1">
          <el-icon><Document /></el-icon>
          <span>教案生成</span>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon><Collection /></el-icon>
          <span>教学资源</span>
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><TrendCharts /></el-icon>
          <span>学情分析</span>
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><Calendar /></el-icon>
          <span>课程管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <el-button
          type="text"
          class="collapse-btn"
          @click="isCollapse = !isCollapse"
        >
          <el-icon><IconMenu /></el-icon>
        </el-button>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar size="small" />
              教师用户
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  
  .aside {
    background-color: #001529;
    transition: width 0.3s;
    
    .logo {
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      color: white;
      
      .logo-img {
        height: 32px;
        margin-right: 12px;
      }
    }
    
    .menu {
      border-right: none;
    }
  }
  
  .header {
    background-color: white;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    
    .collapse-btn {
      font-size: 20px;
    }
    
    .header-right {
      .user-info {
        display: flex;
        align-items: center;
        cursor: pointer;
        
        .el-avatar {
          margin-right: 8px;
        }
      }
    }
  }
  
  .main {
    background-color: #f0f2f5;
    padding: 20px;
  }
}
</style>