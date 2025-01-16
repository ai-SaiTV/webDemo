<template>
  <div class="common-layout" style="height: 100%;">
    <el-container class = "home_container">
      <el-aside class = "home_aside">
        <div class = "home_aside_content">
          <div class = "home_aside_content_title">Title</div>
          <button class = "home_aside_content_button" v-for = "(item,index) in buttons" :key = index @click="SelectCard(item)">{{ item.text }}</button>
        </div>
      </el-aside>
      <el-container class = "home_detail_container">
        <el-header class = "home_header">
          <div class = "home_avatar">
            <img src = "https://avatars.githubusercontent.com/u/104672400?v=4" class = "home_avatar_img"></img>
          </div>
        </el-header>
        <el-main class = "home_main">
          <component v-if = "main_se" :is = "main_se.page" style="border-radius: 15px; margin: 1%;"></component>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang = "ts">
import { ref } from 'vue';
import ChatInterface from '@/components/ChatInterface.vue'
  
const buttons = ref([
  { text: '学情分析' , page: ChatInterface},
  { text: '教案生成' , page: ChatInterface},
  { text: '学生数据' , page: ChatInterface},
  { text: '4' , page: ChatInterface},
  { text: '5' , page: ChatInterface}
]);
const main_se = ref(null);

const SelectCard = (item: any) => {
  main_se.value = item;
}
</script>

<style lang = "scss">
html, body{
  height: 100%;
  width: 100%;
}

.home_container {
  background: linear-gradient(-45deg, #0d00ff5b, #ffe4ef2b);
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  .home_aside {
  height: 100% ;
  width: 20%;
  text-align: center;
  line-height: 200px;
  }

  .home_detail_container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 80%;

    .home_header {
    height: 10%;
    width: 100%;
    background-color: #b3c0d100;
    color: #333;
    text-align: center;
    line-height: 60px;
    display: flex;
    justify-content: end;
      .home_avatar {
        padding-right: 20px;
        justify-content: end;
        margin-top: 30px;
        width: 10%;
        height: 60%;
        text-align: center;
        line-height: 60px;
        display: flex;
        background-color: #b3c0d100;

          .home_avatar_img {
            margin: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
      }
    }

    .home_main {
      border-radius: 15px;
      margin: 1%;
      width: 98%;
      height: 98%;
      background-color: #E9EEF3;
      color: #333;
      text-align: center;
      line-height: 160px;
    }
  }
} 

.home_aside_content {
  padding: 2%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  

  .home_aside_content_title {
    margin: 10%;
    font-size: 20px;
    font-weight: bold;
    color: #e9669b;
    text-align: center;
    line-height: 60px;
  }

  .home_aside_content_button {
    margin: 10px;
    width: 100%;
    height: 5%;
    text-align: center;
    line-height: 60px;
    background-color: #b3c0d100;
  }
}



</style>