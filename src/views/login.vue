<template>
  <div class="container">
    <div class="form_wrap">
      <h2>登录</h2>
      <el-form label-width="0" :rules="rules" ref="ruleForm" :model="info">
        <el-form-item prop="username">
          <el-input v-model="info.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="info.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFn">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      info: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 6, message: "长度在 4 到 6 个字母", trigger: "blur" },
        ],
        password: [
          //空验证
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            //正确型验证
            pattern: /^\d{4,6}$/,
            message: "长度在 4 到 6 个数字",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    ...mapActions(["login"]),
    submitFn() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //   alert("submit!");
          this.login(this.info);
        } else {
          console.log("error submit!!");
          //   return false;
        }
      });
    },
  },
};
</script>
<style lang="stylus">
.container {
  height: 100%;
  background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);

  .form_wrap {
    height: 300px;
    width: 300px;
    // background: #fff;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;

    h2 {
      margin: 20px auto;
      color: #fff;
      text-align: center;
    }

    .el-button--primary {
      width: 100%;
    }
  }
}
</style>