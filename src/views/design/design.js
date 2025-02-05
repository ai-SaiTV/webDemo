import * as d3 from 'd3';

export default {
  data() {
    return {
      step: 1,
      courseName: '',
      chapter: '',
      content: '',
      outlineGenerated: false,
      treeData: null,
      svg: null,
      selectedNode: null, // 记录当前选中的节点
    };
  },
  methods: {
    // 生成教学大纲
    generateOutline() {
      if (this.courseName && this.chapter && this.content) {
        this.outlineGenerated = true;
        this.createMindMap();  // 生成思维导图
      } else {
        alert("请填写所有信息！");
      }
    },
    // 前往下一步
    nextStep() {
      if (this.step < 4) {
        this.step++;
      }
    },
    // 跳转到PPT生成页面
    goToPPTGenerator() {
      this.$router.push('/ppt-generator');
    },
    // 重置步骤
    resetSteps() {
      this.step = 1;
      this.courseName = '';
      this.chapter = '';
      this.content = '';
      this.outlineGenerated = false;
      this.treeData = null;
      if (this.svg) this.svg.remove();  // 移除之前的SVG内容
    },
    // 创建思维导图
    }
  }
