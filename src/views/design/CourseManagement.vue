<template>
  <div class="course-container">
    <div class="plan-header">
      <h2>课程管理</h2>
      <p class="subtitle">查看班级进度、教学内容和记录教学情况</p>
    </div>

    <el-card class="main-card">
      <!-- 班级选择器 -->
      <div class="class-selector">
        <el-select v-model="selectedClassId" @change="loadClassDetails" class="input-field">
          <el-option
            v-for="course in courses"
            :key="course.id"
            :label="`${course.grade} ${course.subject} - ${course.name}`"
            :value="course.id"
          />
        </el-select>
      </div>

      <!-- 动态显示班级详情 -->
      <div v-if="selectedClassDetails" class="class-details">
        <h3>课程详情</h3>
        <el-card class="details-card">
          <el-table :data="[selectedClassDetails]" :bordered="true">
            <el-table-column label="课程名称" prop="name" />
            <el-table-column label="年级" prop="grade" />
            <el-table-column label="科目" prop="subject" />
            <el-table-column label="上课时间" prop="schedule" />
            <el-table-column label="学生人数" prop="students" />
            <el-table-column label="教案生成次数" prop="lessonPlanCount" />
          </el-table>
        </el-card>

        <!-- 课程进度 -->
        <div class="lesson-progress">
          <h3>课程进度</h3>
          <el-card class="lesson-card">
            <el-table :data="selectedClassDetails.lessons" :bordered="true">
              <el-table-column label="课程标题" prop="title" />
              <el-table-column label="上课状态" prop="status" />
              <el-table-column label="上课日期" prop="date" />
              <el-table-column label="课程描述" prop="description" />
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button type="text" @click="editLesson(scope.row)" title="编辑课程">编辑</el-button>
                  <el-button type="text" @click="deleteLesson(scope.row)" title="删除课程">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" @click="showAddLessonDialog = true">新增课程进度</el-button>
          </el-card>
        </div>

        <!-- 教学记录 -->
        <div class="teacher-notes">
          <h3>教学记录</h3>
          <el-card class="note-card">
            <el-table :data="selectedClassDetails.notes" :bordered="true">
              <el-table-column label="教学总结" prop="content" />
              <el-table-column label="记录日期" prop="date" />
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button type="text" @click="editNote(scope.row)" title="编辑课程">编辑</el-button>
                  <el-button type="text" @click="deleteNote(scope.row)" title="删除课程">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" @click="showAddNoteDialog = true">新增教学记录</el-button>
          </el-card>
        </div>
      </div>

      <div v-else class="no-class-selected">
        <p>请选择一个班级以查看详细信息。</p>
      </div>
    </el-card>

    <!-- 新增课程进度对话框 -->
    <el-dialog v-model="showAddLessonDialog" title="新增课程进度">
      <el-form :model="newLesson">
        <el-form-item label="课程标题">
          <el-input v-model="newLesson.title" />
        </el-form-item>
        <el-form-item label="上课状态">
          <el-select v-model="newLesson.status">
            <el-option label="已完成" value="已完成" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已准备" value="已准备" />
          </el-select>
        </el-form-item>
        <el-form-item label="上课日期">
          <el-date-picker v-model="newLesson.date" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="课程描述">
          <el-input v-model="newLesson.description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddLessonDialog = false">取消</el-button>
        <el-button type="primary" @click="addLesson">确定</el-button>
      </template>
    </el-dialog>

    <!-- 新增教学记录对话框 -->
    <el-dialog v-model="showAddNoteDialog" title="新增教学记录">
      <el-form :model="newNote">
        <el-form-item label="记录内容">
          <el-input v-model="newNote.content" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddNoteDialog = false">取消</el-button>
        <el-button type="primary" @click="addNote">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑课程进度对话框 -->
    <el-dialog v-model="showEditLessonDialog" title="编辑课程进度">
      <el-form :model="editLessonForm">
        <el-form-item label="课程标题">
          <el-input v-model="editLessonForm.title" />
        </el-form-item>
        <el-form-item label="上课状态">
          <el-select v-model="editLessonForm.status">
            <el-option label="已完成" value="已完成" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已准备" value="已准备" />
          </el-select>
        </el-form-item>
        <el-form-item label="上课日期">
          <el-date-picker v-model="editLessonForm.date" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="课程描述">
          <el-input v-model="editLessonForm.description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditLessonDialog = false">取消</el-button>
        <el-button type="primary" @click="saveEditLesson">确定</el-button>
      </template>
    </el-dialog>

    <!-- 编辑教学记录对话框 -->
    <el-dialog v-model="showEditNoteDialog" title="编辑教学记录">
      <el-form :model="editNoteForm">
        <el-form-item label="记录内容">
          <el-input v-model="editNoteForm.content" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditNoteDialog = false">取消</el-button>
        <el-button type="primary" @click="saveEditNote">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// import { ref, computed } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";

interface Lesson {
  title: string;
  status: "已完成" | "进行中" | "已准备";
  date: string;
  description: string;
}

interface Note {
  date: string;
  content: string;
}

interface Course {
  id: string;
  name: string;
  grade: string;
  subject: string;
  schedule: string;
  students: number;
  teacher?: string;
  lessonPlanCount?: number;
  lessons: Lesson[];
  notes: Note[];
}

const courses = ref<Course[]>([
  {
    id: "1",
    name: "语文基础课程",
    grade: "一年级",
    subject: "语文",
    schedule: "周一 08:00-09:30",
    students: 30,
    teacher: "张老师",
    lessonPlanCount: 5,
    lessons: [
      {
        title: "第一章：认识汉字",
        status: "已完成",
        date: "2025/2/20",
        description: "学习并掌握汉字的读音和书写。",
      },
      {
        title: "第二章：基础语法",
        status: "进行中",
        date: "2025/2/25",
        description: "学习汉字基础语法结构。",
      },
      {
        title: "第三章：口语表达",
        status: "已准备",
        date: "2025/3/1",
        description: "进行口语练习，提升语文口语能力。",
      },
    ],
    notes: [
      { date: "2025/2/20", content: "今天讲解了字母的发音，学生反应积极。" },
      { date: "2025/2/25", content: "进行了基础语法练习，部分学生掌握较好。" },
    ],
  },
  {
    id: "2",
    name: "数学提高班",
    grade: "二年级",
    subject: "数学",
    schedule: "周二 10:00-11:30",
    students: 25,
    teacher: "张老师",
    lessonPlanCount: 3,
    lessons: [
      {
        title: "数学挑战赛",
        status: "已准备",
        date: "2025/6/12",
        description: "进行数学思维挑战，激发学生兴趣。",
      },
    ],
    notes: [
      { date: "2025/2/26", content: "学生参与度较高，下一步计划进行更多思维训练。" },
    ],
  },
  {
    id: "3",
    name: "英语语法训练",
    grade: "三年级",
    subject: "英语",
    schedule: "周三 15:00-16:30",
    students: 25,
    teacher: "张老师",
    lessonPlanCount: 6,
    lessons: [
      {
        title: "第一章：名词和代词",
        status: "已完成",
        date: "2025/2/27",
        description: "学习名词的分类和代词的使用。",
      },
      {
        title: "第二章：动词的时态",
        status: "进行中",
        date: "2025/3/4",
        description: "讲解一般现在时、一般过去时和一般将来时。",
      },
      {
        title: "第三章：形容词和副词",
        status: "已准备",
        date: "2025/3/11",
        description: "学习形容词和副词的用法及比较级和最高级。",
      },
    ],
    notes: [
      { date: "2025/2/27", content: "学生对名词和代词的区分理解较好。" },
      { date: "2025/3/4", content: "动词时态讲解后，部分学生需要额外练习。" },
    ],
  },
  {
    id: "4",
    name: "科学兴趣班",
    grade: "四年级",
    subject: "科学",
    schedule: "周五 14:00-15:30",
    students: 25,
    teacher: "张老师",
    lessonPlanCount: 4,
    lessons: [
      {
        title: "实验一：水的三态变化",
        status: "已完成",
        date: "2025/2/22",
        description: "通过实验观察水的固态、液态和气态变化。",
      },
      {
        title: "实验二：植物的生长过程",
        status: "进行中",
        date: "2025/3/5",
        description: "观察并记录植物从种子到幼苗的生长过程。",
      },
      {
        title: "实验三：简单电路的搭建",
        status: "已准备",
        date: "2025/3/10",
        description: "学习电路基础知识，搭建简单的串联和并联电路。",
      },
    ],
    notes: [
      { date: "2025/2/22", content: "学生对水的三态变化实验表现出浓厚兴趣。" },
      { date: "2025/3/5", content: "部分学生记录植物生长过程时需要更多指导。" },
    ],
  },
]);

const selectedClassId = ref("1");
const selectedClassDetails = computed(() => {
  if (!selectedClassId.value) return null;
  return courses.value.find((course) => course.id === selectedClassId.value) || null;
});

// 新增课程进度
const showAddLessonDialog = ref(false);
const newLesson = ref<Lesson>({
  title: "",
  status: "已完成",
  date: new Date().toLocaleDateString(),
  description: "",
});

const addLesson = () => {
  if (selectedClassDetails.value && newLesson.value.title) {
    selectedClassDetails.value.lessons.push({ ...newLesson.value });
    newLesson.value = {
      title: "",
      status: "已完成",
      date: new Date().toLocaleDateString(),
      description: "",
    };
    showAddLessonDialog.value = false;
    ElMessage.success("课程进度新增成功！");
  } else {
    ElMessage.error("请填写完整的课程信息！");
  }
};

// 编辑课程进度
const showEditLessonDialog = ref(false);
const editLessonForm = ref<Lesson>({
  title: "",
  status: "已完成",
  date: new Date().toLocaleDateString(),
  description: "",
});
const currentEditLesson = ref<Lesson | null>(null);

const editLesson = (lesson: Lesson) => {
  editLessonForm.value = { ...lesson };
  currentEditLesson.value = lesson;
  showEditLessonDialog.value = true;
};

const saveEditLesson = () => {
  if (currentEditLesson.value && editLessonForm.value.title) {
    currentEditLesson.value.title = editLessonForm.value.title;
    currentEditLesson.value.status = editLessonForm.value.status;
    currentEditLesson.value.date = new Date(editLessonForm.value.date).toLocaleDateString();
    currentEditLesson.value.description = editLessonForm.value.description;
    currentEditLesson.value.date = new Date().toLocaleDateString(); // 更新课程日期为当前时间
    showEditLessonDialog.value = false;
    ElMessage.success("课程进度编辑成功！");
  } else {
    ElMessage.error("请填写完整的课程信息！");
  }
};

// 删除课程进度
const deleteLesson = (lesson: Lesson) => {
  ElMessageBox.confirm("确定要删除该课程进度吗？", "提示", {
    type: "warning",
  }).then(() => {
    if (selectedClassDetails.value) {
      const index = selectedClassDetails.value.lessons.indexOf(lesson);
      if (index !== -1) {
        selectedClassDetails.value.lessons.splice(index, 1);
        ElMessage.success("课程进度删除成功！");
      }
    }
  });
};

// 新增教学记录
const showAddNoteDialog = ref(false);
const newNote = ref<Note>({
  date: new Date().toLocaleDateString(),
  content: "",
});

const addNote = () => {
  if (selectedClassDetails.value && newNote.value.content) {
    selectedClassDetails.value.notes.push({ ...newNote.value });
    newNote.value = {
      date: new Date().toLocaleDateString(),
      content: "",
    };
    showAddNoteDialog.value = false;
    ElMessage.success("教学记录新增成功！");
  } else {
    ElMessage.error("请填写教学记录内容！");
  }
};

// 编辑教学记录
const showEditNoteDialog = ref(false);
const editNoteForm = ref<Note>({
  date: new Date().toLocaleDateString(),
  content: "",
});
const currentEditNote = ref<Note | null>(null);

const editNote = (note: Note) => {
  editNoteForm.value = { ...note };
  currentEditNote.value = note;
  showEditNoteDialog.value = true;
};

const saveEditNote = () => {
  if (currentEditNote.value && editNoteForm.value.content) {
    currentEditNote.value.content = editNoteForm.value.content;
    currentEditNote.value.date = new Date().toLocaleDateString(); // 更新记录日期为当前时间
    showEditNoteDialog.value = false;
    ElMessage.success("教学记录编辑成功！");
  } else {
    ElMessage.error("请填写教学记录内容！");
  }
};

// 删除教学记录
const deleteNote = (note: Note) => {
  ElMessageBox.confirm("确定要删除该教学记录吗？", "提示", {
    type: "warning",
  }).then(() => {
    if (selectedClassDetails.value) {
      const index = selectedClassDetails.value.notes.indexOf(note);
      if (index !== -1) {
        selectedClassDetails.value.notes.splice(index, 1);
        ElMessage.success("教学记录删除成功！");
      }
    }
  });
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

  .lesson-progress,
  .teacher-notes {
    margin-top: 30px;
  }

  .lesson-card,
  .note-card {
    padding: 1rem;
  }

  .el-table {
    width: 100%;
    margin-top: 20px;
  }

  .el-table-column {
    text-align: center;
  }

  .el-table th,
  .el-table td {
    padding: 8px;
    text-align: center;
  }
}
</style>