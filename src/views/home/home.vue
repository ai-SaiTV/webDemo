<template>
  <div class="common-layout" style="height: 100%;">
    <el-container class = "home_container">
      <el-aside class = "home_aside">Aside</el-aside>
      <el-container class = "home_detail_container">
        <el-header class = "home_header">Header</el-header>
        <el-main class = "home_main">Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang = "ts">
import { ref } from 'vue';
</script>

<style lang = "scss">
html, body{
  height: 100%;
  width: 100%;
}

.home_container {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  .home_aside {
  height: 100% ;
  width: 20%;
  background-color: #0f41e5;
  color: #333;
  text-align: center;
  line-height: 200px;
  }

  .home_detail_container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 80%;
  }

} 

.home_header {
  height: 10%;
  width: 100%;
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.home_main {
  width: 100%;
  height: 90%;
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

</style>