<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- <el-button type="primary" @click="addFn">添加</el-button> -->

    <el-table :data="tableData" row-key="id" label-width="180px">
      <el-table-column label="昵称" prop="nickname"></el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="注册日期"> {{ time }}</el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="info.isAdd ? '添加菜单' : '编辑菜单'"
      :visible.sync="info.isShow"
      @open="openFn"
      @close="closeFn"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="title">
          <el-input v-model="form.phone"></el-input>
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
  status: "",
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
  computed: {
    time() {
      return new Date(Number(this.tableData.addtime));
    },
  },
  methods: {
    async getTableData() {
      let res = await this.$http.get("/api/memberlist", {
        size: this.info.size,
        page: this.info.page,
      });
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.list;
      }
    },
    editFn() {
      this.isShow = true;
    },
    submitFn() {},
    openFn() {},
    closeFn() {},
  },

  mounted() {
    this.getTableData();
    console.log(1);
  },
};
</script>