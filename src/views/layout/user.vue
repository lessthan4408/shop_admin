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

    <!-- 表单 -->
    <el-dialog
      @open="openFn"
      @close="closeFn"
      :title="info.isAdd ? '添加管理员' : '编辑管理员'"
      :visible.sync="info.isShow"
    >
      <el-form :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色" prop="rolename">
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
        size: 2,
        page: 1,
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
    async getTableData() {
      let res = await this.$http.get("/api/userlist", {
        size: this.info.size,
        page: this.info.page,
      });
      // console.log(res);
      if (res.code == 200) {
        this.tableData = res.list;
      }
    },
    addFn() {
      this.info.isShow = true;
    },
    async editFn(uid) {
      this.info.isShow = true;
      this.info.isAdd = false;
      let res = await this.$http.get("/api/userinfo", { uid });
      console.log(res);
    },
    deleteFn(id) {},
    submitFn() {
      let url = this.info.isAdd ? "/api/useradd" : "/api/useredit";
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
  mounted() {
    this.getTableData();
  },
};
</script>
<style lang="stylus">
.el-button {
  margin-top: 30px;
}
</style>