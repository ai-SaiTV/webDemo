import * as d3 from 'd3';

export default {
  data() {
    return {
      step: 0,
      courseName: '',
      chapter: '',
      content: '',
      outlineGenerated: false,
      treeData: null,
      svg: null,
      selectedNode: null, // 记录当前选中的节点
      uploadedFiles: [], // 存储上传的PDF文件
    };
  },
  methods: {
    setStep(stepIndex){
      this.step = stepIndex;
    },
    // 生成教学大纲
    generateOutline() {
      if (this.courseName && this.chapter && this.content) {
        this.outlineGenerated = true;
        this.createMindMap();  // 生成思维导图
      } else {
        alert("请填写所有信息！");
      }
    },
    //前往上一步
    previousStep() {
      if (this.step > 1) {
        this.step--;
      }
    },
    // 前往下一步
    nextStep() {
      if (this.step < 4) {
        this.step++;
      }
    },
    // 触发文件选择框并读取文件
    addpdf() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf';
      fileInput.addEventListener('change', this.handleFileChange);
      fileInput.click();
    },
    // 判断文件是否是pdf类型
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        // alert(`文件加载成功:${file.name}`)
        this.uploadedFiles.push(file); 
        this.selectedFile = file;
        this.readPDF(file);
      } else {
        alert('请选择一个有效的PDF文件！');
      }
    },
    // 使用 FileReader 读取 PDF 文件
    readPDF(file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.pdfData = reader.result;
        console.log('文件加载成功:', file.name);
        this.savePDF(file);
      };
      reader.onerror = (error) => {
        console.error('文件读取错误:', error);
      };
      reader.readAsDataURL(file);
    },
    // ----->下载文件至本地(请在此基础上进行修改)
    savePDF(file) {
      const blob = new Blob([file], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${file.name}`;
      link.click();
      alert('文件加载成功');
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
      if (this.svg) {
        this.svg.remove();  // 移除之前的SVG内容
        alert("创建成功");
      }
    },
    // 初始化思维导图
    mounted() {
      this.createMindMap();
    },
    // 创建思维导图
    createMindMap() {
      // 设置树形数据结构
      this.treeData = {
        name: this.courseName,
        children: [
          {
            name: this.chapter,
            children: [
              { name: this.content },
            ],
          },
        ],
      };

      // 获取SVG容器
      this.svg = d3.select(this.$refs.mindmapContainer)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%');

      // 设置树形布局
      const treeLayout = d3.tree().size([400, 400]);
      const root = d3.hierarchy(this.treeData);
      treeLayout(root);

      // 绘制连接线
      this.svg.selectAll('.link')
        .data(root.links())
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x))
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-width', '2px');

      // 绘制节点
      const nodes = this.svg.selectAll('.node')
        .data(root.descendants())
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`)
        .on('click', (event, d) => this.selectNode(d));  // 点击节点时选择该节点

      nodes.append('circle')
        .attr('r', 10)
        .attr('fill', 'lightsteelblue')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2);

      nodes.append('text')
        .attr('dy', -15)
        .attr('x', d => (d.children ? -15 : 15))
        .style('text-anchor', d => (d.children ? 'middle' : 'start'))
        .text(d => d.data.name);
    },
    // 点击节点事件
    nodeClick(event, d) {
      // 防止触发全局点击事件
      event.stopPropagation();

      if (this.selectedNode === d) {
        this.selectedNode.data.name = prompt('编辑节点名称', this.selectedNode.data.name);
        this.updateTree();
      } else {
        // 选择新节点
        this.selectedNode = d;
        this.addChildNode(d);
      }
    },
    // 添加子节点
    addChildNode(node) {
      const newNode = { name: '新子节点', children: [] };
      if (node.children) {
        node.children.push(newNode);
      } else {
        node.children = [newNode];
      }
      this.updateTree();
    },
    // 更新树形图
    updateTree() {
      const root = d3.hierarchy(this.treeData);
      const treeLayout = d3.tree().size([400, 400]);
      treeLayout(root);

      // 清除现有的连接线和节点
      this.svg.selectAll('.link').remove();
      this.svg.selectAll('.node').remove();

      // 重新绘制连接线
      this.svg.selectAll('.link')
        .data(root.links())
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x))
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-width', '2px');

      // 重新绘制节点
      const nodes = this.svg.selectAll('.node')
        .data(root.descendants())
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`)
        .on('click', (event, d) => this.nodeClick(event, d));  // 点击节点时触发

      nodes.append('circle')
        .attr('r', 10)
        .attr('fill', 'lightsteelblue')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2);

      nodes.append('text')
        .attr('dy', -15)
        .attr('x', d => (d.children ? -15 : 15))
        .style('text-anchor', d => (d.children ? 'middle' : 'start'))
        .text(d => d.data.name);
    },
    // 保存节点名称（编辑模式）
    saveNode() {
      if (this.editingNode) {
        this.editingNode.data.name = this.newNodeName;
        this.updateTree();  // 更新树形图
      }
      this.editingNode = null;  // 结束编辑模式
      this.newNodeName = '';  // 清空输入框
    },
    // 选择节点
    selectNode(node) {
      this.selectedNode = node;
    },

    // 添加根节点
    addRootNode() {
      const newNode = { name: '新根节点', children: [] };
      if (!this.treeData) {
        this.treeData = newNode;
      } else {
        const newRoot = { name: '新课程', children: [newNode] };
        this.treeData = newRoot;
      }
      this.updateTree();
    },

    // 添加子节点
    addChildNode() {
      if (this.selectedNode) {
        const newNode = { name: '新子节点', children: [] };
        if (this.selectedNode.children) {
          this.selectedNode.children.push(newNode);
        } else {
          this.selectedNode.children = [newNode];
        }
        this.updateTree();
      } else {
        alert('请先选择一个节点');
      }
    },

    // 更新树形图
    updateTree() {
      const root = d3.hierarchy(this.treeData);
      const treeLayout = d3.tree().size([400, 400]);
      treeLayout(root);

      // 清除现有的连接线和节点
      this.svg.selectAll('.link').remove();
      this.svg.selectAll('.node').remove();

      // 重新绘制连接线
      this.svg.selectAll('.link')
        .data(root.links())
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal().x(d => d.y).y(d => d.x))
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
        .attr('stroke-width', '2px');

      // 重新绘制节点
      const nodes = this.svg.selectAll('.node')
        .data(root.descendants())
        .enter().append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`)
        .on('click', (event, d) => this.selectNode(d));  // 点击节点时选择该节点

      nodes.append('circle')
        .attr('r', 10)
        .attr('fill', 'lightsteelblue')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2);

      nodes.append('text')
        .attr('dy', -15)
        .attr('x', d => (d.children ? -15 : 15))
        .style('text-anchor', d => (d.children ? 'middle' : 'start'))
        .text(d => d.data.name);
    },
    produceExercises(){
      //在这里实现生成练习题的api调用
    },
  },
};
