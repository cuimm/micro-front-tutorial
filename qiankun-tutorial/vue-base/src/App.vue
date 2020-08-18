<template>
  <div class="container">
    <el-menu :router="true" mode="horizontal">
      <el-menu-item index="/">Home</el-menu-item>
      <el-menu-item index="/student">student</el-menu-item>
      <el-menu-item index="/course">course</el-menu-item>
    </el-menu>
    <router-view/>
    <div id="student"></div>
    <div id="course"></div>
  </div>
</template>

<style>
.container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
