<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 class="text-2xl font-semibold text-center text-gray-700 mb-6">
          Welcome to the Login Page
        </h1>
        <!-- 登录表单 -->
        <form>
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium ">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              class="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <div class="flex items-center justify-between">
            <button
              type="submit"
              class="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginPage',
  };
  </script>
  
  <style scoped>
  /* 如果你需要在这里添加特定的样式，可以在这里写。 */
  </style>
  