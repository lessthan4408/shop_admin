<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加按钮 -->
    <el-button @click="addFn" type="primary">添加</el-button>

    <!-- 表格 -->
    <el-table
      label-width="180px"
      :data="tableData"
      style="width: 100%"
      row-key="id"
    >
      <!-- prop="rolename"绑定tabledata中的rolename -->
      <el-table-column label="角色名称" prop="rolename"></el-table-column>

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
          <el-button @click="editFn(scope.row.id)">编辑</el-button>
          <el-button @click="deleteFn(scope.row.id)" type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog
      :visible.sync="info.isShow"
      :title="info.isAdd ? '添加角色' : '编辑角色'"
      @open="openFn"
      @close="closeFn"
    >
      <el-form label-width="100px" :model="form" ref="ruleForm" :rules="rules">
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="form.rolename"></el-input>
        </el-form-item>

        <!-- label: 'title' 对应menulist中的title -->
        <el-form-item label="角色权限">
          <el-tree
            ref="tree"
            :data="menuList"
            show-checkbox
            check-strictly
            :props="{ children: 'children', label: 'title' }"
            node-key="id"
            :default-checked-keys="defaultKeys"
          ></el-tree>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="form.status"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="info.isShow = false">取消</el-button>
        <el-button @click="submitFn" type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let defaultFrom = {
  //默认表单
  rolename: "",
  menus: "",
  status: true,
};
export default {
  data() {
    return {
      form: { ...defaultFrom }, //表单数据
      tableData: [], //表格数据
      menuList: [], //树形列表数据
      defaultKeys: [], //树形默认选中项
      info: {
        //杂项
        isShow: false,
        isAdd: true,
      },
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async getTableData() {
      //获取table
      let res = await this.$http.get("/api/rolelist");
      // console.log(res);
      if (res.code == 200) {
        this.tableData = res.list;
      }
    },
    addFn() {
      //添加table项
      this.info.isShow = true;
    },
    async editFn(id) {
      //编辑table项
      this.info.isShow = true;
      this.info.isAdd = false;

      let res = await this.$http.get("/api/roleinfo", { id });
      if (res.code == 200) {
        console.log(res);
        this.form.rolename = res.list.rolename;
        this.form.id = id;
        this.form.status = res.list.status == 1 ? true : false;
        this.defaultKeys = res.list.menus.split(",");
      }
    },
    deleteFn(id) {
      //删除table项
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$http.post("/api/roledelete", { id });
          if (res.code == 200) {
            this.getTableData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    openFn() {
      //打开表单
      this.getMenus();
    },
    closeFn() {
      //关闭表单
      // this.info.isShow = false;//点击取消按钮时已经执行
      this.info.isAdd = true;
      this.form = { ...defaultFrom };
    },
    async submitFn() {
      //提交表单
      let url = this.info.isAdd ? "/api/roleadd" : "/api/roleedit";
      this.form.menus = this.$refs.tree.getCheckedKeys().join(",");
      this.form.status = this.form.status ? 1 : 2;
      // console.log(this.form);
      let res = await this.$http.post(url, this.form);
      if (res.code == 200) {
        this.getTableData();
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
      this.info.isShow = false;
    },
    async getMenus() {
      let res = await this.$http.get("/api/menulist", { istree: true });
      if (res.code == 200) {
        // console.log(res);
        this.menuList = res.list ? res.list : [];
      }
    },
  },
  created() {
    this.getTableData();
  },
};
</script>
<style lang="stylus">
.el-button {
  margin-top: 30px;
}
</style>