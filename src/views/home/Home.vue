<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const AboutUs=() =>{
      window.open('https://github.com/ai-SaiTV', '_blank');
    }
const handleEnterSystem = () => {
  router.push('/portal')
}
</script>

<template>
  <div class="home-container">
    <nav class="navbar">
      <div class="logo">
        <img src="/vite.svg" alt="Logo" />
        <span>智慧备课平台</span>
      </div>
      <div class="nav-links">
        <a href="#features">产品特性</a>
        <a href="#about" @click="AboutUs">关于我们</a>
        <el-button type="primary" @click="handleEnterSystem">立即使用</el-button>
      </div>
    </nav>

    <div class="hero-section">
      <h1>智能教案生成系统</h1>
      <p class="subtitle">让备课更高效，让教学更智慧</p>
      <div class="cta-buttons">
        <el-button type="primary" size="large" @click="handleEnterSystem">开始使用</el-button>
        <el-button size="large">了解更多</el-button>
      </div>
    </div>

    <div class="features-section" id="features">
      <div class="feature-card">
        <el-icon class="feature-icon"><Document /></el-icon>
        <h3>智能生成</h3>
        <p>基于AI技术，快速生成专业教案</p>
      </div>
      <div class="feature-card">
        <el-icon class="feature-icon"><TrendCharts /></el-icon>
        <h3>数据分析</h3>
        <p>深入分析学情，优化教学策略</p>
      </div>
      <div class="feature-card">
        <el-icon class="feature-icon"><Collection /></el-icon>
        <h3>资源管理</h3>
        <p>教学资源智能管理与推荐</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  color: white;

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      img {
        height: 32px;
      }

      span {
        font-size: 1.25rem;
        font-weight: 600;
      }
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;

      a {
        color: white;
        text-decoration: none;
        font-size: 1rem;
        transition: opacity 0.3s;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  .hero-section {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 2rem;

    h1 {
      font-size: 3.5rem;
      font-weight: bold;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .subtitle {
      font-size: 1.5rem;
      margin: 1.5rem 0 2.5rem;
      opacity: 0.9;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;

      .el-button {
        padding: 12px 32px;
        font-size: 1.1rem;
      }
    }
  }

  .features-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    padding: 4rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);

    .feature-card {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
      }

      .feature-icon {
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }

      h3 {
        font-size: 1.5rem;
        margin: 0 0 1rem;
      }

      p {
        opacity: 0.9;
        margin: 0;
        line-height: 1.6;
      }
    }
  }
}
</style>