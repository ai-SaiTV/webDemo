<template>
    <el-button @click="exportToPDF">下载PDF</el-button>
  </template>
  
  <script setup>
  import html2canvas from 'html2canvas';
  import jsPDF from 'jspdf';
  
  const exportToPDF = async () => {
    try {
      // 1. 指定要捕获的DOM元素
      const element = document.querySelector('.step-form'); // 根据实际内容调整选择器
      
      // 2. 生成canvas
      const canvas = await html2canvas(element, {
        scale: 2,       // 提高输出质量
        useCORS: true,  // 允许跨域图片
        logging: true,  // 开启调试日志
      });
  
      // 3. 转换canvas为PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190; // A4纸宽度
      const pageHeight = 295; // A4纸高度
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      // 分页处理
      let heightLeft = imgHeight;
      let position = 10; // 起始位置
  
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      // 4. 下载文件
      pdf.save('教学方案.pdf');
    } catch (error) {
      console.error('生成PDF失败:', error);
      ElMessage.error('PDF生成失败，请重试');
    }
  };
  </script>