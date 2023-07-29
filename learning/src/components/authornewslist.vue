<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome1' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>新闻管理</el-breadcrumb-item>
      <el-breadcrumb-item>新闻列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
      <!--搜索-->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            placeholder="请输入新闻标题的关键字"
            v-model="queryInfo.query"
            clearable
            @clear="getNewsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchnewsList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--新闻列表prop="title"-->
      <el-table :data="newslist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="新闻标题">
          <template slot-scope="scope">
            <a :href="'/newscontent/' + scope.row.id" class="text">{{
              scope.row.title
            }}</a>
          </template>
        </el-table-column>
        <el-table-column label="新闻栏目" prop="lanmuName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--scope数据插槽-->
            <!--删除按钮-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removenewsById(scope.row.id)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editnewsById(scope.row.id)"
            ></el-button>
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
    <!-- 编辑新闻 -->
    <el-dialog title="修改新闻" :visible.sync="dialogVisible" width="50%">
      <el-card>
        <el-alert
          class="tip"
          title="编辑新闻"
          type="info"
          center
          show-icon
          :closable="false"
        >
        </el-alert>
        <el-form
          :model="editnewsForm"
          :rules="editnewsFormrules"
          ref="editnewsFormref"
          label-width="100px"
          label-position="top"
        >
          <el-tabs :tab-position="'top'">
            <el-tab-pane label="新闻标题"
              >新闻标题
              <el-form-item prop="news_title">
                <el-input v-model="newtitle"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="新闻栏目"
              >新闻栏目
              <el-form-item prop="newslanmu">
                <el-input v-model="newslanmuname" :disabled="true"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="新闻内容"
              >新闻内容
              <el-form-item prop="newscontent">
                <!--富文本编辑器-->
                <quill-editor v-model="newscontent"> </quill-editor>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-card>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  data() {
    return {
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //当前每页显示条数
        pagesize: 5,
        uid: window.sessionStorage.getItem("uid"),
      },
      newslist: [],
      total: 0,
      dialogVisible: false,
      newsid: "",
      newtitle: "",
      newscontent: "",
      newslanmuid: "",
      newslanmuname: "",

      //添加新闻的表单数据
      editnewsForm: {
        news_title: "",
        content: "",
        news_id:''
      },
      editnewsFormrules: {
        // news_title: [
        //   {
        //     required: true,
        //     message: "请输入新闻标题",
        //     trigger: "blur",
        //   },
        // ],
      },
      //栏目列表
      lanmulist: [],
      lanmuProps: {
        label: "lanmuName",
        value: "LanMuid",
      },
      previewPath: "",
      previewVisible: false,
    };
  },

  created() {
    this.getNewsList();
  },

  methods: {
    async getNewsList() {
      await this.$get("/api/news_list", this.queryInfo)
        .then((response) => {
          this.newslist = response.data.results;
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
      this.getNewsList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getNewsList();
    },
    //获取查询的新闻列表
    searchnewsList() {
      this.$get("/api/searchnewslist", this.queryInfo)
        .then((response) => {
          this.newslist = response.data.results;
          this.total = response.data.total;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //根据id删除新闻
    async removenewsById(id) {
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

      await this.$get("/api/removenews", { id }).then((res) => {
        if (res.status !== 200) {
          return this.$message.error("删除失败");
        }
      });
      this.$message.success("删除成功");
      this.getNewsList();
      // console.log('确认删除')
    },
    //修改新闻
    editnewsById(id) {
      this.dialogVisible = true;
      this.newsid = id;
      this.getnewmessage(id);
      this.getLanMuname;
    },
    getnewmessage(id) {
      // let id=this.newsid
      console.log(id);
      this.$get("/api/getnews", { id }).then((res) => {
        console.log(res.data);
        (this.newtitle = res.data[0].title),
          (this.newscontent = res.data[0].content),
          (this.newslanmuid = res.data[0].LanMuid),
          (this.newslanmuname = res.data[0].lanmuName);
      });
    },
    //确定编辑新闻
    edit() {
      this.$refs.editnewsFormref.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必填项");
        }
        this.editnewsForm.news_title=this.newtitle
        this.editnewsForm.news_id=this.newsid
        this.editnewsForm.content=this.newscontent
        const form = _.cloneDeep(this.editnewsForm);
        console.log(form);

        await this.$post("/api/editnews", form)
          .then((response) => {
            console.log(response);
            if (response.data.msg !== 0) {
              return this.$message.error("uid失效,请重新登录");
            } else {
                this.dialogVisible = false;
                this.getNewsList();
              return this.$message.success("修改成功");
               
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },
  },
};
</script>

<style scoped>
.picview {
  width: 400px;
  height: 300px;
}
</style>
