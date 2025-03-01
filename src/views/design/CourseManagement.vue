<template>
  <div class="course-container">
    <div class="plan-header">
      <h2>班级详情管理</h2>
      <p class="subtitle">通过筛选和选择班级查看详细信息</p>
    </div>

    <el-card class="main-card">
      <!-- 筛选表单 -->
      <div class="filter-form">
        <el-form inline>
          <el-form-item label="年级">
            <el-select v-model="filters.grade" placeholder="全部" clearable class="input-field">
              <el-option v-for="grade in uniqueGrades" :key="grade" :label="grade" :value="grade" />
            </el-select>
          </el-form-item>
          <el-form-item label="科目">
            <el-select v-model="filters.subject" placeholder="全部" clearable class="input-field">
              <el-option v-for="subject in uniqueSubjects" :key="subject" :label="subject" :value="subject" />
            </el-select>
          </el-form-item>
          <el-form-item label="上课时间">
            <el-input v-model="filters.schedule" placeholder="输入时间" class="input-field" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="resetFilters" class="reset-button">重置筛选</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 班级选择器 -->
      <div class="class-selector">
        <el-select v-model="selectedClassId" placeholder="请选择班级" @change="loadClassDetails" class="input-field">
          <el-option
            v-for="course in filteredCourses"
            :key="course.id"
            :label="`${course.grade} ${course.subject} - ${course.name}`"
            :value="course.id"
          />
        </el-select>
      </div>

      <!-- 动态显示班级详情 -->
      <div v-if="selectedClassDetails" class="class-details">
        <el-descriptions title="班级详情" border column="2">
          <el-descriptions-item label="课程名称">
            <strong class="text-primary">{{ selectedClassDetails.name }}</strong>
          </el-descriptions-item>
          <el-descriptions-item label="年级">
            <span class="text-gray">{{ selectedClassDetails.grade }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="科目">
            <span class="text-gray">{{ selectedClassDetails.subject }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="上课时间">
            <span class="text-gray">{{ selectedClassDetails.schedule }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="学生人数">
            <el-tag type="success">{{ selectedClassDetails.students }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="教师">
            <span class="text-gray">{{ selectedClassDetails.teacher || '未分配' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="教案生成次数">
            <el-tag type="warning">{{ selectedClassDetails.lessonPlanCount }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div v-else class="no-class-selected">
        <p>请选择一个班级以查看详细信息。</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from '@vue/runtime-core';

interface Course {
  id: string;
  name: string;
  grade: string;
  subject: string;
  schedule: string;
  students: number;
  teacher?: string; // 教师名称
  lessonPlanCount?: number; // 教案生成次数
}

// 示例课程数据
const courses = ref<Course[]>([
  {
    id: '1',
    name: '语文基础课程',
    grade: '一年级',
    subject: '语文',
    schedule: '周一 08:00-09:30',
    students: 30,
    teacher: '张老师',
    lessonPlanCount: 5,
  },
  {
    id: '2',
    name: '数学提高班',
    grade: '二年级',
    subject: '数学',
    schedule: '周二 10:00-11:30',
    students: 25,
    teacher: '张老师',
    lessonPlanCount: 3,
  },
  {
    id: '3',
    name: '英语语法训练',
    grade: '三年级',
    subject: '英语',
    schedule: '周三 15:00-16:30',
    students: 25,
    teacher: '张老师',
    lessonPlanCount: 3,
  },
  {
    id: '4',
    name: '科学兴趣班',
    grade: '四年级',
    subject: '科学',
    schedule: '周五 13:30-15:00',
    students: 25,
    teacher: '张老师',
    lessonPlanCount: 5,
  },
]);

// 筛选条件
const filters = ref({
  grade: '',
  subject: '',
  schedule: '',
});

// 筛选后的课程列表
const filteredCourses = computed(() =>
  courses.value.filter(course => {
    const gradeMatch = !filters.value.grade || course.grade.includes(filters.value.grade);
    const subjectMatch = !filters.value.subject || course.subject.includes(filters.value.subject);
    const scheduleMatch = !filters.value.schedule || course.schedule.includes(filters.value.schedule);
    return gradeMatch && subjectMatch && scheduleMatch;
  })
);

// 筛选条件的唯一值
const uniqueGrades = computed(() => [...new Set(courses.value.map(course => course.grade))]);
const uniqueSubjects = computed(() => [...new Set(courses.value.map(course => course.subject))]);

// 重置筛选条件
const resetFilters = () => {
  filters.value = {
    grade: '',
    subject: '',
    schedule: '',
  };
};

// 当前选中的班级 ID
const selectedClassId = ref<string | null>(null);

// 当前选中的班级详情
const selectedClassDetails = computed(() => {
  if (!selectedClassId.value) return null;
  return filteredCourses.value.find(course => course.id === selectedClassId.value) || null;
});

// 加载班级详情
const loadClassDetails = () => {
  // 如果需要额外的逻辑处理，可以在这里实现
};
</script>

<style scoped>
.course-container {
  .plan-header {
    background: linear-gradient(to right, #25ade7, #09e6ab);
    color: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 1.5rem;
  }

  .plan-header h2 {
    margin: 0;
    font-size: 1.75rem;
  }

  .subtitle {
    margin: 0.5rem 0 0;
    opacity: 0.9;
  }

  .main-card {
    padding: 1rem;
  }

  .filter-form {
    margin-bottom: 20px;
    display: flex;
    gap: 16px;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .input-field {
    width: 300px;
  }

  .reset-button {
    align-self: center;
  }

  .class-selector {
    margin-bottom: 20px;
  }

  .no-class-selected {
    text-align: center;
    color: #606266;
    font-size: 1rem;
  }

  .text-primary {
    color: #409eff;
    font-weight: bold;
  }

  .text-gray {
    color: #606266;
  }

  .el-button:hover {
    background-color: #55c7c1;
  }
}
</style>
