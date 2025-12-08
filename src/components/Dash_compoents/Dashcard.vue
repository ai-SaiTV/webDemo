<!-- 教案生成侧边栏 -->
<template>
  <el-col  v-if="!showResult" :span="8">
    <el-card class="stat-card" style="padding: 4px;">
      <template #header>
        <div class="stat-header">
          <h3>历史学情分析反馈</h3>
        </div>
      </template>


      

        <div class="markdown-content" style = "max-height: 600px; overflow-y: auto;">

          <div ref="chartRef" class="analysis-chart"></div>

          <!-- 渲染 Markdown 内容 -->
          <div v-html="Pp_Html" class="markdown-content"></div>
        </div>
      

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
import { onMounted, ref } from 'vue';
import { parseMarkdown } from '@/utils/markdownUtils';
import { ElCard } from 'element-plus';
// const plan_Num = ref(12)
// const resource_Num = ref(25)
// const applause_rate = ref("98%")
// const time_sum = ref(45)

defineProps({
  showResult:Boolean,
});


const Generate_Prompt = ref(`
<div class="key-concept">

### 基础数据
- **班级规模**：32人  
- **前置知识合格率**：76%  
  - **合格标准**：得分≥80%  
  - **最高分**：95分  
  - **最低分**：58分
  - **薄弱环节**：  
  - **简答题** ： 错误率63%（平均得分7.2/15分）  
  - 典型错误：  
    - 答案要点不全（占比40%）  
    - 逻辑表述混乱（占比35%）  
    - 格式不规范（占比25%）  

---

### 能力分层分析（基于最近三次测试数据）
| 层级   | 占比   | 特征描述                                                                 | 典型学生案例          |
|--------|--------|--------------------------------------------------------------------------|-----------------------|
| 优秀层 | 18%    | 能独立完成文言文字词翻译、古诗赏析等高阶任务，综合得分≥90分              | 王五（92分）、赵六（95分） |
| 中等层 | 60%    | 掌握基础知识点，但在综合应用题和开放性问题中存在明显短板                  | 张三（82分）、陈七（78分） |
| 困难层 | 22%    | 基础知识掌握不足，易混淆概念，阅读题文意理解错误率高达85%                | 李四（65分）、刘八（58分） |

---

### 高频错误类型统计（近一周作业数据）
| 错误类型         | 发生率 | 典型表现                                                                 |
|------------------|--------|--------------------------------------------------------------------------|
| **文言文翻译错误** | 38%    | 字词误译（如"之"翻译为"的"时忽略语法环境）、句式结构理解偏差             |
| **阅读理解偏差**  | 27%    | 未抓住关键句、过度推断、忽略题目限定条件                                 |
| **书写规范问题**  | 22%    | 答案未分点、标点使用不当、字迹潦草导致失分                               |
| **计算/标注错误** | 13%    | 数值计算错误、图表标注位置错误、单位遗漏                                 |

---

### 改进建议
1. **针对简答题**：  
   - 增加"答案结构化训练"：要求学生使用"总-分-总"格式作答  
   - 开设"典型错误案例分析"专项课（每周1次）  
2. **分层教学方案**：  
   - 优秀层：拓展《史记》选读与文言文写作  
   - 困难层：基础词汇每日听写+阅读理解思维导图训练  
3. **技术辅助**：  
   - 使用AI批改系统自动标注简答题结构问题  
   - 开发"错题本"小程序记录高频错误类型  
</div>
`);

const Pp_Html = ref('');


import * as echarts from 'echarts'; // 导入 ECharts

// 数据定义
const chartData = ref([
  { value: 18, name: '优秀层' },
  { value: 60, name: '中等层' },
  { value: 22, name: '困难层' }
]);

// 图表容器引用
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// 初始化配置
const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    renderChart();
  }
};

// 渲染图表
const renderChart = () => {
  if (chartInstance) {
    chartInstance.setOption({
      color: ['#5470C6', '#91CC75', '#FAC858'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: [{
        type: 'pie',
        radius: '70%',
        center: ['50%', '50%'],
        data: chartData.value.map(item => ({
          value: item.value,
          name: item.name
        })),
        label: {
          show: true,
          formatter: '{b}: {d}%',
          position: 'outside'
        }
      }]
    });
  }
};

onMounted(() => {
  initChart();
  Pp_Html.value = parseMarkdown(Generate_Prompt.value).__html;
});

</script>

<style scoped lang="scss">

.analysis-chart {
  height: 200px;
  margin-bottom: 1rem;
}

.stat-grid {
  margin-top: -20px; // 调整与图表间距（根据实际调整）
}



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