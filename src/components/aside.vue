<template lang="">
    <div class="aside">
        <el-menu unique-opened background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <h2>后台管理系统</h2>
             <el-menu-item >
                 <router-link to="/index" index="/index">
                    <i class="el-icon-s-home"></i>
                    <span>首页</span>
                 </router-link>
            </el-menu-item>
            <el-submenu v-for="(submenu,index) in menus" :key="index" :index="(index+1).toString()">
                <template slot="title">
                    <i :class="submenu.icon"></i>
                    <span>{{submenu.title}}</span>
                </template>
                <el-menu-item v-for="(item,index) in submenu.children" :key="index" :index="item.url">
                    <router-link :to="item.url">
                        <i :class="item.icon"></i>
                        <span>{{item.title}}</span>
                    </router-link>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["menus"]),
  },
};
</script>
<style lang="stylus">
.aside {
  height: 100%;

  .el-menu {
    height: 100%;
  }

  h2 {
    color: #fff;
    margin: 20px auto;
    text-align: center;
  }

  .el-menu-item {
    .router-link-active { // 点击之后的颜色 也可以把router-link变成其他标签,a标签不能继承颜色
      color: #ffd04b;

      i {
        color: #ffd04b;
      }
    }

    a {
      color: #fff;
      text-decoration: none;
    }
  }
}
</style>