<template>
  <h1 class="text-3xl font-bold underline">
      Hello world!
  </h1>
  <div class="login-container">
    <h2>登录</h2>
    

    <!-- 登录表单 -->
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">用户名</label>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="请输入用户名"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">密码</label>
        <div class="password-container">
          <input
            :type="passwordVisible ? 'text' : 'password'"
            id="password"
            v-model="password"
            placeholder="请输入密码"
            required
          />
          <!-- 密码显示/隐藏按钮 -->
          <button type="button" @click="togglePasswordVisibility">
            {{ passwordVisible ? '隐藏' : '显示' }}
          </button>
        </div>
      </div>

      <!-- 显示错误信息 -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button :disabled="isSubmitting" type="submit">登录</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',  // 用户名
      password: '',  // 密码
      error: '',      // 错误信息
      isSubmitting: false, // 防止重复提交
      passwordVisible: false // 控制密码显示与隐藏
    };
  },
  methods: {
    handleSubmit() {
      this.isSubmitting = true;

      // 模拟简单的用户名和密码验证
      if (this.username === 'admin' && this.password === '123456') {
        // 登录成功后跳转到仪表盘页面
        this.$router.push({ name: 'Dashboard' });
      } else {
        this.error = '用户名或密码错误';  // 登录失败显示错误信息
      }

      this.isSubmitting = false; // 恢复提交状态
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    }
  }
};
</script>

<style scoped>
/* 登录页面样式 */
.login-container {
  width: 300px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.password-container {
  position: relative;
}

.password-container button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 10px;
  text-align: center;
}
</style>

  