<template >
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <v-table :tableData="tableData" @edit="edit" @del="deleteFn"></v-table>
    <v-dialog
      v-show="info.isShow"
      ref="dialog"
      :info="info"
      @getTableData="getTableData"
    ></v-dialog>
  </div>
</template>
<script>
import VTable from "./menu/table";
import VDialog from "./menu/diglog";
import axios from "axios";

export default {
  data() {
    return {
      tableData: [],
      info: {
        isShow: false,
        isAdd: true,
      },
    };
  },
  methods: {
    // getTableData() {
    //   axios.get("/api/menulist", { params: { istree: true } }).then((res) => {
    //     // console.log(res);
    //     if (res.code == 200) {
    //       this.tableData = res.list;
    //     } else {
    //       this.$message.error(res.msg);
    //     }
    //   });
    // },
    async getTableData() {
      let res = await axios.get("/api/menulist", {
        params: {
          istree: true,
        },
      });
      if (res.code == 200) {
        // console.log(res);
        this.tableData = res.list;
      } else {
        this.$message.error(res.msg);
      }
    },
    addFn() {
      this.info.isShow = true;
      // this.info.isAdd = true;
    },
    async edit(id) {
      this.info.isShow = true;
      this.info.isAdd = false;

      let res = await this.$http.get("/api/menuinfo", { id });

      if (res.list) {
        this.$refs.dialog.form = {
          id,
          ...res.list,
          status: res.list.status == 1 ? true : false,
        };
      }
      // this.tableData = data;
    },
    deleteFn(data) {
      //刷新页面
      this.tableData = data;
    },
  },
  created() {
    this.getTableData();
  },
  components: {
    VTable,
    VDialog,
  },
};
</script>
<style lang="stylus">
.el-button {
  margin-top: 30px;
}
</style>