<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import * as XLSX from 'xlsx';

const performanceChartRef = ref<HTMLElement | null>(null);
const participationChartRef = ref<HTMLElement | null>(null);
const selectedClass = ref('1-1'); // 班级选择
const selectedSubject = ref<string>('语文'); // 默认选择语文科目
const scoreData = ref<Record<string, { name: string; score: number }[]>>({}); // 存储各科成绩数据，带有学生姓名和成绩
const participationData = ref<any>({}); // 存储参与度数据
const loading = ref(false); // 文件上传状态

// 新增学生输入框相关的变量
const newStudentName = ref<string>(''); // 学生姓名
const newStudentScore = ref<number>(0); // 学生成绩

// 控制成绩预览是否展开
const previewVisible = ref(false);

// 图表实例
let performanceChart: echarts.ECharts | null = null;
let participationChart: echarts.ECharts | null = null;

onMounted(() => {
  if (performanceChartRef.value && participationChartRef.value) {
    performanceChart = echarts.init(performanceChartRef.value);
    participationChart = echarts.init(participationChartRef.value);

    performanceChart.setOption({
      title: { text: '班级成绩分布' },
      tooltip: {},
      xAxis: { data: ['90-100', '80-89', '70-79', '60-69', '60以下'] },
      yAxis: {},
      series: [{
        name: '人数',
        type: 'bar',
        data: [],
        itemStyle: { color: '#1890ff' },
      }],
    });

    participationChart.setOption({
      title: { text: '课堂参与度分析' },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [{
        type: 'pie',
        radius: '50%',
        data: [],
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
        },
      }],
    });
  }
});

// 处理成绩数据并分类
const processScores = (scores: number[]) => {
  const categories = [0, 0, 0, 0, 0]; // 分类的计数器
  scores.forEach(score => {
    if (score >= 90) categories[0]++;
    else if (score >= 80) categories[1]++;
    else if (score >= 70) categories[2]++;
    else if (score >= 60) categories[3]++;
    else categories[4]++;
  });

  if (performanceChart) {
    performanceChart.setOption({ series: [{ data: categories }] });
  }
};

// 处理课堂参与度数据并生成饼图
const processParticipation = (participation: string[]) => {
  const participationCounts = { '积极参与': 0, '一般参与': 0, '较少参与': 0 };

  participation.forEach(part => {
    if (part === '积极参与') participationCounts['积极参与']++;
    else if (part === '一般参与') participationCounts['一般参与']++;
    else if (part === '较少参与') participationCounts['较少参与']++;
  });

  const data = [
    { value: participationCounts['积极参与'], name: '积极参与' },
    { value: participationCounts['一般参与'], name: '一般参与' },
    { value: participationCounts['较少参与'], name: '较少参与' },
  ];

  if (participationChart) {
    participationChart.setOption({ series: [{ data }] });
  }
};

// 计算班级整体分析
const calculateClassStats = (scores: number[]) => {
  const totalStudents = scores.length;
  const passingCount = scores.filter(score => score >= 60).length;
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / totalStudents;
  const passRate = (passingCount / totalStudents) * 100;
  return { totalStudents, averageScore, passRate };
};

// 读取Excel文件并提取数据
const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  loading.value = true; // 开始加载
  const reader = new FileReader();
  reader.onload = () => {
    const data = reader.result as ArrayBuffer;
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(firstSheet);

    // 提取各科成绩和参与度数据
    const subjects = ['语文', '数学', '英语']; // 假设科目为语文、数学、英语
    subjects.forEach(subject => {
      const subjectScores = json.map((row: any) => ({
        name: row['姓名'] || '',
        score: Number(row[subject]) || 0
      }));
      scoreData.value[subject] = subjectScores;
    });

    const participation = json.map((row: any) => row['参与度'] || '');
    participationData.value = participation;

    // 计算整体分析
    const scores = scoreData.value[selectedSubject.value].map(item => item.score);
    const { totalStudents, averageScore, passRate } = calculateClassStats(scores);

    // 更新整体分析展示
    console.log(`总人数: ${totalStudents}, 平均分: ${averageScore.toFixed(2)}, 及格率: ${passRate.toFixed(2)}%`);

    // 处理成绩分类并更新柱状图
    processScores(scores);

    // 处理课堂参与度并更新饼图
    processParticipation(participation);

    loading.value = false; // 加载结束
  };
  reader.readAsArrayBuffer(file);
};

// 选择科目切换时更新图表
watch(selectedSubject, () => {
  const scores = scoreData.value[selectedSubject.value]?.map(item => item.score) || [];
  processScores(scores);
});

// 上传前的验证方法
const handleBeforeUpload = (file: File) => {
  const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (!isXlsx) {
    alert('请上传 Excel 文件（.xlsx）');
  }
  return isXlsx;
};

// 获取选定科目的成绩数据
const scores = computed(() => scoreData.value[selectedSubject.value]?.map(item => item.score) || []);

// 增加学生成绩
const addStudentScore = (name: string, score: number) => {
  const newScore = { name, score };
  const subjectScores = scoreData.value[selectedSubject.value] || [];
  subjectScores.push(newScore);
  scoreData.value[selectedSubject.value] = subjectScores;
  processScores(subjectScores.map(item => item.score));
};

// 计算已添加学生成绩列表
const studentList = computed(() => scoreData.value[selectedSubject.value] || []);
</script>

<template>
  <div class="analysis-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <span>班级整体情况</span>
              <el-select v-model="selectedClass" placeholder="选择班级">
                <el-option label="一年级一班" value="1-1" />
                <el-option label="一年级二班" value="1-2" />
              </el-select>

              <!-- 科目选择 -->
              <el-select v-model="selectedSubject" placeholder="选择科目" class="subject-select">
                <el-option label="语文" value="语文" />
                <el-option label="数学" value="数学" />
                <el-option label="英语" value="英语" />
              </el-select>

              <!-- 文件上传按钮 -->
              <input type="file" @change="handleFileUpload" accept=".xlsx,.xls" />
            </div>
          </template>

          <el-row :gutter="20">
            <el-col :span="8">
              <div class="stat-box">
                <div class="stat-title">班级人数</div>
                <div class="stat-value">{{ scores.length }}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-box">
                <div class="stat-title">平均分</div>
                <div class="stat-value">{{ scores.length ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(2) : 0 }}</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-box">
                <div class="stat-title">及格率</div>
                <div class="stat-value">{{ scores.length ? ((scores.filter(score => score >= 60).length / scores.length) * 100).toFixed(2) : 0 }}%</div>
              </div>
            </el-col>
          </el-row>

          <!-- 添加学生成绩 -->
          <el-row :gutter="20" class="add-student-form">
            <el-col :span="24">
              <el-input placeholder="学生姓名" v-model="newStudentName" style="width: 200px;" />
              <el-input-number v-model="newStudentScore" placeholder="成绩" :min="0" :max="100" style="width: 150px;" />
              <el-button @click="addStudentScore(newStudentName, newStudentScore)">添加成绩</el-button>
            </el-col>
          </el-row>

          <!-- 查看成绩预览按钮 -->
          

          <!-- 学生成绩预览 -->
          <el-collapse v-model="previewVisible">
            <el-collapse-item title="学生成绩列表" name="1">
              <el-table :data="studentList" style="width: 100%">
                <el-table-column label="学生姓名" prop="name"></el-table-column>
                <el-table-column label="成绩" prop="score"></el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <div ref="performanceChartRef" style="height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <div ref="participationChartRef" style="height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.analysis-container {
  .subject-select {
    margin-left: 20px;
    width: 150px;
  }

  .upload-btn {
    margin-left: 20px;
  }

  .analysis-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-box {
      text-align: center;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 4px;

      .stat-title {
        color: #666;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #1890ff;
      }
    }
  }

  .chart-row {
    margin-top: 20px;
  }

  .chart-card {
    height: 100%;
  }

  .add-student-form {
    margin-top: 20px;
  }

  .student-preview {
    margin-top: 20px;
  }

  .el-collapse-item__header {
    font-size: 16px;
  }
}
</style>
