<script setup lang="ts">
import { ref } from '@vue/runtime-core'
import { useRouter } from 'vue-router'
import { Collection, User, UserFilled, Calendar } from '@element-plus/icons-vue';
import 'element-plus/es/components/icon/style/css';

interface CourseClass {
  id: string
  name: string
  grade: string
  subject: string
  students: number
  teacher: string
  createdAt: string
  bookname: string
}

const router = useRouter()
const dialogVisible = ref(false)
const courseClasses = ref<CourseClass[]>([
  {
    id: '1',
    name: '一年级一班',
    grade: '一年级',
    subject: '语文',
    students: 30,
    teacher: '张老师',
    createdAt: '2024-03-15',
    bookname: '人教版语文下册（24版）',
  },
  {
    id: '2',
    name: '二年级三班',
    grade: '二年级',
    subject: '数学',
    students: 25,
    teacher: '李老师',
    createdAt: '2024-03-14',
    bookname: '人教版数学下册（24版）',
  },
  {
    id: '3',
    name: '三年级一班',
    grade: '三年级',
    subject: '数学',
    students: 25,
    teacher: '王老师',
    createdAt: '2024-03-14',
    bookname: '人教版英语下册（24版）',
  },
  {
    id: '4',
    name: '四年级二班',
    grade: '四年级',
    subject: '科学',
    students: 25,
    teacher: '赵老师',
    createdAt: '2024-03-14',
    bookname: '人教版科学下册（24版）',
  }

])

const form = ref({
  name: '',
  grade: '',
  subject: '',
  students: 0,
  teacher: '',
  bookname: '',
})

const handleCardClick = (classId: string) => {
  router.push({
    path: '/dashboard',
    query: { classId }
  })
}

const handleCreateClass = () => {
  courseClasses.value.push({
    id: String(courseClasses.value.length + 1),
    ...form.value,
    createdAt: new Date().toISOString().split('T')[0]
  })
  dialogVisible.value = false
  form.value = {
    name: '',
    grade: '',
    subject: '',
    students: 0,
    teacher: '',
    bookname:'',
  }
}
</script>

<template>
  <div class="portal-container">
    <div class="portal-header">
      <h1>智慧备课平台</h1>
      <p>选择或创建课程班级开始备课</p>
    </div>

    <div class="class-grid">
      <!-- 新建课程班卡片 -->
      <div class="class-card add-card" @click="dialogVisible = true">
        <el-icon class="add-icon"><Plus /></el-icon>
        <p>新建课程班</p>
      </div>

      <!-- 现有课程班卡片 -->
      <div
        v-for="classItem in courseClasses"
        :key="classItem.id"
        class="class-card"
        @click="handleCardClick(classItem.id)"
      >
        <div class="card-header">
          <h3>{{ classItem.name }}</h3>
          <el-tag size="small">{{ classItem.subject }}</el-tag>
        </div>
        <div class="card-content">
          <p><el-icon><User /></el-icon> {{ classItem.teacher }}</p>
          <p><el-icon><UserFilled /></el-icon> {{ classItem.students }} 名学生</p>
          <p><el-icon><Calendar /></el-icon> 创建于 {{ classItem.createdAt }}</p>
          <p><el-icon><Collection /></el-icon> {{ classItem.bookname }}</p>
        </div>
      </div>
    </div>

    <!-- 新建课程班对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="新建课程班"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="班级名称">
          <el-input v-model="form.name" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="form.grade" placeholder="选择年级">
            <el-option label="一年级" value="一年级" />
            <el-option label="二年级" value="二年级" />
            <el-option label="三年级" value="三年级" />
            <el-option label="四年级" value="四年级" />
          </el-select>
        </el-form-item>
        <el-form-item label="科目">
          <el-select v-model="form.subject" placeholder="选择科目">
            <el-option label="语文" value="语文" />
            <el-option label="数学" value="数学" />
            <el-option label="英语" value="英语" />
            <el-option label="科学" value="科学" />
          </el-select>
        </el-form-item>
        <el-form-item label="学生人数">
          <el-input-number v-model="form.students" :min="1" />
        </el-form-item>
        <el-form-item label="任课教师">
          <el-input v-model="form.teacher" placeholder="请输入教师姓名" />
        </el-form-item>
        <el-form-item label="教材名称">
          <el-input v-model="form.bookname" placeholder="请输入教材名称如：人教版语文下册（24年版）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCreateClass">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.portal-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .portal-header {
    text-align: center;
    margin-bottom: 3rem;
    
    h1 {
      font-size: 2.5rem;
      color: #1890ff;
      margin: 0;
      background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      color: #666;
      font-size: 1.1rem;
      margin-top: 0.5rem;
    }
  }

  .class-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    padding: 1rem;
  }

  .class-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid #eee;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    &.add-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f8fafc;
      border: 2px dashed #e2e8f0;
      min-height: 200px;

      .add-icon {
        font-size: 2rem;
        color: #94a3b8;
        margin-bottom: 1rem;
      }

      p {
        color: #64748b;
        font-size: 1rem;
      }

      &:hover {
        background: #f1f5f9;
        border-color: #cbd5e1;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      h3 {
        margin: 0;
        font-size: 1.25rem;
        color: #1f2937;
      }
    }

    .card-content {
      p {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0.5rem 0;
        color: #64748b;

        .el-icon {
          color: #94a3b8;
        }
      }
    }
  }
}
</style>