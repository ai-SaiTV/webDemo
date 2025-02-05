<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const performanceChartRef = ref<HTMLElement>()
const participationChartRef = ref<HTMLElement>()
const selectedClass = ref('1-1') // 添加选择班级的响应式变量

onMounted(() => {
  if (performanceChartRef.value && participationChartRef.value) {
    const performanceChart = echarts.init(performanceChartRef.value)
    const participationChart = echarts.init(participationChartRef.value)
    
    performanceChart.setOption({
      title: {
        text: '班级成绩分布'
      },
      tooltip: {},
      xAxis: {
        data: ['90-100', '80-89', '70-79', '60-69', '60以下']
      },
      yAxis: {},
      series: [{
        name: '人数',
        type: 'bar',
        data: [5, 12, 8, 4, 1],
        itemStyle: {
          color: '#1890ff'
        }
      }]
    })

    participationChart.setOption({
      title: {
        text: '课堂参与度分析'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: 40, name: '积极参与' },
            { value: 35, name: '一般参与' },
            { value: 25, name: '较少参与' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })
  }
})
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
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="stat-box">
                <div class="stat-title">班级人数</div>
                <div class="stat-value">30</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-box">
                <div class="stat-title">平均分</div>
                <div class="stat-value">85.6</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-box">
                <div class="stat-title">及格率</div>
                <div class="stat-value">96.7%</div>
              </div>
            </el-col>
          </el-row>
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
}
</style>