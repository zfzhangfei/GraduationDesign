<template>
<div class="main">
  <img src="..\assets\111.jpg">
  <div class="form">
<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"  class="demo-ruleForm">
    <el-form-item label="登录名" prop="username">
    <el-input type="username" v-model="ruleForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
  </el-form-item>
      <el-form-item label="邮箱" prop="email" >
    <el-input type="email" v-model="ruleForm.email" autocomplete="off" placeholder="请输入邮箱"></el-input>
  </el-form-item>
  <el-form-item label="新密码" prop="password">
    <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="请输入长度为6-8的密码"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">修改</el-button>&nbsp;&nbsp;
    <el-button @click="resetForm('ruleForm')">重置</el-button>&nbsp;&nbsp;&nbsp;
    <el-button type="out" @click="logout()">返回</el-button>
  </el-form-item>
</el-form>
  </div>
</div>
</template>

<script>
//导入md5加密方法
import {strTomd5} from '../util/md5' 
export default {
    data() {
        //验证登录名
      var validateloginname = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入登录名'));
        } 
        callback();
      };
      //验证密码
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } 
          callback();
      };
       //验证密码
      var validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱'));
        } 
          callback();
      };
      return {
        existed: false,
        ruleForm: {
          username:'',
          password:'',
          email:'',
        },
        rules: {
           username: [
            { required: true, validator: validateloginname, trigger: 'blur' }
          ],
          password: [
            {required: true, validator: validatePass, trigger: 'blur' },
            { min: 6, max: 8, message: '长度在 6到 8 个字符', trigger: 'blur' }
          ],
          email: [
            { required: true,validator: validateEmail , trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
        }
      };
    },
    methods: {
      changepassword(){
        this.$router.push('/changepass');
      },
      //表单提交方法
      submitForm(formName) {
        this.$refs[formName].validate (async(valid) => {
        console.log(valid)
         if (valid) {
           //对密码进行加密
            this.ruleForm.password = strTomd5(this.ruleForm.password)
           // alert('submit!');
            //实现注册
         await this.$post("/api/changePass", this.ruleForm )
         .then(res=>{
           console.log(res.data)
          switch(res.data.code){
							case 200:
								alert("修改成功");
								break;
							case 201:
								alert("用户不存在");
								break;
						}
            
       })
            }
        })

      },
      //表单重置方法
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
         logout(){
         this.$router.push('/register');
         }
    }
  }
</script>

<style scoped>
.form{
  width: 450px;
  height: 350px;
  background-color: white;
   position:absolute;
   left: 50%;
   top:50%;
   transform: translate(-50%,-50%);
   border-radius:10px;
}
.demo-ruleForm{
  position:absolute;
  width: 80%;
  padding: 50px 0px;
  box-sizing: border-box;
}
.main{
    display: flex;
    justify-content: center;
    align-items:center;
    height: 100vh;
    background-color: black;
}
.main>img{
  width: 100%;
  height: 100%;
}
</style>>
