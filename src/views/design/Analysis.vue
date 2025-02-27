<template>
  <div class="analysis-container">
    <!-- 班级选择和上传区域 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="16">
        <el-card class="upload-card">
          <template #header>
            <div class="card-header">
              <span>成绩单导入</span>
              <el-select v-model="selectedClassId" placeholder="选择班级" @change="reloadClassData">
                <el-option
                  v-for="class_ in classes"
                  :key="class_.id"
                  :label="class_.name"
                  :value="class_.id"
                />
              </el-select>
            </div>
          </template>
          <div class="upload-area">
            <input
              ref="uploadRef"
              type="file"
              accept=".xlsx,.xls"
              style="display: none"
              @change="handleExcelUpload"
            />
            <el-button type="primary" @click="uploadRef.click()">
              <el-icon><Upload /></el-icon>
              上传成绩单
            </el-button>
            <p class="upload-tip">支持.xlsx或.xls格式，请确保第一列为学生姓名，后续列为题目分数</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="student-list-card">
          <template #header>
            <div class="card-header">
              <span>班级学生</span>
            </div>
          </template>
          <el-scrollbar height="200px">
            <div class="student-list">
              <div
                v-for="student in currentClassStudents"
                :key="student.id"
                class="student-item"
                @click="viewStudentDetails(student)"
              >
                <el-avatar :size="32">{{ student.name.charAt(0) }}</el-avatar>
                <span class="student-name">{{ student.name }}</span>
                <el-button type="primary" link size="small">查看详情</el-button>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据分析区域 -->
    <template v-if="1">
      <!-- 图表分析 -->
      <el-row :gutter="20" class="chart-row">
        <el-col :span="12">
          <el-card class="chart-card">
            <div ref="performanceChartRef" style="height: 400px;"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card">
            <div ref="questionAnalysisChartRef" style="height: 400px;"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 成绩明细表格 -->
      <el-card class="table-card">
        <template #header>
          <div class="card-header">
            <span>成绩明细</span>
            
          </div>
        </template>
        <el-table :data="tableData" style="width: 100%" max-height="400">
          <el-table-column prop="name" label="姓名" width="120" fixed />
          <el-table-column
            v-for="(_, index) in questions"
            :key="index"
            :prop="`scores[${index}]`"
            :label="`题目${index + 1}`"
            width="100"
          />
          <el-table-column prop="total" label="总分" width="100" fixed="right" />
          <el-table-column prop="rank" label="排名" width="80" fixed="right" />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="viewStudentDetails(row)">
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- AI分析结果 -->
      <el-card class="ai-analysis-card">
        <template #header>
          <div class="card-header">
            <span> AI学情分析 </span>
            <el-tag type="success">智能分析报告</el-tag>
          </div>
          <el-button type="primary" @click="generateAIAnalysis" >
              <el-icon><Connection /></el-icon>
              AI分析
            </el-button>
        </template>
        <div v-loading="isAnalyzing" class="ai-analysis-content">
          <div class="analysis-section">
            <h4>整体分析</h4>
            <p>{{ aiAnalysisResult.overallAnalysis }}</p>
          </div>
          <div class="analysis-section">
            <h4>关键发现</h4>
            <ul>
              <li v-for="(point, index) in aiAnalysisResult.keyPoints" :key="index">
                {{ point }}
              </li>
            </ul>
          </div>
          <div class="analysis-section">
            <h4>教学建议</h4>
            <!-- <ul>
              <li v-for="(rec, index) in aiAnalysisResult.recommendations" :key="index">
                {{ rec }}
              </li>
            </ul> -->
            <div class="markdown-container">
              <!-- 渲染 Markdown 内容 -->
              <div v-html="aiAnalysisResult.recommendations" class="markdown-content"></div>
            </div>
          </div>
        </div>
      </el-card>
    </template>

    <!-- 学生详情对话框 -->
    <el-dialog
      v-model="showStudentDetails"
      :title="`${selectedStudent?.name || ''} - 学生详情`"
      width="80%"
    >
      <div v-loading="isAnalyzing">
        <el-row :gutter="20">
          <!-- 基本信息 -->
          <el-col :span="8">
            <el-card class="student-info-card">
              <div class="student-profile">
                <el-avatar :size="64">{{ selectedStudent?.name.charAt(0) }}</el-avatar>
                <h3>{{ selectedStudent?.name }}</h3>
                <p>{{ selectedStudent?.class }}</p>
                <div class="student-stats">
                  <div class="stat-item">
                    <div class="label">本次得分</div>
                    <div class="value">{{ selectedStudent?.total || 0 }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="label">平均分</div>
                    <div class="value">{{ selectedStudent?.total.toFixed(2) || 0 }}</div>
                  </div>
                  <div class="stat-item">
                    <div class="label">排名</div>
                    <div class="value">{{ selectedStudent?.rank || '-' }}</div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
          
          <!-- 成绩趋势 -->
          <el-col :span="16">
            <el-card class="trend-card">
              <div ref="studentPerformanceChartRef" style="height: 300px;"></div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 个人分析 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>优势分析</span>
                </div>
              </template>
              <ul class="analysis-list">
                <li v-for="(strength, index) in studentAnalysis.strengths" :key="index">
                  <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
                  {{ strength }}
                </li>
              </ul>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>待提升项</span>
                </div>
              </template>
              <ul class="analysis-list">
                <li v-for="(weakness, index) in studentAnalysis.weaknesses" :key="index">
                  <el-icon class="warning-icon"><Warning /></el-icon>
                  {{ weakness }}
                </li>
              </ul>
            </el-card>
          </el-col>
        </el-row>

        <!-- 学习建议 -->
        <el-card class="mt-4">
          <template #header>
            <div class="card-header">
              <span>学习建议</span>
            </div>
          </template>
          <div class="markdown-container">
              <!-- 渲染 Markdown 内容 -->
              <div v-html="studentAnalysis.recommendations" class="markdown-content"></div>
          </div>
          <!-- <ul class="recommendation-list">
            <!-- <li v-for="(rec, index) in studentAnalysis.recommendations" :key="index">
              <el-icon><Star /></el-icon>
              {{ rec }}
            </li> -->
            
          <!-- </ul> -->
        </el-card>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "@vue/runtime-core";
import * as echarts from "echarts";
import * as XLSX from "xlsx";
import { ElMessage } from "element-plus";



interface Student {
  id: string;
  name: string;
  scores: number[];
  total: number;
  average: number;
  rank: number;
  class: string;
}

interface Question {
  id: number;
  correctRate: number;
  averageScore: number;
  maxScore: number;
}

interface Class {
  id: string;
  name: string;
  grade: string;
  students: Student[];
}

const performanceChartRef = ref<HTMLElement>();
const questionAnalysisChartRef = ref<HTMLElement>();
const studentPerformanceChartRef = ref<HTMLElement>();
const uploadRef = ref();
const tableData = ref<Student[]>([]);
const questions = ref<Question[]>([]);
const showAIAnalysis = ref(false);
const isAnalyzing = ref(false);
const showStudentDetails = ref(false);
const selectedStudent = ref<Student | null>(null);
const selectedClassId = ref("1-1");

const classes = ref<Class[]>([
  {
    id: "1-1",
    name: "一年级一班",
    grade: "一年级",
    students: [],
  },
  {
    id: "1-2",
    name: "一年级二班",
    grade: "一年级",
    students: [],
  },
]);

const aiAnalysisResult = ref<{
  overallAnalysis: string;
  recommendations: string;
  keyPoints: string[];
}>({
  overallAnalysis: "",
  recommendations: "",
  keyPoints: [],
});

const studentAnalysis = ref({
  strengths: [] as string[],
  weaknesses: [] as string[],
  trend: [] as { date: string; score: number }[],
  recommendations: [] as string[],
});

// 处理Excel文件上传
const handleExcelUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const file = target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) {
        ElMessage.error("文件读取失败");
        return;
      }

      const workbook = XLSX.read(data as ArrayBuffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      processExcelData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  }
};

// 处理Excel数据
const processExcelData = (data: any[]) => {
  const processedData: Student[] = [];
  const questionCount = Object.keys(data[0]).length - 1;

  questions.value = Array.from({ length: questionCount }, (_, i) => ({
    id: i + 1,
    correctRate: 0,
    averageScore: 0,
    maxScore: 0,
  }));

  data.forEach((row, index) => {
    const scores = Array.from({ length: questionCount }, (_, i) =>
      Number(row[`题目${i + 1}`] || 0)
    );
    const total = scores.reduce((a, b) => a + b, 0);

    processedData.push({
      id: String(index + 1),
      name: row["姓名"],
      class: selectedClassId.value,
      scores,
      total,
      average: total / questionCount,
      rank: 0,
    });

    scores.forEach((score, index) => {
      questions.value[index].maxScore = Math.max(
        questions.value[index].maxScore,
        score
      );
      questions.value[index].averageScore += score;
    });
  });

  // 计算每个题目的平均得分（总分除以班级人数）
  questions.value.forEach((q) => {
    q.averageScore /= data.length;
  });

  processedData.sort((a, b) => b.total - a.total);
  processedData.forEach((student, index) => {
    student.rank = index + 1;
  });

  tableData.value = processedData;

  // 更新班级学生列表
  const currentClass = classes.value.find((c) => c.id === selectedClassId.value);
  if (currentClass) {
    currentClass.students = processedData;
  }

  // 更新图表和分析
  updateCharts();
  // generateAIAnalysis();
};

// 更新图表
const updateCharts = () => {
  if (performanceChartRef.value && questionAnalysisChartRef.value) {
    const performanceChart = echarts.init(performanceChartRef.value);
    const questionAnalysisChart = echarts.init(questionAnalysisChartRef.value);

    const scoreRanges = ["90-100", "80-89", "70-79", "60-69", "60以下"];
    const scoreCounts = new Array(5).fill(0);

    tableData.value.forEach((student) => {
      const total = student.total;
      if (total >= 90) scoreCounts[0]++;
      else if (total >= 80) scoreCounts[1]++;
      else if (total >= 70) scoreCounts[2]++;
      else if (total >= 60) scoreCounts[3]++;
      else scoreCounts[4]++;
    });

    performanceChart.setOption({
      title: { text: "成绩分布" },
      tooltip: {},
      xAxis: { data: scoreRanges },
      yAxis: {},
      series: [
        {
          name: "学生人数",
          type: "bar",
          data: scoreCounts,
          itemStyle: { color: "#1890ff" },
        },
      ],
    });

    questionAnalysisChart.setOption({
      title: { text: "题目得分分析" },
      tooltip: { trigger: "axis" },
      legend: { data: ["平均得分"] },
      xAxis: {
        type: "category",
        data: questions.value.map((q) => `题目${q.id}`),
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "平均得分",
          type: "line",
          data: questions.value.map((q) => q.averageScore.toFixed(2)),
        },
      ],
    });
  }
};


let stopPollingWatch: (() => void) | null = null;
let isUpdatingStep = ref(false); // 状态锁

//api------------------------------------------------------------->>

//api
import { chatConfig, handleSubmit_analysis,isPolling } from "@/components/api_compoents/api_handler.ts";
import { analysisService } from "@/services/storage/analysisResService";
import type { analysisRes } from "@/types/analysisRes";

import { parseMarkdown } from '../../utils/markdownUtils';

const DataThisSession_als = ref< analysisRes | null>(null);  // 会话数据
const sessionId = ref("");


// 生成AI分析
const generateAIAnalysis = async () => {
  
  

  // 计算题目正确率和平均分
  questions.value.forEach((q) => {
    q.correctRate = (q.averageScore / q.maxScore) * 100;
  });

  // 整体分析
  const totalStudents = tableData.value.length;
  const classAverageScore = questions.value.reduce((sum, q) => sum + q.averageScore, 0) ;
  const overallAnalysis = `本次考试共有${totalStudents}名学生参加，平均得分为${classAverageScore.toFixed(2)}分。`;

  // 关键发现：找出正确率最低的3道题目
  const keyPoints = questions.value
    .map((q, index) => ({
      question: `题目${index + 1}`,
      averageScore: q.averageScore,
      correctRate: q.correctRate,
    }))
    .sort((a, b) => a.correctRate - b.correctRate)
    .slice(0, 3) // 提取正确率最低的3道题目
    .map((q) => `${q.question}的平均得分为${q.averageScore.toFixed(2)}分，正确率为${q.correctRate.toFixed(1)}%。`);

  // 教学建议：针对这些题目提出建议
  const recommendations = ref("");

    //api
  if (stopPollingWatch) {
        stopPollingWatch();
        stopPollingWatch = null;
    }

    if (DataThisSession_als.value === null) {
        sessionId.value = await analysisService.createSession();
    }

    isAnalyzing.value = true;
    showAIAnalysis.value = true;

    
    chatConfig.value.message = overallAnalysis;

    const result = await handleSubmit_analysis(sessionId.value, 6);

    console.log("await finished! ",result);
    DataThisSession_als.value = result || null;
    const html_res = parseMarkdown(result?.analysis || "");
    recommendations.value = html_res.__html || "无建议";
    

    stopPollingWatch = watch(() => isPolling.value, async (newPolling: boolean) => {
        if (newPolling) {
            setTimeout((): void => {
                isAnalyzing.value = false;
                // 安全递增步骤
                // 清理监听器并释放锁
                if (stopPollingWatch) {
                    stopPollingWatch();
                    stopPollingWatch = null;
                }
                isUpdatingStep.value = false;
            }, 500);
            
        }
    }, { immediate: true });
  

  aiAnalysisResult.value = {
    overallAnalysis,
    keyPoints,
    recommendations: recommendations.value,
  };

  isAnalyzing.value = false;
};

// const markdownContent = ref(`
// ## 暂无
// `);

// 生成学生个人分析
const generateStudentAnalysis = async (student: Student) => {
  isAnalyzing.value = true;

  await new Promise((resolve) => setTimeout(resolve, 1500));

  // 计算学生在每个题目的得分情况
  const studentScores = student.scores.map((score, index) => ({
    question: `题目${index + 1}`,
    score,
    maxScore: questions.value[index].maxScore,
    correctRate: questions.value[index].correctRate,
  }));

  // 优势分析：得分高于平均分的题目
  const strengths = studentScores
    .filter((q) => q.score > q.maxScore * 0.8)
    .map((q) => `${q.question}得分较高，为${q.score}分，表现优秀。`);

  // 待提升项：得分低于平均分的题目
  const weaknesses = studentScores
    .filter((q) => q.score < q.maxScore * 0.5)
    .map((q) => `${q.question}得分较低，为${q.score}分，需要加强练习。`);

  // 学习建议：针对待提升的题目提出建议
  const recommendations = [
    `针对得分较低的题目，建议多做相关练习题，巩固知识点。`,
    `保持在得分较高的题目的优势，继续提升解题技巧。`,
    `建议定期复习错题，总结解题思路，避免重复错误。`,
  ];

  studentAnalysis.value = {
    strengths,
    weaknesses,
    trend: [
      { date: "2024-01", score: 85 },
      { date: "2024-02", score: 88 },
      { date: "2024-03", score: 92 },
    ],
    recommendations,
  };

  if (studentPerformanceChartRef.value) {
    const chart = echarts.init(studentPerformanceChartRef.value);
    chart.setOption({
      title: { text: "成绩趋势" },
      tooltip: { trigger: "axis" },
      xAxis: {
        type: "category",
        data: studentAnalysis.value.trend.map((item) => item.date),
      },
      yAxis: { type: "value", min: 60 },
      series: [
        {
          name: "成绩",
          type: "line",
          data: studentAnalysis.value.trend.map((item) => item.score),
          smooth: true,
          itemStyle: { color: "#1890ff" },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(24,144,255,0.3)" },
                { offset: 1, color: "rgba(24,144,255,0.1)" },
              ],
            },
          },
        },
      ],
    });
  }

  isAnalyzing.value = false;
};

// 查看学生详情
const viewStudentDetails = (student: Student) => {
  selectedStudent.value = student;
  showStudentDetails.value = true;
  generateStudentAnalysis(student);
};

// 获取当前选中班级的学生列表
const currentClassStudents = computed(() => {
  const currentClass = classes.value.find((c) => c.id === selectedClassId.value);
  return currentClass ? currentClass.students : [];
});

// 监听班级选择的变化
watch(selectedClassId, (newClassId) => {
  reloadClassData(newClassId);
});

// 重新加载班级数据
const reloadClassData = (classId: string) => {
  const currentClass = classes.value.find((c) => c.id === classId);
  if (currentClass) {
    tableData.value = currentClass.students;
    updateCharts();
    // generateAIAnalysis();
  } else {
    tableData.value = [];
    questions.value = [];
    showAIAnalysis.value = false;
  }
};

// 初始化时加载默认班级的数据
onMounted(() => {
  reloadClassData(selectedClassId.value);
});
</script>

<style scoped lang="scss">
.analysis-container {
  .mb-4 {
    margin-bottom: 1rem;
  }

  .mt-4 {
    margin-top: 1rem;
  }

  .upload-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .upload-area {
      text-align: center;
      padding: 20px;

      .upload-tip {
        color: #909399;
        font-size: 14px;
        margin-top: 10px;
      }
    }
  }

  .student-list-card {
    .student-list {
      .student-item {
        display: flex;
        align-items: center;
        padding: 8px;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.3s;

        &:hover {
          background-color: #f5f7fa;
        }

        .student-name {
          margin-left: 12px;
          flex: 1;
        }
      }
    }
  }

  .stat-row {
    margin-bottom: 20px;

    .stat-card {
      .stat-item {
        display: flex;
        align-items: center;
        padding: 20px;

        .stat-icon {
          font-size: 48px;
          color: #1890ff;
          margin-right: 20px;
        }

        .stat-info {
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #1890ff;
          }

          .stat-label {
            color: #666;
            margin-top: 5px;
          }
        }
      }
    }
  }

  .chart-row {
    margin-bottom: 20px;

    .chart-card {
      height: 100%;
    }
  }

  .student-info-card {
    .student-profile {
      text-align: center;
      padding: 20px;

      h3 {
        margin: 12px 0 4px;
        color: #1f2937;
      }

      p {
        color: #6b7280;
        margin: 0 0 16px;
      }

      .student-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-top: 20px;

        .stat-item {
          text-align: center;
          padding: 8px;
          background: #f8fafc;
          border-radius: 8px;

          .label {
            color: #6b7280;
            font-size: 12px;
          }

          .value {
            color: #1890ff;
            font-size: 18px;
            font-weight: bold;
            margin-top: 4px;
          }
        }
      }
    }
  }

  .analysis-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      color: #4b5563;

      .el-icon {
        margin-right: 8px;
      }

      .success-icon {
        color: #67c23a;
      }

      .warning-icon {
        color: #e6a23c;
      }
    }
  }

  .recommendation-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      color: #4b5563;

      .el-icon {
        color: #1890ff;
        margin-right: 8px;
      }
    }
  }
}
</style>