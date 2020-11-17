<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员 管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button @click="addFn" type="primary">添加</el-button>

    <!-- 表格 -->
    <el-table :data="tableData" width="100" row-key="id">
      <el-table-column label="用户编号" prop="uid"> </el-table-column>
      <el-table-column label="角色" prop="rolename"> </el-table-column>
      <el-table-column label="用户名" prop="username"> </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status == 1"
            >启用</el-tag
          >
          <el-tag type="danger" effect="dark" v-else>禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.uid)">编辑</el-button>
          <el-button type="danger" @click="deleteFn(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="info.total"
      :page-size="info.size"
      :current-page.sync="info.page"
      @current-change="pageChange"
    >
    </el-pagination>

    <!-- 表单 -->
    <el-dialog
      @open="openFn"
      @close="closeFn"
      :title="info.isAdd ? '添加管理员' : '编辑管理员'"
      :visible.sync="info.isShow"
    >
      <el-form :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色" prop="roleid">
          <el-select v-model="form.roleid">
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status"> </el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="info.isShow = false">取消</el-button>
        <el-button type="primary" @click="submitFn">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
let defaultForm = {
  roleid: "",
  username: "",
  password: "",
  status: true,
};
export default {
  data() {
    return {
      roleList: [],
      tableData: [],
      form: { ...defaultForm },
      info: {
        isShow: false,
        isAdd: true,
        size: 3,
        page: 1,
        total: 0,
      },
      rules: {
        roleid: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    pageChange(current) {
      this.info.page = current;
      this.getTable();
    },
    getTotal() {
      return this.$http.get("/api/usercount");
    },
    getTableData() {
      return this.$http.get("/api/userlist", {
        size: this.info.size,
        page: this.info.page,
      });
    },
    getTable() {
      //并发请求数据
      axios.all([this.getTableData(), this.getTotal()]).then(
        axios.spread((tabData, tot) => {
          // console.log(tabData, tot);
          if (tabData.code == 200 && tot.code == 200) {
            this.tableData = tabData.list ? tabData.list : [];
            this.info.total = tot.list ? tot.list[0].total : 0;
          }
        })
      );
    },
    addFn() {
      this.info.isShow = true;
    },
    async editFn(uid) {
      this.info.isShow = true;
      this.info.isAdd = false;
      let res = await this.$http.get("/api/userinfo", { uid });
      if (res.code == 200) {
        this.form.uid = uid;
        this.form.roleid = res.list.roleid;
        this.form.username = res.list.username;
        this.form.status = this.form.status == 1 ? true : false;
      }
    },
    deleteFn(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$http.post("/api/userdelete", { id });
          if (res.code == 200) {
            this.info.page = 1;
            this.getTable();
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    async submitFn() {
      let url = this.info.isAdd ? "/api/useradd" : "/api/useredit";
      this.form.status = this.form.status ? 1 : 2;
      let res = await this.$http.post(url, this.form);
      // console.log(url, this.form);
      // console.log(res);
      if (res.code == 200) {
        this.$message.success(res.msg);
        this.getTable();
      } else {
        this.$message.error(res.msg);
      }
      this.info.isShow = false;
    },
    openFn() {
      this.getRoleList();
    },
    async getRoleList() {
      let res = await this.$http.get("/api/rolelist");
      // console.log(res);
      this.roleList = res.list;
    },
    closeFn() {
      this.info.isShow = false;
      this.form = { ...defaultForm };
    },
  },
  created() {
    this.getTable();
  },
};
</script>
<style lang="stylus">
.el-button {
  margin-top: 30px;
}
</style>