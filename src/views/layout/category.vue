<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>

    <el-table
      :data="tableData"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="catename" label="分类列表"> </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag type="success" effect="dark" v-if="scope.row.status == 1">
            启用
          </el-tag>
          <el-tag type="danger" effect="dark" v-else> 禁用 </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editFn(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="deleteFn(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="info.isAdd ? '添加分类' : '编辑分类'"
      :visible.sync="info.isShow"
      @open="openFn"
      @close="closeFn"
    >
      <el-form :model="form" label-width="100px" ref="ruleForm">
        <el-form-item label="上级分类">
          <el-select v-model="form.pid">
            <el-option label="请选择上级分类" :value="0"></el-option>
            <el-option
              v-for="(item, index) in formList"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类名称">
          <el-input v-model="form.catename"></el-input>
        </el-form-item>

        <el-form-item label="分类图片">
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
  pid: 0,
  catename: "",
  img: "",
  status: true,
};
export default {
  data() {
    return {
      formList: [],
      tableData: [],
      form: { ...defaultForm },
      info: {
        isShow: false,
        isAdd: true,
        dialogVisible: false,
        dialogImageUrl: "",
        fileList: [],
      },
    };
  },
  methods: {
    async getTableData() {
      let res = await this.$http.get("/api/catelist", { istree: true });
      if (res.code == 200) {
        this.tableData = res.list ? res.list : [];
      }
    },
    addFn() {
      this.info.isShow = true;
    },
    async editFn(id) {
      this.info.isAdd = false;
      this.info.isShow = true;
      let res = await this.$http.get("/api/cateinfo", { id });
      // console.log(res);
      if (res.code == 200) {
        // console.log(res);
        this.form.id = id;
        this.form.pid = res.list.pid;
        this.form.catename = res.list.catename;
        this.form.status = res.list.status == 1 ? true : false;
        // console.log(this.$domain);
        // console.log(this);
        if (res.list.img) {
          this.form.img = res.list.img;
          // console.log(this.form.img);
          this.info.fileList = [
            { name: "", url: "http://localhost:3000" + res.list.img },
          ];
        }
      }
    },
    async deleteFn(id) {
      try {
        await this.$confirm("此操作将永久删除该分类, 是否继续?", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        let res = await this.$http.post("/api/catedelete", { id });
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.getTableData();
        }
      } catch (error) {}
    },
    async getTopCate() {
      let res = await this.$http.get("/api/catelist", { pid: 0 });
      this.formList = res.list;
    },
    openFn() {
      this.getTopCate();
    },
    closeFn() {
      this.$refs.file.clearFiles();
      this.info.dialogVisible = false;
      this.info.dialogImageUrl = "";
      this.info.isAdd = true;
      this.form = { ...defaultForm };
    },
    async submitFn() {
      let url = this.info.isAdd ? "/api/cateadd" : "/api/cateedit";
      this.form.status = this.form.status ? 1 : 2;
      let res = await this.$http.upload(url, this.form);
      // console.log(this.form);
      // console.log(res);
      if (res.code == 200) {
        this.getTableData();
        this.$message.success(res.msg);
      }
      this.info.isShow = false;
    },
    handlePreview(file) {
      // console.log(file);
      this.info.dialogImageUrl = file.url;
      this.info.dialogVisible = true;
    },
    picChange(file, fileList) {
      // console.log(file);
      // console.log(fileList);
      this.form.img = file.raw;
      this.info.dialogImageUrl = file.url;
    },
  },
  mounted() {
    this.getTableData();
  },
};
</script>
<style lang="stylus"></style>