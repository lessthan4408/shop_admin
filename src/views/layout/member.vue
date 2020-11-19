<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table :data="tableData" row-key="id" label-width="180px">
      <el-table-column label="昵称" prop="nickname"></el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="注册日期" prop="addtime"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.uid)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="info.isAdd ? '添加菜单' : '编辑菜单'"
      :visible.sync="info.isShow"
      @close="closeFn"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status"> </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="info.isShow = false">取 消</el-button>
        <el-button type="primary" @click="submitFn">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let defaultForm = {
  uid: "",
  nickname: "",
  phone: "",
  password: "",
  status: true,
};
export default {
  data() {
    return {
      info: {
        isShow: false,
        page: 1,
        size: 2,
        total: 0,
      },
      tableData: [],
      form: { ...defaultForm },
    };
  },
  methods: {
    async getTableData() {
      let res = await this.$http.get("/api/memberlist", {
        size: this.info.size,
        page: this.info.page,
      });
      // console.log(res);
      if (res.code == 200) {
        this.tableData = res.list;
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].addtime = new Date(
            parseInt(this.tableData[i].addtime)
          ).toLocaleString();
        }
      }
    },
    async editFn(uid) {
      this.info.isShow = true;
      let res = await this.$http.get("/api/memberinfo", { uid });
      // console.log(res);
      if (res.code == 200) {
        this.form = { ...res.list };
        this.form.password = "";
        this.form.status = res.list.status == 1 ? true : false;
        this.form.uid = uid;
        // console.log(this.form);
      }
    },
    async submitFn() {
      // console.log(this.form);
      this.form.status = this.form.status ? 1 : 2;
      let res = await this.$http.post("/api/memberedit", this.form);
      if (res.code == 200) {
        this.$message.success(res.msg);
      }
      this.info.isShow = false;
      this.getTableData();
    },
    closeFn() {
      this.form = { ...defaultForm };
    },
  },
  mounted() {
    this.getTableData();
  },
};
</script>