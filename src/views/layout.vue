<template>
  <div class="layout_box">
    <el-container>
      <el-aside width="250px">
        <v-aside></v-aside>
      </el-aside>

      <el-container>
        <el-header>
          <v-header></v-header>
        </el-header>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import VAside from "../components/aside";
import VHeader from "../components/header";
export default {
  components: {
    VAside,
    VHeader,
  },
};
</script>
<style lang="stylus">
.layout_box {
  height: 100%;

  .el-container {
    height: 100%;
  }
}
</style>