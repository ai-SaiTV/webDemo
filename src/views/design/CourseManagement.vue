<script setup lang="ts">
import { ref } from 'vue'

interface Course {
  id: string
  name: string
  grade: string
  subject: string
  schedule: string
  students: number
}

const courses = ref<Course[]>([
  {
    id: '1',
    name: '语文基础课程',
    grade: '一年级',
    subject: '语文',
    schedule: '周一 08:00-09:30',
    students: 30
  },
  {
    id: '2',
    name: '数学提高班',
    grade: '一年级',
    subject: '数学',
    schedule: '周二 10:00-11:30',
    students: 25
  }
])

const dialogVisible = ref(false)
const form = ref({
  name: '',
  grade: '',
  subject: '',
  schedule: '',
  students: 0
})

const handleAdd = () => {
  dialogVisible.value = true
}

const handleSubmit = () => {
  courses.value.push({
    id: String(courses.value.length + 1),
    ...form.value
  })
  dialogVisible.value = false
  form.value = {
    name: '',
    grade: '',
    subject: '',
    schedule: '',
    students: 0
  }
}
</script>

<template>
  <div class="course-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>课程管理</span>
          <el-button type="primary" @click="handleAdd">添加课程</el-button>
        </div>
      </template>

      <el-table :data="courses" style="width: 100%">
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="grade" label="年级" />
        <el-table-column prop="subject" label="科目" />
        <el-table-column prop="schedule" label="上课时间" />
        <el-table-column prop="students" label="学生人数" />
        <el-table-column label="操作" width="200">
          <template #default>
            <el-button type="primary" link>编辑</el-button>
            <el-button type="danger" link>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="添加课程"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="form.grade" placeholder="选择年级">
            <el-option label="一年级" value="一年级" />
            <el-option label="二年级" value="二年级" />
            <el-option label="三年级" value="三年级" />
          </el-select>
        </el-form-item>
        <el-form-item label="科目">
          <el-select v-model="form.subject" placeholder="选择科目">
            <el-option label="语文" value="语文" />
            <el-option label="数学" value="数学" />
            <el-option label="英语" value="英语" />
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
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.course-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.dialog-footer {
  margin-top: 20px;
}
</style>