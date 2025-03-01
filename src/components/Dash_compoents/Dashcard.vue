<!-- 教案生成侧边栏 -->
<template>
  <el-col  v-if="!showResult" :span="8">
    <el-card class="stat-card">
      <template #header>
        <div class="stat-header">
          <h3>历史学情分析反馈</h3>
            <div class="markdown-container">
              <!-- 渲染 Markdown 内容 -->
              <div v-html="Pp_Html" class="markdown-content"></div>
            </div>
        </div>
      </template>
      <div class="stat-grid">
        {{DataThis}}
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
            <h4>{{ ['人教版 语文四年级上册', '人教版 语文四年级上册', '人教版 语文四年级上册', '人教版 语文四年级上册'][index] }}</h4>
            <p>{{ ['第七单元 21 古诗词三首', '第七单元 22 为中华之崛起而读书', '第八单元 25 王戎不取道旁李', '第八单元 26 西门豹治邺'][index] }}</p>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </el-col>

</template>
<script setup lang="ts">
import { onMounted, ref } from '@vue/runtime-core';
import { parseMarkdown } from '@/utils/markdownUtils';
// const plan_Num = ref(12)
// const resource_Num = ref(25)
// const applause_rate = ref("98%")
// const time_sum = ref(45)

defineProps({
  showResult:Boolean,
})


const Generate_Prompt = ref(`
  <div class="key-concept">
【基础数据】
- 班级规模：<span class="highlight">32人</span>
- 前置知识合格率：<span class="highlight">76%</span> → 薄弱点：<span class="highlight">简答题</span>（错误率<span class="highlight">63%</span>）
</div>

【能力分层】
| 层级   | 占比   | 特征                  |
|--------|--------|-----------------------|
| 优秀层 | <span class="highlight">18%</span> | 能完成\`文言文字词翻译\`任务  |
| 困难层 | 22%     | 易错点： <span class="highlight">阅读题文意理解</span> |

【高频错误】
  <span class="highlight">暂无</span>
`);

const Pp_Html = ref('');

onMounted(() => {
  Pp_Html.value = parseMarkdown(Generate_Prompt.value).__html;
  console.log(Pp_Html.value);
});



</script>

<style scoped lang="scss">
.stat-card,
  .recent-card {
    margin-bottom: 1.5rem;

    .stat-header,
    .recent-header {
      h3 {
        margin: 0;
        font-size: 1.1rem;
        color: #1f2937;
      }
    }
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;

    .stat-item {
      padding: 1rem;
      background: #f8fafc;
      border-radius: 8px;
      text-align: center;

      .stat-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1890ff;
        line-height: 1.2;
      }

      .stat-label {
        margin-top: 0.5rem;
        color: #64748b;
        font-size: 0.875rem;
      }
    }
  }

  .timeline-content {
    h4 {
      margin: 0;
      color: #1f2937;
      font-size: 0.95rem;
    }

    p {
      margin: 0.25rem 0 0;
      color: #64748b;
      font-size: 0.875rem;
    }
  }

</style>