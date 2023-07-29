<template>
  <div class="main">
    <img src="..\assets\321.png" />
    <div class="login_box">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item>
          <h1>Sign in</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            type="username"
            v-model="ruleForm.username"
            autocomplete="off"
            placeholder="请输入登录名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >登录</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <el-button type="out" @click="logout()">退出登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="primary" @click="register()">新用户注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//导入md5加密方法
import {strTomd5 } from "../util/md5";
export default {
  data() {
    //验证登录名
    var validateloginname = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("登录名不能为空"));
      }
      callback();
    };
    //验证密码
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      }
      callback();
    };
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ validator: validateloginname, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  methods: {
    //表单提交方法
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        console.log(valid);
        if (valid) {
          //对密码进行加密
          this.ruleForm.password = strTomd5(this.ruleForm.password);
          // alert('submit!');
          //实现登录
          let res = await this.$get("/api/users", this.ruleForm);
          console.log(res);
          if (res.data.msg === "admin login success") {
            let token = res.data.token;
            let uid = res.data.res[0].id;
            let name = res.data.res[0].username;
            let identity = res.data.res[0].identity;
            window.sessionStorage.setItem("token", token);
            window.sessionStorage.setItem("uid", uid);
            window.sessionStorage.setItem("username", name);
            window.sessionStorage.setItem("identity", identity);
            this.$setToken();

            this.$router.push({ path: "/" }); //编程式导航'/authorprivatepage/'+uid
          } else if (res.data.msg === "user login success") {
            let token = res.data.token;
            let uid = res.data.res[0].id;
            let name = res.data.res[0].username;
            let identity = res.data.res[0].identity;
            window.sessionStorage.setItem("token", token);
            window.sessionStorage.setItem("uid", uid);
            window.sessionStorage.setItem("username", name);
            window.sessionStorage.setItem("identity", identity);
            this.$setToken();

            this.$router.push({ path: "/" }); //编程式导航'/authorprivatepage/'+uid
          } else if (res.data.msg === "author login success") {
            let token = res.data.token;
            let uid = res.data.res[0].id;
            let name = res.data.res[0].username;
            let identity = res.data.res[0].identity;
            window.sessionStorage.setItem("token", token);
            window.sessionStorage.setItem("uid", uid);
            window.sessionStorage.setItem("username", name);
            window.sessionStorage.setItem("identity", identity);
            this.$setToken();
            this.$router.push({ path: "/" }); //编程式导航'/authorprivatepage/'+uid
          } else {
            alert("用户名或密码错误");
          }
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
    //表单重置方法
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //用户注册
    register() {
      this.$router.push("/register");
    },
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.main > img {
  width: 100%;
  height: 100%;
}

.login_box {
  width: 500px;
  height: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  background-color: rgb(255, 255, 255, 0.5);
}
.demo-ruleForm {
  position: absolute;
  width: 80%;
  padding: 50px 0px;
  box-sizing: border-box;
}
label.el-form-item__label {
  color: red;
  font-size: 20px;
}
h1 {
  text-align: center;
}
</style>>
