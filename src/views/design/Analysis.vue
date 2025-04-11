<template>
  <div class="analysis-container">
    <div class="plan-header">
      <h2> 学情分析 </h2>
      <p class="subtitle">准确分析学生情况，智能生成教学建议</p>
    </div>
    <!--班级选择和上传区域-->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="18">
        <el-card class="upload-card">
          <template #header>
            <div class="card-header">
              <div>选择班级</div>
              <el-select v-model="selectedClassId" @change="reloadClassData" style="width: 90%;">
                <el-option v-for="class_ in classes" :key="class_.id" :label="class_.grade" :value="class_.id" />
              </el-select>
            </div>
            <br>
            <div class="card-header">
              <div>选择试卷</div>
              <el-select v-model="selectedPaper" @change="reloadPaperData" style="width: 90%;">
                <el-option v-for="paper_ in papers" :key="paper_.paperid" :label="paper_.papername" :value="paper_.paperid" />
              </el-select>
            </div>
          </template>
          <div class="upload-area" v-if="selectedClassId">
            <div class="chart-container">
              <!-- 饼状图容器 -->
              <div ref="pieChartRef" class="chart-box"></div>
              <!-- 柱状图容器 -->
              <div ref="barChartRef" class="chart-box"></div>
            </div>
            <!-- <div class="upload-buttons">
              <input ref="uploadMdRef" type="file" accept=".md" style="display: none" @change="handleFileUpload" />
              <el-button type="primary" @click="uploadMdRef.click()">
                <el-icon><Upload /></el-icon>
                上传试卷
              </el-button>
              <input ref="uploadExcelRef" type="file" accept=".xlsx,.xls" style="display: none" @change="handleExcelUpload" />
              <el-button type="primary" @click="uploadExcelRef.click()">
                <el-icon><Upload /></el-icon>
                上传成绩单
              </el-button>
            </div>
            <p class="upload-tip">试卷支持.md格式。成绩单支持.xlsx或.xls格式（确保第一列为学生姓名，后续列为题目分数）</p> -->
          </div>
          <template v-if="selectedClassId">
      <!-- 图表分析 -->
      <el-row :gutter="18" class="chart-row">
        <el-col :span="12">
          <el-card class="chart-card">
            <div ref="performanceChartRef" style="height: 300px;"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card">
            <div ref="questionAnalysisChartRef" style="height: 300px;"></div>
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
          <el-table-column v-for="(_, index) in questions" :key="index" :prop="`scores[${index}]`"
            :label="`题目${index + 1}`" width="100" />
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
          <el-button type="primary" @click="generateAIAnalysis">
            <el-icon>
              <Connection />
            </el-icon>
            AI分析
          </el-button>
        </template>
        <div v-loading="isAnalyzing" class="ai-analysis-content">
          <div v-if="!(aiAnalysisResult.recommendations === ' ')">
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
              <div class="markdown-container">
                <div v-html="aiAnalysisResult.recommendations" class="markdown-content"></div>
              </div>
            </div>
          </div>
          <div v-else>
            暂无学情分析
          </div>
        </div>
      </el-card>
    </template>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="student-list-card">
          <!-- 班级学生 -->
          <div class="student-list">
            <el-card class="custom-scrollbar">
              <template #header>
                <div class="card-header">
                  <span>班级学生</span>
                </div>
              </template>
              <el-scrollbar class="custom-scrollbar" style="height: 600px;">
                <div class="student-list">
                  <div v-for="student in currentClassStudents" :key="student.id" class="student-item"
                    @click="viewStudentDetails(student)">
                    <el-avatar :size="32">{{ student.name.charAt(0) }}</el-avatar>
                    <span class="student-name">{{ student.name }}</span>
                    <el-button type="primary" link size="small">查看详情</el-button>
                  </div>
                </div>
              </el-scrollbar>
            </el-card>
          </div>
          <!-- 学生反馈框 -->
          <div class="student-feedback">
            <el-card class="feedback-card">
              <template #header>
                <div class="card-header">
                  <span>学生反馈</span>
                </div>
              </template>
              <el-scrollbar class="custom-scrollbar" style="height: 600px;">
                <div v-for="(feedback, index) in studentFeedbacks" :key="index" class="feedback-item">
                  <h4>{{ feedback.studentName }}</h4>
                  <p>{{ feedback.content }}</p>
                </div>
            </el-scrollbar>
            </el-card>
          </div>
        </el-card>
      </el-col>
    </el-row>
    

    <!-- 学生详情对话框 -->
    <el-dialog v-model="showStudentDetails" :title="`${selectedStudent?.name || ''} - 学生详情`" width="80%">
      <div v-loading="isAnalyzing_person">
        <el-row :gutter="20">
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
          <el-col :span="16">
            <el-card class="trend-card">
              <div ref="studentPerformanceChartRef" style="height: 300px;"></div>
            </el-card>
          </el-col>
        </el-row>
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
                  <el-icon class="success-icon">
                    <CircleCheckFilled />
                  </el-icon>
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
                  <el-icon class="warning-icon">
                    <Warning />
                  </el-icon>
                  {{ weakness }}
                </li>
              </ul>
            </el-card>
          </el-col>
        </el-row>
        <el-card class="mt-4">
          <template #header>
            <div class="card-header">
              <span>学习建议</span>
            </div>
          </template>
          <ul class="recommendation-list">
            <li v-for="(rec, index) in studentAnalysis.recommendations" :key="index">
              <el-icon><Star /></el-icon>
              {{ rec }}
            </li>
          </ul>
        </el-card>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from "@vue/runtime-core";
// import { ref, onMounted, watch, computed, nextTick } from "@vue/runtime-core";
import * as echarts from "echarts";
import * as XLSX from "xlsx";
import { chatConfig, handleSubmit_analysis, isPolling } from "@/components/api_compoents/api_handler.ts";
import { analysisService } from "@/services/storage/analysisResService";
import type { analysisRes } from "@/types/analysisRes";

import { parseMarkdown } from '../../utils/markdownUtils';


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
  aboveAverageCount: number;
  belowAverageCount: number;
}

interface Class {
  id: string;
  paper: Paper[];
  grade: string;
  students: Student[];
  questions: Question[];
}

interface Paper {
  paperid: string;
  papername: string;
  students: Student[];
  questions: Question[];
}

const performanceChartRef = ref<HTMLElement>();
const questionAnalysisChartRef = ref<HTMLElement>();
const studentPerformanceChartRef = ref<HTMLElement>();
const pieChartRef = ref(null);
const barChartRef = ref(null);

const tableData = ref<Student[]>([]);
const questions = ref<Question[]>([]);

const showAIAnalysis = ref(false);
const isAnalyzing = ref(false);
const isAnalyzing_person = ref(false);
const showStudentDetails = ref(false);
const selectedStudent = ref<Student | null>(null);
const selectedClassId = ref("1-1");
const selectedPaper = ref("1");

const papers = ref<Paper[]>([
  {
    paperid: "1",
    papername: "试卷一",
    students: [],
    questions: [],
  },
  {
    paperid: "2",
    papername: "试卷二",
    students: [],
    questions: [],
  },
  {
    paperid: "3",
    papername: "试卷三",
    students: [],
    questions: [],
  },
]);

const classes = ref<Class[]>([
  {
    id: "1-1",
    paper: [
      {
        paperid: "1",
        papername: "试卷一",
        students: [],
        questions: [],
      },
      {
        paperid: "2",
        papername: "试卷二",
        students: [],
        questions: [],
      },
      {
        paperid: "3",
        papername: "试卷三",
        students: [],
        questions: [],
      },
    ],
    grade: "一年级一班",
    students: [],
    questions: [],
  },
  {
    id: "2-3",
    paper: [
      {
        paperid: "1",
        papername: "试卷一",
        students: [],
        questions: [],
      },
      {
        paperid: "2",
        papername: "试卷二",
        students: [],
        questions: [],
      },
      {
        paperid: "3",
        papername: "试卷三",
        students: [],
        questions: [],
      },
    ],
    grade: "二年级三班",
    students: [],
    questions: [],
  },
  {
    id: "3-1",
    paper: [
      {
        paperid: "1",
        papername: "试卷一",
        students: [],
        questions: [],
      },
      {
        paperid: "2",
        papername: "试卷二",
        students: [],
        questions: [],
      },
      {
        paperid: "3",
        papername: "试卷三",
        students: [],
        questions: [],
      },
    ],
    grade: "三年级一班",
    students: [],
    questions: [],
  },
  {
    id: "4-2",
    paper: [
      {
        paperid: "1",
        papername: "试卷一",
        students: [],
        questions: [],
      },
      {
        paperid: "2",
        papername: "试卷二",
        students: [],
        questions: [],
      },
      {
        paperid: "3",
        papername: "试卷三",
        students: [],
        questions: [],
      },
    ],
    grade: "四年级二班",
    students: [],
    questions: [],
  },
]);

// 学生反馈内容
const studentFeedbacks = ref([
  {
    studentName: "高静怡",
    content: "老师讲课很清晰，但希望能在课堂上多一些互动环节，让我们更积极参与。",
  },
  {
    studentName: "李昊达",
    content: "希望老师能提供更多课外练习题，帮助我们巩固课堂知识。",
  },
  {
    studentName: "高子浩",
    content: "老师布置的作业量有点多，希望能适当减少，给我们更多时间复习。",
  },
  {
    studentName: "唐子睿",
    content: "老师上课很有耐心，但希望能在讲解难题时再多一些实例分析。",
  },
  {
    studentName: "钱行州",
    content: "希望老师能定期组织小组讨论，让我们在交流中学习。",
  },
  {
    studentName: "张杨",
    content: "老师的教学方法很好，但希望能在考试前多安排一些复习课。",
  },
  {
    studentName: "何思源",
    content: "希望老师能在课堂上多一些实际应用的案例，帮助我们理解抽象的概念。",
  },
  {
    studentName: "王路一",
    content: "老师的讲解速度有点快，希望能适当放慢，给我们更多时间消化知识点。",
  },
]);

const aiAnalysisResult = ref<{
  overallAnalysis: string;
  recommendations: string;
  keyPoints: string[];
}>({
  overallAnalysis: "",
  recommendations: " ",
  keyPoints: [],
});

const studentAnalysis = ref({
  strengths: [] as string[],
  weaknesses: [] as string[],
  trend: [] as { date: string; score: number }[],
  recommendations: [] as string[],
});

// 处理Excel文件上传
const processExcelData = (data: any[]) => {
  const questionCount = Object.keys(data[0]).length - 1; // 第一列是姓名，其余是题目分数

  // 获取当前班级
  const currentClass = classes.value.find((c) => c.id === selectedClassId.value);
  if (!currentClass) {
    return;
  }

  // 获取当前选中的试卷
  const currentPaper = currentClass.paper.find((p) => p.paperid === selectedPaper.value);
  if (!currentPaper) {
    return;
  }

  // 清空当前试卷的旧数据
  currentPaper.students = [];

  // 动态调整 questions 数组的长度
  if (currentPaper.questions.length !== questionCount) {
    currentPaper.questions = Array.from({ length: questionCount }, (_, i) => ({
      id: i + 1,
      correctRate: 0,
      averageScore: 0,
      maxScore: 0,
      aboveAverageCount: 0,
      belowAverageCount: 0,
    }));
  } else {
    // 重置现有 questions 数据
    currentPaper.questions.forEach(q => {
      q.correctRate = 0;
      q.averageScore = 0;
      q.maxScore = 0;
      q.aboveAverageCount = 0;
      q.belowAverageCount = 0;
    });
  }

  // 遍历 Excel 数据，填充新数据
  data.forEach((row, rowIndex) => {
    const scores = Array.from({ length: questionCount }, (_, i) =>
      Number(row[`题目${i + 1}`] || 0)
    );
    const total = scores.reduce((a, b) => a + b, 0);

    // 新增学生数据
    const newStudent: Student = {
      id: String(rowIndex + 1),
      name: row["姓名"],
      class: selectedClassId.value,
      scores,
      total,
      average: total / questionCount,
      rank: 0,
    };
    currentPaper.students.push(newStudent);
    currentClass.students.push(newStudent);

    // 更新当前试卷的题目数据
    scores.forEach((score, index) => {
      currentPaper.questions[index].maxScore = Math.max(currentPaper.questions[index].maxScore, score);
      currentPaper.questions[index].averageScore += score;
    });
  });

  // 重新计算当前试卷的题目平均得分
  currentPaper.questions.forEach((q) => {
    q.averageScore /= data.length;
    q.correctRate = (q.averageScore / q.maxScore) * 100; // 计算正确率

    // 统计高于和低于平均分的人数
    q.aboveAverageCount = currentPaper.students.filter(
      (student) => student.scores[q.id - 1] > q.averageScore
    ).length;
    q.belowAverageCount = currentPaper.students.filter(
      (student) => student.scores[q.id - 1] <= q.averageScore
    ).length;
  });

  // 重新计算学生排名（处理相同分数的排名）
  currentPaper.students.sort((a, b) => b.total - a.total);
  currentPaper.students.forEach((student, index) => {
    if (index === 0) {
      student.rank = 1;
    } else {
      if (currentPaper.students[index - 1].total === student.total) {
        student.rank = currentPaper.students[index - 1].rank;
      } else {
        student.rank = index + 1;
      }
    }
  });

  // 更新全局数据
  tableData.value = currentPaper.students;
  questions.value = currentPaper.questions;

  // 更新图表和分析
  updateCharts();
  //generateAIAnalysis();
};

// 在系统初始化时读取并处理Excel文件
onMounted(async () => {
  try {

    // 加载试卷一的数据
    const basePath = import.meta.env.MODE === 'production' 
      ? '' 
      : './';
    await nextTick();

    ///千万不要改这个路径！！！！！！ @Nanyian
    const response1 = await fetch(`./scores.xlsx`);
    if (!response1.ok) {
      throw new Error("Failed to fetch scores.xlsx");
    }
    const data1 = await response1.arrayBuffer();
    const workbook1 = XLSX.read(data1, { type: "array" });
    const firstSheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
    const jsonData1 = XLSX.utils.sheet_to_json(firstSheet1);

    // 处理试卷一的数据
    selectedPaper.value = "1"; // 切换到试卷一
    processExcelData(jsonData1);

    // 加载试卷二的数据
    const response2 = await fetch(`./scores2.xlsx`);
    if (!response2.ok) {
      throw new Error("Failed to fetch scores2.xlsx");
    }
    const data2 = await response2.arrayBuffer();
    const workbook2 = XLSX.read(data2, { type: "array" });
    const firstSheet2 = workbook2.Sheets[workbook2.SheetNames[0]];
    const jsonData2 = XLSX.utils.sheet_to_json(firstSheet2);

    // 处理试卷二的数据
    selectedPaper.value = "2"; // 切换到试卷二
    processExcelData(jsonData2);

    // 默认显示试卷一的数据
    selectedPaper.value = "1";
    reloadClassData(selectedClassId.value);
    updateCharts();
  } catch (error) {
    console.error("Error loading Excel files:", error);
  }
});

// 更新图表
const updateCharts = () => {
  const currentClass = classes.value.find((c) => c.id === selectedClassId.value);
  if (!currentClass) {
    return;
  }

  const currentPaper = currentClass.paper.find((p) => p.paperid === selectedPaper.value);
  if (!currentPaper) {
    return;
  }

  if (pieChartRef.value && barChartRef.value) {
    // 销毁旧实例
    const pieChart = echarts.getInstanceByDom(pieChartRef.value);
    const barChart = echarts.getInstanceByDom(barChartRef.value);

    if (pieChart) pieChart.dispose();
    if (barChart) barChart.dispose();

    // 初始化新实例
    const newPieChart = echarts.init(pieChartRef.value);
    const newBarChart = echarts.init(barChartRef.value);

    // 计算优秀学生、及格学生和不及格学生的数量
    let excellentStudents = 0; // 优秀学生（>=80分）
    let passStudents = 0; // 及格学生（60-79分）
    let failStudents = 0; // 不及格学生（<60分）

    currentPaper.students.forEach(student => {
      if (student.total >= 80) {
        excellentStudents++;
      } else if (student.total >= 60) {
        passStudents++;
      } else {
        failStudents++;
      }
    });

    // 饼状图数据
    const performanceData = [
      { value: excellentStudents, name: '优秀学生（>=80）' },
      { value: passStudents, name: '及格学生（60-79）' },
      { value: failStudents, name: '不及格学生（<60）' }
    ];

    // 饼状图配置
    newPieChart.setOption({
      title: { text: '学生成绩分布' },
      tooltip: { 
        trigger: 'item' ,
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: { orient: 'vertical', left : 'right' },
      series: [
        {
          name: '学生人数',
          type: 'pie',
          radius: '50%',
          data: performanceData,
          emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }
      ]
    });

    // 柱状图数据
    const questionData = currentPaper.questions.map(q => ({
      aboveAverage: q.aboveAverageCount,
      belowAverage: q.belowAverageCount
    }));

    // 柱状图配置
    newBarChart.setOption({
      title: { text: '题目得分情况' },
      tooltip: { trigger: 'axis' },
      legend: { data: ['高于平均分', '低于平均分'] },
      xAxis: { type: 'category', data: currentPaper.questions.map(q => `题目${q.id}`) },
      yAxis: { type: 'value' },
      series: [
        { name: '高于平均分', type: 'bar', data: questionData.map(q => q.aboveAverage) },
        { name: '低于平均分', type: 'bar', data: questionData.map(q => q.belowAverage) }
      ]
    });
  }

  if (performanceChartRef.value && questionAnalysisChartRef.value) {
    // 销毁旧实例
    const performanceChart = echarts.getInstanceByDom(performanceChartRef.value);
    const questionAnalysisChart = echarts.getInstanceByDom(questionAnalysisChartRef.value);

    if (performanceChart) performanceChart.dispose();
    if (questionAnalysisChart) questionAnalysisChart.dispose();

    // 初始化新实例
    const newPerformanceChart = echarts.init(performanceChartRef.value);
    const newQuestionAnalysisChart = echarts.init(questionAnalysisChartRef.value);

    // 更新题目得分分析图表
    newQuestionAnalysisChart.setOption({
      title: { text: "平均得分情况" },
      tooltip: { trigger: "axis" },
      legend: { data: ["平均得分"] },
      xAxis: {
        type: "category",
        data: currentPaper.questions.map((q) => `题目${q.id}`),
      },
      yAxis: { type: "value" },
      series: [
        {
          name: "平均得分",
          type: "line",
          data: currentPaper.questions.map((q) => q.averageScore.toFixed(2)),
        },
      ],
    });

    // 更新成绩分布图表
    const scoreRanges = ["90-100", "80-89", "70-79", "60-69", "60以下"];
    const scoreCounts = new Array(5).fill(0);

    currentPaper.students.forEach((student) => {
      const total = student.total;
      if (total >= 90) scoreCounts[0]++;
      else if (total >= 80) scoreCounts[1]++;
      else if (total >= 70) scoreCounts[2]++;
      else if (total >= 60) scoreCounts[3]++;
      else scoreCounts[4]++;
    });

    newPerformanceChart.setOption({
      title: { text: "学生成绩统计" },
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
  }
};

let stopPollingWatch: (() => void) | null = null;
let isUpdatingStep = ref(false); // 状态锁

//api------------------------------------------------------------->>

//api

const DataThisSession_als = ref<analysisRes | null>(null);  // 会话数据
const sessionId = ref("");

const static_input = ref(`
    # 小学语文测试模拟输入示例

    ## 试卷得分数据
    [四年级语文期中测试]
    1. 基础题-看拼音写词语 (10分) 得分：9
    2. 选择题-词语辨析 (8分) 得分：6
    3. 填空题-古诗默写 (12分) 得分：10
    4. 阅读题-短文理解 (20分) 得分：14
    5. 写作题-看图写话 (30分) 得分：22

    ## 附加信息
    - 班级规模：35人
    - 观察到的主要错误模式：
      - 65%错误集中在"近义词辨析"题型
      - 40%学生在阅读题"概括段落大意"失分
      - 高频混淆："的"、"地"、"得"的用法
      - 写作常见问题：标点使用不规范、段落衔接生硬

    ## 特殊需求
    请重点分析：
    1. 词语辨析能力提升方案
    2. 阅读概括能力的培养
    3. 写作基础技巧训练
    4. 针对不同语文能力层级的分层建议
`);


// 生成AI分析
const generateAIAnalysis = async () => {

  // 计算题目正确率和平均分
  questions.value.forEach((q) => {
    q.correctRate = (q.averageScore / q.maxScore) * 100;
  });

  // 整体分析
  const totalStudents = tableData.value.length;
  const classAverageScore = questions.value.reduce((sum, q) => sum + q.averageScore, 0);
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


  // chatConfig.value.message = overallAnalysis;
  chatConfig.value.message = static_input.value;

  const result = await handleSubmit_analysis(sessionId.value, 6);

  console.log("await finished! ", result);
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
  isAnalyzing_person.value = true;

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
    recommendations: [],
  };

  studentAnalysis.value.recommendations = recommendations;

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

  isAnalyzing_person.value = false;
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
  console.log("currentClassStudents:", currentClass?.students);
  return currentClass ? currentClass.students : [];
});

// 监听班级选择的变化
watch(selectedClassId, (newClassId) => {
  reloadClassData(newClassId);
});

// 监听试卷选择的变化
watch(selectedPaper, (newPaperId) => {
  reloadPaperData(newPaperId);
});

// 重新加载班级数据
const reloadClassData = (classId: string) => {
  const currentClass = classes.value.find((c) => c.id === classId);
  if (currentClass) {
    // 默认加载第一个试卷的数据
    if (currentClass.paper.length > 0) {
      selectedPaper.value = currentClass.paper[0].paperid;
      reloadPaperData(selectedPaper.value);
    } else {
      tableData.value = [];
      questions.value = [];
      showAIAnalysis.value = false;
    }
  } else {
    tableData.value = [];
    questions.value = [];
    showAIAnalysis.value = false;
  }
};

// 重新加载试卷数据
const reloadPaperData = (paperId: string) => {
  const currentClass = classes.value.find((c) => c.id === selectedClassId.value);
  if (currentClass) {
    const currentPaper = currentClass.paper.find((p) => p.paperid === paperId);
    if (currentPaper) {
      tableData.value = currentPaper.students;
      questions.value = currentPaper.questions;
      updateCharts();
    } else {
      tableData.value = [];
      questions.value = [];
      showAIAnalysis.value = false;
    }
  }
};
</script>

<style scoped lang="scss">
.analysis-container {
  .mb-4 {
    display: flex;
    align-items: stretch;
  }

  .mt-4 {
    margin-top: 1rem;
  }

  .upload-card,
  .student-list-card {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
  }

  .chart-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .chart-box {
    width: 49%;
    height: 300px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 16px;
  }

  .upload-buttons {
    display: flex;
    flex-direction: center;
    gap: 10px;
    margin-top: 30px;
    margin-bottom: 10px;
  }

  .plan-header {
    background: linear-gradient(135deg, #27dbe8 0%, #d7f38b 100%);
    color: #fff;
    padding: 20px;
    margin-bottom: 1.5rem;
    border-radius: 8px;
  }

  .plan-header h2 {
    margin: 0;
    font-size: 1.75rem;
  }

  .subtitle {
    margin: 0.5rem 0 0;
    opacity: 0.9;
  }

  .upload-card {
    .card-header {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-items: center;
    }

    .upload-area {
      height: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;

      .upload-tip {
        color: #909399;
        font-size: 14px;
        margin-top: 10px;
      }
    }
  }

  .student-list-card {
    display: flex;
    flex-direction: column;
    height: 100%;

    .student-list {
      flex: 1;
      margin-bottom: 10px;

      .custom-scrollbar {
        height: 100%;
        padding: 10px;

        .el-scrollbar {
          height: 100%;
        }
      }

      .student-item {
        height: auto;
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

    .student-feedback {
      flex: 1;

      .feedback-card {
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;

        .custom-scrollbar {
          height: 100%;
          padding: 10px;

          .el-scrollbar {
            height: 100%;
          }
        }

        .feedback-item {
          padding: 15px;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          h4 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #333;
          }

          p {
            margin: 0;
            color: #666;
            line-height: 1.6;
          }
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