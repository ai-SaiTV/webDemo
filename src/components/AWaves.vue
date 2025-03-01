<template>
  <div v-html="htmlContent" class="dynamic-content"></div>
</template>

<script>
import "../assets/awaves.css";
import "../assets/awaves.js";

export default {
  data() {
    return {
      htmlContent: "",
    };
  },
  mounted() {
    this.loadHtml();
  },
  methods: {
    async loadHtml() {
      try {
        const response = await fetch("/awaves.html");
        this.htmlContent = await response.text();
      } catch (error) {
        console.error("加载 HTML 失败:", error);
      }
    }
  }
};
</script>

<style scoped>
.dynamic-content {
  text-align: center;
  padding: 20px;
}
</style>
