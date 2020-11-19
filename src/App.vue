<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
<style lang="stylus">
html, body {
  height: 100%;
}

body {
  -moz-user-select: none; /* 火狐 */
  -webkit-user-select: none; /* webkit浏览器 */
  -ms-user-select: none; /* IE10 */
  -khtml-user-select: none; /* 早期浏览器 */
  user-select: none;
}

#app {
  height: 100%;
}

.el-button {
  margin-top: 30px;
}

.el-table {
  width: 100%;
}
</style>


