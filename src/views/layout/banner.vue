<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>

    <el-table
      label-width="180px"
      :data="tableData"
      style="width: 100%"
      row-key="id"
    >
      <el-table-column label="轮播图名称" prop="title"></el-table-column>

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

    <el-dialog
      :title="info.isAdd ? '添加轮播图' : '编辑轮播图'"
      :visible.sync="info.isShow"
      @open="openFn"
      @close="closeFn"
    >
      <el-form :model="form" label-width="100px" ref="ruleForm">
        <el-form-item label="轮播图名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="轮播图图片">
          <el-upload
            ref="file"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-preview="handlePreview"
            :on-change="picChange"
            :file-list="info.fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="info.dialogVisible" append-to-body>
            <img width="100%" :src="info.dialogImageUrl" />
          </el-dialog>
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
  title: "",
  img: "",
  status: true,
};

export default {
  data() {
    return {
      tableData: [],
      form: { ...defaultForm },
      info: {
        isShow: false,
        isAdd: true,
        fileList: [],
        dialogVisible: false,
        dialogImageUrl: "",
      },
    };
  },
  methods: {
    async getTableData() {
      let res = await this.$http.get("/api/bannerlist");
      // console.log(res);
      if (res.code == 200) {
        this.tableData = res.list;
      }
    },
    addFn() {
      this.info.isShow = true;
    },
    async editFn(id) {
      this.info.isShow = true;
      this.info.isAdd = false;
      let res = await this.$http.get("/api/bannerinfo", { id });
      // console.log(res);
      this.form = { ...res.list };
      this.form.status = res.list.status == 1 ? true : false;
      this.info.fileList = [
        {
          name: "",
          url: "http://localhost:3000" + res.list.img,
        },
      ];
    },
    async deleteFn(id) {
      try {
        await this.$confirm("此操作将永久删除该分类, 是否继续?", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        let res = await this.$http.post("/api/bannerdelete", { id });
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.getTableData();
        }
      } catch (error) {}
    },
    openFn() {},
    handlePreview(file) {
      this.info.dialogImageUrl = file.url;
      this.info.dialogVisible = true;
    },
    picChange(file) {
      // console.log(file);
      this.form.img = file.raw;
      this.info.dialogImageUrl = file.url;
    },
    closeFn() {
      this.info.isAdd = true;
      this.form = { ...defaultForm };
      this.info.dialogImageUrl = "";
      this.info.fileList = [];
      this.form = { ...defaultForm };
    },
    async submitFn() {
      let url = this.info.isAdd ? "/api/banneradd" : "/api/banneredit";
      // console.log(this.form);
      this.form.status = this.form.status ? 1 : 2;
      let res = await this.$http.upload(url, this.form);
      if (res.code == 200) {
        this.$message.success(res.msg);
        this.getTableData();
      }
      this.info.isShow = false;
    },
  },
  mounted() {
    this.getTableData();
  },
};
</script> 