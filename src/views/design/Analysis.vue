<template>
  <div class="analysis-container">
    <el-row class="main-row" :gutter="10">
      <!-- 左侧部分 -->
      <el-col :span="18">
        <el-card class="upload-card">
          <template #header>
            <div class="card-header">选择班级</div>
          </template>
          <el-select v-model="selectedClassId" placeholder="选择班级" class="class-select">
            <el-option
              v-for="class_ in classes"
              :key="class_.id"
              :label="class_.name"
              :value="class_.id"
            />
          </el-select>
        </el-card>

        <el-card class="add-question-card">
          <template #header>
            <div class="card-header">设置题目数量</div>
          </template>
          <el-input-number
            v-model="newQuestionCount"
            :min="1"
            :max="10"
            style="width: 100%;"
            @change="updateQuestionCount"
          />
        </el-card>

        <!-- 动态学生成绩输入 -->
        <el-card class="add-student-card">
          <template #header>
            <div class="card-header">添加学生成绩</div>
          </template>
          <div>
            <el-input v-model="newStudentName" placeholder="请输入学生姓名" class="input-field" />
            <el-row :gutter="8">
              <el-col v-for="(score, index) in newQuestionCount" :key="index" :span="6">
                <el-input-number
                  v-model="newStudentScores[index]"
                  :min="0"
                  :max="100"
                  :step="1"
                  style="width: 100%;"
                  :placeholder="'题目' + (index + 1)"
                />
              </el-col>
            </el-row>
            <el-button type="primary" class="add-btn" @click="addStudent">添加成绩</el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧部分 - 成绩明细 -->
      <el-col :span="6">
        <el-card class="table-card">
          <template #header>
            <div class="card-header">成绩明细</div>
          </template>
          <el-table :data="tableData" style="width: 100%" max-height="400">
            <el-table-column label="姓名" width="160">
              <template #default="{ row }">
                <div class="student-name-with-avatar">
                  <el-avatar
                    :size="40"
                    src="https://cube.elemecdn.com/0/88/03b0d3956334df583a3b41686ae9f4d.png"
                    class="student-avatar"
                  />
                  <span class="student-name">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button type="text" @click="viewStudentDetails(row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 学生详情对话框 -->
    <el-dialog
      v-model="showStudentDetails"
      title="学生详情"
      width="50%"
      :before-close="handleClose"
    >
      <div v-if="selectedStudent" class="student-details-container">
        <div class="student-info">
          <el-avatar
            :size="80"
            src="https://cube.elemecdn.com/0/88/03b0d3956334df583a3b41686ae9f4d.png"
            class="student-avatar"
          />
          <div class="info-text">
            <p><strong>姓名：</strong>{{ selectedStudent.name }}</p>
            <p><strong>班级：</strong>{{ selectedStudent.class }}</p>
            <p><strong>总分：</strong>{{ selectedStudent.total }}</p>
            <p><strong>平均分：</strong>{{ selectedStudent.average.toFixed(2) }}</p>
          </div>
        </div>

        <!-- 成绩明细表格 -->
        <h3>成绩明细</h3>
        <el-table :data="selectedStudent.scores" style="width: 100%">
          <el-table-column label="题目" prop="index" width="80">
            <template #default="{ row, $index }">
              题目{{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="得分" prop="score" width="80">
            <template #default="{ row }">
              {{ row }}
            </template>
          </el-table-column>
        </el-table>

        <!-- AI 总体学情分析 -->
        <div class="ai-analysis-content">
          <div class="analysis-section">
            <h4>AI 总体学情分析</h4>
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
            <ul>
              <li v-for="(rec, index) in aiAnalysisResult.recommendations" :key="index">
                {{ rec }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 成绩分布与题目得分分析 -->
    <el-row :gutter="10" class="chart-row">
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

    <!-- AI 班级整体分析 -->
    <el-card class="ai-class-analysis-card">
      <template #header>
        <div class="card-header">
          <span>AI 班级整体分析</span>
          <el-tag type="success">班级智能分析报告</el-tag>
        </div>
      </template>
      <div v-loading="isAnalyzing" class="ai-analysis-content">
        <div class="analysis-section">
          <h4>班级整体分析</h4>
          <p>{{ classAnalysisResult.overallAnalysis }}</p>
        </div>
        <div class="analysis-section">
          <h4>关键发现</h4>
          <ul>
            <li v-for="(point, index) in classAnalysisResult.keyPoints" :key="index">
              {{ point }}
            </li>
          </ul>
        </div>
        <div class="analysis-section">
          <h4>教学建议</h4>
          <ul>
            <li v-for="(rec, index) in classAnalysisResult.recommendations" :key="index">
              {{ rec }}
            </li>
          </ul>
        </div>
      </div>
    </el-card>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import * as echarts from 'echarts';

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

interface AIAanalysisResult {
  overallAnalysis: string;
  keyPoints: string[];
  recommendations: string[];
}

const performanceChartRef = ref<HTMLElement>();
const questionAnalysisChartRef = ref<HTMLElement>();
const studentPerformanceChartRef = ref<HTMLElement | null>(null);
const tableData = ref<Student[]>([]);
const selectedClassId = ref('1-1');
const aiAnalysisResult = ref<AIAanalysisResult>({
  overallAnalysis: '',
  keyPoints: [],
  recommendations: []
});
const classAnalysisResult = ref<AIAanalysisResult>({
  overallAnalysis: '',
  keyPoints: [],
  recommendations: []
});
const isAnalyzing = ref(false);

// 静态班级数据
const classes = ref<Class[]>([
  {
    id: '1-1',
    name: '一年级一班',
    grade: '一年级',
    students: [
      { id: '1', name: '张三', class: '一年级一班', scores: [85, 90, 78, 88], total: 341, average: 85.25, rank: 2 },
      { id: '2', name: '李四', class: '一年级一班', scores: [92, 88, 90, 85], total: 355, average: 88.75, rank: 1 },
      { id: '3', name: '王五', class: '一年级一班', scores: [78, 82, 80, 75], total: 315, average: 78.75, rank: 3 }
    ]
  },
  {
    id: '1-2',
    name: '一年级二班',
    grade: '一年级',
    students: [
      { id: '4', name: '赵六', class: '一年级二班', scores: [80, 85, 88, 82], total: 335, average: 83.75, rank: 1 },
      { id: '5', name: '钱七', class: '一年级二班', scores: [75, 78, 80, 72], total: 305, average: 76.25, rank: 2 }
    ]
  }
]);

// 静态题目数据（可以增加题目数量）
const questions = ref<Question[]>([
  { id: 1, correctRate: 0.85, averageScore: 80, maxScore: 100 },
  { id: 2, correctRate: 0.75, averageScore: 70, maxScore: 95 },
  { id: 3, correctRate: 0.90, averageScore: 90, maxScore: 100 },
  { id: 4, correctRate: 0.65, averageScore: 60, maxScore: 90 }
]);

// 动态调整题目数量
const newQuestionCount = ref(4); // 默认有4个题目
const updateQuestionCount = () => {
  questions.value = Array.from({ length: newQuestionCount.value }, (_, i) => ({
    id: i + 1,
    correctRate: 0.75,
    averageScore: 80,
    maxScore: 100
  }));

  // 根据新题目数量，更新学生的成绩
  tableData.value.forEach(student => {
    const currentScores = student.scores.slice(0, newQuestionCount.value); // 截取当前题目的成绩
    while (currentScores.length < newQuestionCount.value) {
      currentScores.push(0); // 默认新题目的成绩为0
    }
    student.scores = currentScores;
    student.total = student.scores.reduce((sum, score) => sum + score, 0);
    student.average = student.total / student.scores.length;
  });

  updateCharts(); // 更新图表
};

// 获取当前选中班级的学生列表
const currentClassStudents = computed(() => {
  const currentClass = classes.value.find(c => c.id === selectedClassId.value);
  return currentClass ? currentClass.students : [];
});

// 处理学生数据
const newStudentName = ref(''); // 新学生姓名
const newStudentScores = ref<number[]>([]); // 存储新学生的成绩

// 添加学生成绩
const addStudent = () => {
  if (newStudentName.value.trim() === '' || newStudentScores.value.length === 0) {
    alert('请填写学生姓名和成绩！');
    return;
  }

  const newStudent: Student = {
    id: (tableData.value.length + 1).toString(),
    name: newStudentName.value,
    class: selectedClassId.value,
    scores: newStudentScores.value,
    total: newStudentScores.value.reduce((sum, score) => sum + score, 0),
    average: newStudentScores.value.reduce((sum, score) => sum + score, 0) / newStudentScores.value.length,
    rank: tableData.value.length + 1
  };

  tableData.value.push(newStudent);
  newStudentName.value = '';
  newStudentScores.value = []; // 清空成绩输入
  updateCharts(); // 更新图表
};

// 是否显示学生详情对话框
const showStudentDetails = ref(false);

// 当前选中的学生
const selectedStudent = ref<Student | null>(null);

// 查看学生详情
const viewStudentDetails = (student: Student) => {
  selectedStudent.value = student;
  showStudentDetails.value = true;
  generateAIAnalysis(student);
};

// 生成 AI 分析结果
const generateAIAnalysis = (student: Student) => {
  isAnalyzing.value = true;
  setTimeout(() => {
    const { average, scores } = student;
    const overallAnalysis = `
      该学生在本次考试中的整体表现较为${average >= 80 ? '出色' : '一般'}。平均分为${average.toFixed(2)}分，显示出在知识掌握和应用能力上的${average >= 80 ? '较强水平' : '一定差距'}。
      在所有题目中，最高分为${Math.max(...scores)}分，最低分为${Math.min(...scores)}分，反映出学生在不同知识点上的掌握程度存在明显差异。
    `;
    const keyPoints = [
      `最高分：${Math.max(...scores)}分，最低分：${Math.min(...scores)}分`,
      `平均分：${average.toFixed(2)}分，排名：${student.rank}`,
      `学生在第${scores.indexOf(Math.min(...scores)) + 1}题得分最低，可能需要重点关注该知识点的学习和巩固。`
    ];
    const recommendations = [
      average < 60 ? '建议加强基础知识学习，尤其是薄弱知识点的复习。' : '继续保持良好的学习状态，尝试更具挑战性的题目以进一步提升能力。',
      scores.some(score => score < 60) ? '针对薄弱科目进行专项练习，提高解题技巧和准确性。' : '尝试参加一些拓展学习活动，如竞赛或兴趣小组，以拓宽知识面和提升思维能力。',
      '建议定期进行自我评估，总结学习方法和经验，调整学习计划以更好地适应学习进度。'
    ];

    aiAnalysisResult.value = {
      overallAnalysis,
      keyPoints,
      recommendations
    };

    isAnalyzing.value = false;
  }, 1500); // 模拟异步分析过程
};

// 生成班级整体分析结果
const generateClassAnalysis = () => {
  isAnalyzing.value = true;
  setTimeout(() => {
    const classStudents = currentClassStudents.value;
    const totalScores = classStudents.map(student => student.total);
    const classAverage = totalScores.reduce((sum, total) => sum + total, 0) / classStudents.length;
    const passRate = totalScores.filter(total => total >= 60).length / classStudents.length * 100;

    const overallAnalysis = `
      本班级在本次考试中的整体表现较为${classAverage >= 80 ? '出色' : '一般'}。班级平均分为${classAverage.toFixed(2)}分，
      及格率为${passRate.toFixed(2)}%。从整体来看，班级在知识掌握和应用能力上表现${classAverage >= 80 ? '较强' : '有待提高'}。
    `;
    const keyPoints = [
      `班级平均分：${classAverage.toFixed(2)}分`,
      `及格率：${passRate.toFixed(2)}%`,
      `最高总分：${Math.max(...totalScores)}分，最低总分：${Math.min(...totalScores)}分`
    ];
    const recommendations = [
      classAverage < 60 ? '建议加强班级整体的基础知识教学，尤其是对低分学生的辅导。' : '继续保持良好的教学状态，鼓励学生挑战更高难度的题目。',
      passRate < 80 ? '针对及格率较低的情况，建议开展针对性的复习和辅导活动。' : '继续保持良好的教学效果，鼓励学生参与更多拓展学习活动。',
      '建议定期进行班级整体评估，总结教学方法和经验，调整教学计划以更好地适应班级学习进度。'
    ];

    classAnalysisResult.value = {
      overallAnalysis,
      keyPoints,
      recommendations
    };

    isAnalyzing.value = false;
  }, 1500); // 模拟异步分析过程
};

const handleClose = () => {
  showStudentDetails.value = false;
  selectedStudent.value = null;
};

// 更新图表
const updateCharts = () => {
  if (performanceChartRef.value && questionAnalysisChartRef.value) {
    const performanceChart = echarts.init(performanceChartRef.value);
    const questionAnalysisChart = echarts.init(questionAnalysisChartRef.value);

    // 成绩分布图
    const scoreRanges = ['90-100', '80-89', '70-79', '60-69', '60以下'];
    const scoreCounts = new Array(5).fill(0);

    tableData.value.forEach(student => {
      const average = student.average;
      if (average >= 90) scoreCounts[0]++;
      else if (average >= 80) scoreCounts[1]++;
      else if (average >= 70) scoreCounts[2]++;
      else if (average >= 60) scoreCounts[3]++;
      else scoreCounts[4]++;
    });

    performanceChart.setOption({
      title: {
        text: '成绩分布'
      },
      tooltip: {},
      xAxis: {
        data: scoreRanges
      },
      yAxis: {},
      series: [{
        name: '学生人数',
        type: 'bar',
        data: scoreCounts,
        itemStyle: {
          color: '#1890ff'
        }
      }]
    });

    // 题目得分分析
    const averageScoresPerQuestion = new Array(questions.value.length).fill(0);
    const maxScoresPerQuestion = new Array(questions.value.length).fill(0);
    const minScoresPerQuestion = new Array(questions.value.length).fill(100);

    tableData.value.forEach(student => {
      student.scores.forEach((score, index) => {
        averageScoresPerQuestion[index] += score;
        if (score > maxScoresPerQuestion[index]) {
          maxScoresPerQuestion[index] = score;
        }
        if (score < minScoresPerQuestion[index]) {
          minScoresPerQuestion[index] = score;
        }
      });
    });

    const totalStudents = tableData.value.length;
    averageScoresPerQuestion.forEach((score, index) => {
      averageScoresPerQuestion[index] = (score / totalStudents).toFixed(2);
    });

    questionAnalysisChart.setOption({
      title: {
        text: '题目得分分析'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['平均得分', '最高得分', '最低得分']
      },
      xAxis: {
        type: 'category',
        data: questions.value.map(q => `题目${q.id}`)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '平均得分',
          type: 'line',
          data: averageScoresPerQuestion,
          itemStyle: {
            color: '#1890ff'
          }
        },
        {
          name: '最高得分',
          type: 'line',
          data: maxScoresPerQuestion,
          itemStyle: {
            color: '#ff7f50'
          }
        },
        {
          name: '最低得分',
          type: 'line',
          data: minScoresPerQuestion,
          itemStyle: {
            color: '#ff4500'
          }
        }
      ]
    });
  }
};

// 页面加载时初始化表格数据
onMounted(() => {
  tableData.value = currentClassStudents.value;
  updateCharts();
  generateClassAnalysis(); // 生成班级整体分析
});

// 监听班级变化时更新表格数据
watch(selectedClassId, () => {
  tableData.value = currentClassStudents.value;
  updateCharts();
  generateClassAnalysis(); // 更新班级整体分析
});
</script>

<style scoped>
.analysis-container {
  padding: 20px;
  background-color: #f4f7fa;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-row {
  display: flex;
  gap: 10px;
}

.el-col {
  flex: 1;
}

.upload-card, .add-question-card, .add-student-card, .table-card, .ai-class-analysis-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-card {
  background-color: #fff;
  padding: 16px;
}

.el-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.class-select {
  width: 100%;
  margin-top: 8px;
}

.input-field {
  margin-bottom: 12px;
}

.add-btn {
  margin-top: 12px;
}

.table-card {
  padding: 12px;
}

.el-table th {
  background-color: #f7f8fa;
  color: #333;
  font-weight: 600;
}

.el-table .cell {
  padding: 10px;
  font-size: 14px;
}

.el-table-row:nth-child(odd) {
  background-color: #f9f9f9;
}

.student-name-with-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.student-avatar {
  border-radius: 50%;
}

.student-name {
  font-size: 14px;
  color: #333;
}

/* AI 分析结果样式 */
.ai-analysis-content {
  padding: 20px;
}

.analysis-section {
  margin-bottom: 20px;
}

.analysis-section h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.analysis-section p, .analysis-section ul {
  font-size: 14px;
  color: #555;
}

.analysis-section ul {
  list-style-type: disc;
  padding-left: 20px;
}

@media (max-width: 768px) {
  .main-row {
    flex-direction: column;
  }
  .el-col {
    width: 100%;
  }
}
</style>
