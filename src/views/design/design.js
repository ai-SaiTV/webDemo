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
    // 跳转到PPT生成页面
    goToPPTGenerator() {
      this.$router.push('/ppt-generator');
    },
    // 重置步骤
    resetSteps() {
      window.location.href = 'http://127.0.0.1:5177/';
      // this.step = 1;
      this.courseName = '';
      this.chapter = '';
      this.content = '';
      this.outlineGenerated = false;
      this.treeData = null;
      if (this.svg) this.svg.remove();  // 移除之前的SVG内容
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

    // 选择节点
    selectNode(node) {
      this.selectedNode = node;
    },

    // 添加根节点
    addRootNode() {
        const newNode = { name: '新根节点', children: [] };
        if (!this.treeData) {
          // 如果树形数据为空，则直接创建
          this.treeData = newNode;
        } else {
          // 如果树形数据已经存在，添加到根节点
          const newRoot = { name: '新课程', children: [newNode] };
          this.treeData = newRoot;  // 更新树数据
        }
  
        this.renderTree();  // 更新树形图
      },

    // 添加子节点
    addChildNode() {
      if (this.selectedNode) {
        const newNode = { name: '新子节点', children: [] };
        if (this.selectedNode.children) {
          this.selectedNode.children.push(newNode);  // 在选中节点下添加子节点
        } else {
          this.selectedNode.children = [newNode];
        }
        this.updateTree();  // 更新树形图
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
  },
};
