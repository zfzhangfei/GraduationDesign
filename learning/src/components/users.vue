<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            placeholder="请输入用户名的关键字"
            v-model="queryInfo.query"
            clearable
            @clear="searchUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!--用户列表-->
      <el-table :data="userlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="角色" prop="identity"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <!--scope数据插槽-->
            <!--修改按钮-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showedit(scope.row.id)"
            ></el-button>
            <!--删除按钮-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!--角色分配按钮
<el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
    <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
</el-tooltip>-->
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--添加用户-->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetForm"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="登录名" prop="username">
          <el-input
            type="username"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            type="email"
            v-model="ruleForm.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择身份">
            <el-option label="管理员" value="author"></el-option>
            <el-option label="用户" value="user"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!--修改用户  @close="resetForm"-->
    <el-dialog
      title="修改用户"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editdialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
         <el-form-item label="身份" prop="region">
          <el-select v-model="editForm.region" placeholder="请选择身份" :disabled='state'>
            <el-option label="管理员" value="author"></el-option>
            <el-option label="用户" value="user"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>



<script>
import { strTomd5 } from "../util/md5";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //当前每页显示条数
        pagesize: 5,
      },
      userlist: [],
      total: 0,
      //控制添加用户对话框的显示与隐藏
      dialogVisible: false,
      //添加用户
      existed: false,
      ruleForm: {
        username: "",
        password: "",
        email: "",
        region: "", //身份选择
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "用户名长度在2~10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 15,
            message: "密码长度在6~15个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        region: [
          {
            required: true,
            message: "请选择用户身份",
            trigger: "blur",
          },
        ],
      },
      //控制修改用户对话框的显示与隐藏
      editdialogVisible: false,
      //查询到的用户对象,修改规则
      editForm: {
        username:'',
        email:'',
        region:''
      },
      userid:'',
      state:false,
      editFormRules: {
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
         region: [
          {
            required: true,
            message: "请选择用户身份",
            trigger: "blur",
          },
        ],
      },
    };
  },

  //创建函数
  created() {
    this.getUserList();
  },
  methods: {
    //获取用户列表
    getUserList() {
      this.$get("/api/userlist", this.queryInfo)
        .then((response) => {
          this.userlist = response.data.results;
          this.total = response.data.total;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //获取查询的用户列表
    searchUserList() {
      this.$get("/api/searchuserlist", this.queryInfo)
        .then((response) => {
          this.userlist = response.data.results;
          this.total = response.data.total;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //表单提交方法
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        console.log(valid);
        if (valid) {
          //对密码进行加密
          this.ruleForm.password = strTomd5(this.ruleForm.password);
          // alert('submit!');
          //实现注册
          await this.$post("/api/adduser1", this.ruleForm).then((res) => {
            console.log(res.data);
            switch (res.data.msg) {
              case 0:
                alert("注册成功");
                this.dialogVisible = false;
                break;
              case -1:
                this.existed = true;
                alert("用户名已存在");
                break;
            }
          });
        }
      });
      this.getUserList();
    },
    //表单重置方法
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    //展示修改用户的对话框
    async showedit(id) {
      console.log(id);
      await this.$get("/api/user_id", { id }).then((res) => {
        if (res.data.msg !== "success") {
          alert("查询失败");
        }
        this.editForm = res.data.result[0];
        this.userid=res.data.result[0].id
        console.log(this.userid)
        if(this.userid===1)
        {
          this.state=true
        }else{
          this.state=false
        }
      });
      this.editdialogVisible = true;
    },
    //监听修改用户对话框的关闭事件
    editdialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改用户信息，预校验并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        //发起修改用户信息的数据请求
        await this.$post("/api/userupdate", this.editForm);
        //关闭对话框
        this.editdialogVisible = false;
        //刷新数据列表
        this.getUserList();
        //提示修改成功
        alert("修改成功");
      });
    },
    //根据ID删除对应用户
    async removeUserById(id) {
      console.log(id);
      //弹框询问
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //如果用户确认删除，则返回字符串confirm
      //如果用户取消删除，则返回字符串cancel
      //console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      await this.$get("/api/removeuser", { id }).then((res) => {
        if (res.data.code !== 200) {
          return this.$message.error("删除用户失败");
        }
      });
      this.$message.success("删除成功");
      this.getUserList();
      // console.log('确认删除')
    },
  },
};
</script>

<style scoped>
</style>
