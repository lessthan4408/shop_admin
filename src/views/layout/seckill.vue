<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/layout' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>限时秒杀列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>

    <el-table
      label-width="180px"
      :data="tableData"
      style="width: 100%"
      row-key="id"
    >
      <el-table-column label="活动名称" prop="title"></el-table-column>

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
      :title="info.isAdd ? '添加活动' : '编辑活动'"
      :visible.sync="info.isShow"
      @open="openFn"
      @close="closeFn"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="活动名称">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="活动期限">
          <div class="block">
            <el-date-picker
              v-model="time"
              style="width: 100%"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="一级分类">
          <el-select v-model="form.first_cateid" @change="firstChange">
            <el-option
              v-for="(item, index) in firstList"
              :key="index"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid" @change="secondChange">
            <el-option
              v-for="(item, index) in secondList"
              :key="index"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品">
          <el-select v-model="form.goodsid">
            <el-option
              v-for="(item, index) in goodsList"
              :key="index"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
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
  id: "",
  title: "",
  begintime: "",
  endtime: "",
  first_cateid: "", //写为空字符串，才会有请选择
  second_cateid: "",
  goodsid: "",
  status: true,
};

export default {
  data() {
    return {
      tableData: [],
      form: { ...defaultForm },
      firstList: [],
      secondList: [],
      goodsList: [],
      time: [],
      info: {
        isShow: false,
        isAdd: true,
      },
    };
  },
  methods: {
    async getList(pid = 0) {
      let res = await this.$http.get("/api/catelist", { pid });
      if (pid == 0) {
        if (res.code == 200) {
          // console.log(res);
          this.firstList = res.list;
        }
      } else {
        if (res.code == 200) {
          // console.log(res);
          this.secondList = res.list;
        }
      }
    },
    async getGoods(id) {
      // console.log(id);
      let res = await this.$http.get("/api/goodslist", {
        fid: this.form.first_cateid,
        sid: id,
      });
      // console.log(res);
      this.goodsList = res.list;
    },
    firstChange(id) {
      // 二级菜单先清空再获取，不然切换时会有默认值
      this.secondList = [];
      this.getList(id);
    },
    secondChange(id) {
      this.getGoods(id);
    },
    async getTableData() {
      let res = await this.$http.get("/api/secklist");
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

      //编辑后提交必须传id

      let res = await this.$http.get("/api/seckinfo", { id });
      // console.log(res);
      if (res.code == 200) {
        this.form = { ...res.list, id };
        this.form.status = res.list.status == 1 ? true : false;
        this.time = [
          new Date(parseInt(res.list.begintime)).getTime(),
          new Date(parseInt(res.list.endtime)).getTime(),
        ];

        // console.log(this.time);
      }
      // console.log(this.form);
      this.getList(res.list.first_cateid);
      this.getGoods(res.list.second_cateid);
    },
    async deleteFn(id) {
      try {
        await this.$confirm("此操作将永久删除该分类, 是否继续?", "", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        let res = await this.$http.post("/api/seckdelete", { id });
        if (res.code == 200) {
          this.$message.success(res.msg);
          this.getTableData();
        }
      } catch (error) {}
    },
    openFn() {
      //打开的时候获取一级菜单，并且编辑时绑定first-id所以会选中对应的选项
      this.getList();
    },
    closeFn() {
      this.info.isAdd = true;
      this.form = { ...defaultForm };
      this.firstList = [];
      this.secondList = [];
      this.goodsList = [];
      this.time = [];
    },
    async submitFn() {
      let url = this.info.isAdd ? "/api/seckadd" : "/api/seckedit";

      this.time = [
        new Date(this.time[0]).getTime(),
        new Date(this.time[1]).getTime(),
      ];
      // console.log(this.time);

      this.form.begintime = this.time[0] + "";
      this.form.endtime = this.time[1] + "";

      this.form.status = this.form.status ? 1 : 2;
      console.log(this.form);
      let res = await this.$http.post(url, this.form);
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