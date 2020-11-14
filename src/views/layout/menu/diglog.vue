<template>
  <div class="dialog_box">
    <el-dialog
      :title="info.isAdd ? '添加菜单' : '编辑菜单'"
      :visible.sync="info.isShow"
      @open="openFn"
      @close="closeFn"
    >
      <el-form :model="form" label-width="100px" :rules="rules" ref="ruleForm">
        <el-form-item label="菜单名称">
          <el-select v-model="form.pid" @change="changeMenu">
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option
              v-for="(item, index) in topMenu"
              :key="index"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="目录图标" v-if="form.type == 1">
          <el-input v-model="form.icon" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="菜单地址" v-if="form.type == 2">
          <el-input v-model="form.url" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="类型">
          <el-radio v-model="form.type" :label="1" :disabled="form.type == 2"
            >目录</el-radio
          >
          <el-radio v-model="form.type" :label="2" :disabled="form.type == 1"
            >菜单</el-radio
          >
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="form.status"> </el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="info.isShow = false">取 消</el-button>
        <el-button type="primary" @click="sureFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
let defaultForm = {
  pid: 0,
  type: 1,
  status: true,
  title: "",
  icon: "",
  url: "",
};

export default {
  methods: {
    openFn() {
      this.getTop();
    },
    closeFn() {
      this.form = { ...defaultForm };
      this.info.isAdd = true;
    },
    sureFn() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let url = this.info.isAdd ? "/api/menuadd" : "/api/menuedit";

          this.form.status = this.form.status ? 1 : 2;

          let res = await this.$http.post(url, this.form);

          // console.log(res);
          if (res.code == 200) {
            this.$emit("getTableData");
          } else {
            this.$message.error(res.msg);
          }
          this.info.isShow = false;
        }
      });
    },

    async getTop() {
      let res = await this.$http.get("/api/menulist", { pid: 0 });
      // console.log(res);
      if (res.code == 200) {
        // console.log(res);
        this.topMenu = res.list ? res.list : [];
        // console.log(this.topMenu);
      } else {
        this.$message.error(res.msg);
      }
    },
    changeMenu(value) {
      this.form.type = value == 0 ? 1 : 2;
    },
  },
  props: ["info"],
  data() {
    return {
      topMenu: [],
      form: { ...defaultForm },
      rules: {
        title: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
};
</script>