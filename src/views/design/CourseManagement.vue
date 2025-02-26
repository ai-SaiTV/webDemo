<template>
  <div class="course-container">
    <div class="plan-header">
      <h2>课程管理</h2>
      <p class="subtitle">高效管理课程信息，提升教学安排效率</p>
    </div>

    <el-card class="main-card">
      <div class="filter-form">
        <el-form inline>
          <el-form-item label="年级">
            <el-select
              v-model="filters.grade"
              placeholder="全部"
              clearable
              style="width: 120px"
            >
              <el-option
                v-for="grade in uniqueGrades"
                :key="grade"
                :label="grade"
                :value="grade"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="科目">
            <el-select
              v-model="filters.subject"
              placeholder="全部"
              clearable
              style="width: 120px"
            >
              <el-option
                v-for="subject in uniqueSubjects"
                :key="subject"
                :label="subject"
                :value="subject"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="上课时间">
            <el-input v-model="filters.schedule" placeholder="输入时间" style="width: 180px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="resetFilters">显示全部</el-button>
            <el-button type="primary" @click="handleAdd">添加课程</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="filteredCourses" style="width: 100%">
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="grade" label="年级" />
        <el-table-column prop="subject" label="科目" />
        <el-table-column prop="schedule" label="上课时间" />
        <el-table-column prop="students" label="学生人数" />
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(scope.row.id)">删除</el-button>
            <el-button type="success" link @click="handlePreview(scope.row)">预览班级详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add/Edit Course Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑课程' : '添加课程'"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="form.grade" placeholder="选择年级" style="width: 120px">
            <el-option
              v-for="grade in allGrades"
              :key="grade"
              :label="grade"
              :value="grade"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="科目">
          <el-select v-model="form.subject" placeholder="选择科目" style="width: 120px">
            <el-option
              v-for="subject in allSubjects"
              :key="subject"
              :label="subject"
              :value="subject"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上课时间">
          <el-input v-model="form.schedule" />
        </el-form-item>
        <el-form-item label="学生人数">
          <el-input-number v-model="form.students" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            {{ isEditing ? '更新' : '确定' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 班级详情 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="📖 班级详情"
      width="600px"
      class="preview-dialog"
    >
      <el-card class="preview-card">
        <el-descriptions title="课程信息" border column="2">
          <el-descriptions-item label="📚 课程名称">
            <strong class="text-primary">{{ previewForm.name }}</strong>
          </el-descriptions-item>
          <el-descriptions-item label="🏫 年级">
            <span class="text-gray">{{ previewForm.grade }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="📖 科目">
            <span class="text-gray">{{ previewForm.subject }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="👨‍🎓 班级人数">
            <el-tag type="success">{{ previewForm.students }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="👨‍🏫 教师">
            <span class="text-gray">{{ previewForm.teacher || '未分配' }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="📄 生成教案次数">
            <el-tag type="warning">{{ previewForm.lessonPlanCount }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <template #footer>
        <el-button type="primary" @click="previewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

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
  teacher?: string; // New field for teacher name
  lessonPlanCount?: number; // New field for lesson plan generation count
}

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
    teacher: '李老师',
    lessonPlanCount: 3,
  },
  {
    id: '3',
    name: '英语语法训练',
    grade: '三年级',
    subject: '英语',
    schedule: '周三 15:00-16:30',
    students: 25,
    teacher: '王老师',
    lessonPlanCount: 3,
  },
  {
    id: '4',
    name: '科学兴趣班',
    grade: '四年级',
    subject: '科学',
    schedule: '周五 13:30-15:00',
    students: 25,
    teacher: '赵老师',
    lessonPlanCount: 5,
  },
  // Add other courses as needed...
]);

const uniqueGrades = computed(() => [...new Set(courses.value.map(course => course.grade))]);
const uniqueSubjects = computed(() => [...new Set(courses.value.map(course => course.subject))].sort());

const allGrades = ref(['一年级', '二年级', '三年级', '四年级']);
const allSubjects = ref(['语文', '数学', '英语', '科学', '艺术']);

const filters = ref({
  grade: '',
  subject: '',
  schedule: '',
});

const filteredCourses = computed(() =>
  courses.value.filter(course => {
    const gradeMatch = filters.value.grade ? course.grade.includes(filters.value.grade) : true;
    const subjectMatch = filters.value.subject ? course.subject.includes(filters.value.subject) : true;
    const scheduleMatch = filters.value.schedule ? course.schedule.includes(filters.value.schedule) : true;
    return gradeMatch && subjectMatch && scheduleMatch;
  })
);

const resetFilters = () => {
  filters.value = {
    grade: '',
    subject: '',
    schedule: '',
  };
};

const dialogVisible = ref(false);
const previewDialogVisible = ref(false); // New dialog for preview
const form = ref<Course>({
  id: '',
  name: '',
  grade: '',
  subject: '',
  schedule: '',
  students: 0,
});
const previewForm = ref<Course>({ ...form.value, teacher: '', lessonPlanCount: 0 }); // Preview form
const isEditing = ref(false);

const handleAdd = () => {
  dialogVisible.value = true;
  isEditing.value = false;
  form.value = {
    id: '',
    name: '',
    grade: '',
    subject: '',
    schedule: '',
    students: 0,
  };
};

const handleSubmit = () => {
  const newCourse: Course = {
    id: form.value.id || String(courses.value.length + 1),
    name: form.value.name,
    grade: form.value.grade,
    subject: form.value.subject,
    schedule: form.value.schedule,
    students: form.value.students,
    teacher: form.value.teacher, // Add teacher to new course
    lessonPlanCount: form.value.lessonPlanCount || 0, // Add lesson plan count
  };

  if (form.value.id) {
    const index = courses.value.findIndex(course => course.id === form.value.id);
    if (index !== -1) {
      courses.value[index] = newCourse;
    }
  } else {
    courses.value.push(newCourse);
  }

  dialogVisible.value = false;
  form.value = {
    id: '',
    name: '',
    grade: '',
    subject: '',
    schedule: '',
    students: 0,
  };
};

const handleEdit = (course: Course) => {
  dialogVisible.value = true;
  isEditing.value = true;
  form.value = { ...course };
};

const handleDelete = (id: string) => {
  const index = courses.value.findIndex(course => course.id === id);
  if (index !== -1) {
    courses.value.splice(index, 1);
  }
};

const handlePreview = (course: Course) => {
  previewForm.value = { ...course };
  previewDialogVisible.value = true;
};
</script>

<style scoped>
.course-container {
  .plan-header {
    text-align: center;
    background: linear-gradient(to right, #25ade7, #09e6ab);
    color: white;
    padding: 1rem 0;
    margin-bottom: 1.5rem;
    border-radius: 8px;
  }

  .subtitle {
    color: #ffffff;
    font-size: 1rem;
  }

  .main-card {
    padding: 1rem;
  }

  .dialog-footer {
    margin-top: 20px;
  }
}

.preview-dialog {
  border-radius: 10px;
}
.preview-card {
  background: #f9fafb;
  padding: 20px;
  border-radius: 10px;
}
.text-primary {
  color: #409eff;
  font-weight: bold;
}
.text-gray {
  color: #606266;
}

</style>