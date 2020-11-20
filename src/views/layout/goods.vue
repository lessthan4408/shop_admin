<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>

    <el-table :data="tableData" row-key="id" label-width="180px">
      <el-table-column label="一级分类" prop="firstcatename"></el-table-column>
      <el-table-column label="二级分类" prop="secondcatename"></el-table-column>
      <el-table-column label="商品名称" prop="goodsname"></el-table-column>
      <el-table-column label="商品价格" prop="price"></el-table-column>
      <el-table-column label="市场价格" prop="market_price"></el-table-column>
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
          <el-button type="danger" @click="deleteFn(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="info.total"
      :page-size="info.size"
      :current-page.sync="info.page"
      @current-change="pageChange"
    >
    </el-pagination>

    <el-dialog
      :title="info.isAdd ? '添加商品' : '编辑商品'"
      :visible.sync="info.isShow"
      @open="openFn"
      @close="closeFn"
      @opened="openedFn"
    >
      <el-form :model="form">
        <el-form-item label="一级分类">
          <el-select v-model="form.first_cateid" @change="firstChange">
            <el-option
              v-for="(item, index) in firstCateList"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid">
            <el-option
              v-for="(item, index) in secondCateList"
              :key="index"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称">
          <el-input v-model="form.goodsname" style="width: 60%"></el-input>
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

        <el-form-item label="商品规格">
          <el-select v-model="form.specsid" @change="specsChange">
            <el-option
              v-for="(item, index) in specsList"
              :key="index"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品规格值">
          <el-select v-model="form.specsattr" multiple>
            <el-option
              v-for="(item, index) in specsattrList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="销售价">
          <el-input v-model="form.price" type="number"></el-input>
        </el-form-item>

        <el-form-item label="市场价">
          <el-input v-model="form.market_price" type="number"></el-input>
        </el-form-item>

        <el-form-item label="是否热卖">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="是否新品">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="上架状态">
          <el-radio v-model="form.status" :label="1">上架</el-radio>
          <el-radio v-model="form.status" :label="2">下架</el-radio>
        </el-form-item>

        <el-form-item label="商品描述">
          <div id="editor"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="info.isShow = false">取 消</el-button>
        <el-button type="primary" @click="submitFn">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import E from "wangeditor";
let defaultForm = {
  first_cateid: "",
  second_cateid: "",
  goodsname: "",
  price: "",
  market_price: "",
  img: "",
  description: "",
  specsid: "",
  specsattr: "",
  isnew: 1,
  ishot: 1,
  status: 1,
};
export default {
  data() {
    return {
      tableData: [],
      form: { ...defaultForm },
      firstCateList: [],
      secondCateList: [],
      specsList: [],
      specsattrList: [],
      // editor: null,
      info: {
        isShow: false,
        isAdd: true,
        size: 3,
        page: 1,
        total: 0,
        fileList: [],
        dialogVisible: false,
        dialogImageUrl: "",
      },
    };
  },
  methods: {
    handlePreview(file) {
      // console.log(file);
      this.info.dialogImageUrl = file.url;
      this.info.dialogVisible = true;
    },
    picChange(file, fileList) {
      // console.log(file);
      this.form.img = file.raw;
      this.info.dialogImageUrl = file.url;
    },
    firstChange(id) {
      // console.log(id)
      this.secondCateList = [];
      this.getCateList(id);
    },
    specsChange(id) {
      // console.log(id);
      let item = this.specsList.find((item) => {
        return item.id == id;
      });
      // console.log(item.attrs);
      this.specsattrList = item.attrs ? item.attrs : [];
      // console.log(this.specsattrList);
    },
    openFn() {
      this.getCateList();
      if (this.info.isAdd) {
        this.getSpecsList();
      }
    },
    closeFn() {
      this.$refs.file.clearFiles();
      this.info.isAdd = true;
      this.info.dialogVisible = false;
      this.form = { ...defaultForm };
      this.firstCateList = [];
      this.secondCateList = [];
      this.specsList = [];
      this.specsattrList = [];
      // this.editor = null;
    },
    openedFn() {
      document.getElementById("editor").innerHTML = "";
      this.editor = new E("#editor");
      this.editor.create();
      this.editor.txt.html(this.form.description);
    },
    async submitFn() {
      let url = this.info.isAdd ? "/api/goodsadd" : "/api/goodsedit";
      this.form.description = this.editor.txt.html();
      this.form.specsattr = this.form.specsattr.join(",");
      // console.log(this.form);
      let res = await this.$http.upload(url, this.form);
      if (res.code == 200) {
        this.$message.success(res.msg);
        this.getTableData();
      }
      this.info.isShow = false;
    },
    addFn() {
      this.info.isShow = true;
    },
    async editFn(id) {
      this.info.isShow = true;
      this.info.isAdd = false;
      this.form.id = id;
      let res = await this.$http.get("/api/goodsinfo", { id });
      if (res.code == 200) {
        // console.log(res);
        this.form = { ...res.list, id };
        this.info.fileList = [
          {
            name: "",
            url: "http://localhost:3000" + res.list.img,
          },
        ];
      }

      let res1 = await this.$http.get("/api/specslist");
      if (res1.code == 200) {
        // console.log(res1.list);
        this.specsList = res1.list;
      }

      this.getCateList(res.list.first_cateid);
      this.form.specsattr = res.list.specsattr.split(",");
      this.specsChange(res.list.specsid);
      this.editor.txt.html(this.form.description);
    },
    async deleteFn(id) {
      try {
        await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        let res = await this.$http.post("/api/goodsdelete", { id });
        // console.log(res);
        if (res.code == 200) {
          this.info.page = 1;
          this.$message.success(res.msg);
        }
        this.getTableData();
      } catch (error) {}
    },
    async getTableData() {
      let res = await this.$http.get("/api/goodslist", {
        size: this.info.size,
        page: this.info.page,
      });
      // console.log(res);
      if (res.code == 200) {
        this.tableData = res.list;
      }
    },
    async getTotal() {
      let res = await this.$http.get("/api/goodscount");
      // console.log(res);
      if (res.code == 200) {
        this.info.total = res.list[0].total;
      }
    },
    async getCateList(pid = 0) {
      let res = await this.$http.get("/api/catelist", { pid });
      // console.log(res.list);
      if (pid == 0) {
        if (res.code == 200) {
          // console.log(res.list);
          this.firstCateList = res.list;
        }
      } else {
        if (res.code == 200) {
          this.secondCateList = res.list;
        }
      }
    },
    async getSpecsList() {
      let res = await this.$http.get("/api/specslist");
      // console.log(res);
      if (res.code == 200) {
        this.specsList = res.list;
      }
    },
    pageChange(current) {
      this.info.page = current;
      this.getTableData();
      this.getTotal();
    },
  },
  mounted() {
    this.getTableData();
    this.getTotal();
  },
  beforeDestroy() {
    this.editor = null;
  },
};
</script>
<style lang="stylus"></style>