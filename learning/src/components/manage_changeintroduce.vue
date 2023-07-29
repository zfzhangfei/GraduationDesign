<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>名师推荐</el-breadcrumb-item>
      <el-breadcrumb-item>修改推荐</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
      <!--栏目列表-->
      <el-table :data="teacherlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="教师名" prop="teachername"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--scope数据插槽-->
            <!--删除按钮-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeteacherById(scope.row.teacherid)"
            ></el-button>
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="changeById(scope.row.teacherid)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改名师对话框 -->
    <el-dialog title="修改名师信息" :visible.sync="dialogVisible" width="70%">
      <!--卡片视图-->
      <el-card class="card">
        <!--提示区域-->
        <el-alert
          class="tip"
          title="添加新闻"
          type="info"
          center
          show-icon
          :closable="false"
        >
        </el-alert>

        <!--tab栏区域-->
        <el-form
          :model="introduceForm"
          ref="introduceFormref"
          label-width="100px"
          label-position="top"
        >
          <el-tabs :tab-position="'left'">
            <el-tab-pane label="名师姓名"></el-tab-pane>
            <el-form-item label="名师姓名" prop="teachername">
              <el-input
                v-model="introduceForm.teachername"
                :disabled="true"
              ></el-input>
            </el-form-item>
            <el-tab-pane label="名师简介"></el-tab-pane>
            <!--富文本编辑器-->
            <el-form-item label="名师简介" prop="content">
              <el-input type="textarea" v-model="introduceForm.content">
              </el-input>
            </el-form-item>
            <el-tab-pane label="课程链接"></el-tab-pane>
            <el-form-item label="课程链接" prop="course">
              <el-input
                v-model="introduceForm.course"
                placeholder="例如:(百度网盘链接)https://pan.baidu.com/s/1pmVcAR_Mo7IJbAcqnJKAKA"
              ></el-input>
            </el-form-item>
            <el-tab-pane label="提取码"></el-tab-pane>
            <el-form-item label="提取码" prop="checknum">
              <el-input v-model="introduceForm.checknum"></el-input>
            </el-form-item>
            <!--添加名师的按钮-->
            <el-button type="primary" class="btnAdd" @click="updata()"
              >添加</el-button
            >
              <el-button @click="dialogVisible = false">取 消</el-button>
          </el-tabs>
        </el-form>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      teacherlist: [],
      //控制修改对话框的显示与隐藏
      dialogVisible: false,
      introduceForm: {
        teachername: "",
        content: "",
        course: "",
        checknum: "",
        teacherid:'',
      },
    };
  },
  created() {
    this.getTeacherList();
  },
  methods: {
    async getTeacherList() {
      await this.$get("/api/teachlist")
        .then((response) => {
          this.teacherlist = response.data.result;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //根据id删除栏目
    async removeteacherById(id) {
      console.log(id);
      //弹框询问
      const confirmResult = await this.$confirm(
        "此操作将永久删除该名师信息, 是否继续?",
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

      await this.$get("/api/removeteacher", { id }).then((res) => {
        if (res.data.code !== 200) {
          return this.$message.error("删除栏目失败");
        }
      });
      this.$message.success("删除成功");
      this.getTeacherList();
    },
    //根据id修改名师信息
    changeById(id) {
      console.log(id);
      this.dialogVisible = true;
      this.introduceForm.teacherid=id
      this.$get("/api/selectteacher", { id }).then((res) => {
        console.log(res);
        this.introduceForm.teachername = res.data.result[0].teachername;
        this.introduceForm.content=res.data.result[0].introduce;
        this.introduceForm.course=res.data.result[0].course;
        this.introduceForm.checknum=res.data.result[0].checknum.split('：')[1];
        console.log(this.introduceForm.teachername);
      });
    },
    updata() {
      this.dialogVisible = false;

      this.$refs.introduceFormref.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必填项");
        }
        if (this.introduceForm.course === undefined) {
          this.introduceForm.course = "";
        }
        if (this.introduceForm.checknum === undefined) {
          this.introduceForm.checknum = "提取码:无";
        }
        const form = _.cloneDeep(this.introduceForm);
        console.log(form);

        await this.$post("/api/updatateach", form)
          .then((response) => {
            console.log(response);
            return this.$message.success("修改成功");
          })
          .catch((error) => {
            console.log(error);
          });
      });
        (this.introduceForm.content = ""),
        (this.introduceForm.course = ""),
        (this.introduceForm.checknum = "");
    },
  },
};
</script>

<style scoped>
</style>
