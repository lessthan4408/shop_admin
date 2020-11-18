<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品规格</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>

    <el-table :data="tableData" row-key="id">
      <el-table-column label="属性名称" prop="specsname"> </el-table-column>

      <el-table-column label="属性值">
        <template slot-scope="scope">
          <el-tag v-for="(item, index) in scope.row.attrs" :key="index">{{
            item
          }}</el-tag>
        </template>
      </el-table-column>

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
      :title="info.isAdd ? '添加规格' : '编辑规格'"
      :visible.sync="info.isShow"
      @open="openFn"
      @close="closeFn"
    >
      <el-form :model="form" label-width="100px" :rules="rules">
        <el-form-item label="属性名称" prop="specsname">
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>
        <el-form-item label="属性值">
          <div v-for="(item, index) in attrList" :key="index">
            <el-input style="width: 60%" v-model="item.val"></el-input>
            <el-button type="primary" @click="addAttr" v-if="index == 0"
              >新增属性值</el-button
            >
            <el-button type="danger" @click="delAttr(index)" v-else
              >删除属性值</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="状态"
          ><el-switch v-model="form.status"> </el-switch
        ></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="info.isShow = false">取 消</el-button>
        <el-button type="primary" @click="submitFn">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let defaultForm = {
  specsname: "",
  attrs: "",
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
      },
      attrList: [{ val: "" }],
      rules: {
        specsname: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async getTableData() {
      let res = await this.$http.get("/api/specslist");
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
      let res = await this.$http.get("/api/specsinfo", { id });
      // console.log(res);
      if (res.code == 200) {
        this.form.id = res.list[0].id;
        this.form.specsname = res.list[0].specsname;
        this.form.status = res.list[0].status == 1 ? true : false;
        this.attrList = res.list[0].attrs.map((item) => ({
          //返回子项为对项的数组
          val: item,
        }));
        // console.log(this.attrList);
      }
    },
    async deleteFn(id) {
      try {
        await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        let res = await this.$http.post("/api/specsdelete", { id });
        // console.log(res);
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.page = 1;
          this.getTableData();
        }
      } catch (error) {}
    },
    async submitFn() {
      let url = this.info.isAdd ? "/api/specsadd" : "/api/specsedit";
      this.form.status = this.form.status ? 1 : 2;
      this.form.attrs = this.attrList
        .map((item) => {
          return item.val;
        })
        .join(",");
      // console.log(this.form);
      let res = await this.$http.post(url, this.form);
      // console.log(res);
      if (res.code == 200) {
        this.$message.success(res.msg);
        this.getTableData();
      }
      this.info.isShow = false;
    },
    addAttr() {
      this.attrList.push({ val: "" });
    },
    delAttr(index) {
      this.attrList.splice(index, 1);
    },
    openFn() {},
    closeFn() {
      this.info.isAdd = true;
      this.form = { ...defaultForm };
      this.attrList = [{ val: "" }];
    },
  },
  mounted() {
    this.getTableData();
  },
};
</script>
<style lang="stylus"></style>