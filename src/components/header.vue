<template >
  <div>
    <el-header>
      <el-dropdown @command="commandFn">
        <span class="el-dropdown-link">
          {{ username }}<i class="el-icon-s-tools"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>注销</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
  </div>
</template>
<script>
// import { mapGetters, mapMutations } from "vuex";
// export default {
//   computed: {
//     // ...mapGetters(["username"]),
//     username() {
//       return this.$store.getters.username;
//     },
//   },
//   methods: {
//     ...mapMutations(["logout"]),
//     commandFn() {
//       this.logout();
//     },
//   },
//   mounted() {
//     // console.log(this.username);
//     console.log(this.logout);
//     console.log(JSON.parse(this.$store.state.userinfo));
//   },
// };
import { mapGetters, mapMutations } from "vuex";
export default {
  computed: {
    ...mapGetters(["username"]),
  },
  methods: {
    ...mapMutations(["logout"]),
    commandFn() {
      this.logout();
    },
  },
};
</script>
<style lang="stylus">
.el-header {
  background: #e3e3e3;
  text-align: right;
  line-height: 60px;
}
</style>
