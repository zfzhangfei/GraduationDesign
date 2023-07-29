<template>
  <div id="news">
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考试管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑试卷</el-breadcrumb-item>
    </el-breadcrumb>
    <!--新闻列表展示-->
    <el-card>
      <!--新闻标题搜索-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入资料名的关键字"
            v-model="queryInfo.query"
            clearable
          >
          </el-input>
        </el-col>
        <!--搜索-->
        <el-col :span="8">
          <el-input
            placeholder="请输入相关老师的名字"
            v-model="queryInfo.query1"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--新闻列表-->
      <el-table :data="newslist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          label="资料名"
          width="300px"
          prop="resourcename"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column label="名师" prop="resourceteacher"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--scope数据插槽-->
            <!--删除按钮-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeresourceById(scope.row.resourceid)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editresourece(scope.row.resourceid)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
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
    <!-- 修改资料对话框 -->
    <el-dialog title="修改" :visible.sync="dialogVisible" width="70%">
      <!--tab栏区域-->
      <el-form
        :model="addresourceForm"
        :rules="addresourceFormrules"
        ref="addresourceFormref"
        label-width="100px"
        label-position="top"
      >
        <el-tabs :tab-position="'left'">
          <el-tab-pane label="资料名"></el-tab-pane>
          <el-form-item label="资料名" prop="resourcename">
            <el-input v-model="addresourceForm.resourcename"></el-input>
          </el-form-item>
          <el-tab-pane label="相关名师"></el-tab-pane>
          <el-form-item label="相关名师" prop="resourceteacher">
            <el-input v-model="addresourceForm.resourceteacher"></el-input>
          </el-form-item>
          <el-tab-pane label="资料链接"></el-tab-pane>
          <el-form-item label="资料链接" prop="resourcelink">
            <el-input v-model="addresourceForm.resourcelink"></el-input>
          </el-form-item>
          <el-tab-pane label="资料提取码"></el-tab-pane>
          <el-form-item label="资料提取码" prop="resourcenum">
            <el-input v-model="addresourceForm.resourcenum"></el-input>
          </el-form-item>
        </el-tabs>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updata()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      //添加新闻的表单数据
      addresourceForm: {
        resourcename: "",
        resourceteacher: "",
        resourcelink: "",
        resourcenum: "",
        resourceid: "",
      },
      addresourceFormrules: {
        resourcename: [
          {
            required: true,
            message: "请输入资料名",
            trigger: "blur",
          },
        ],
        resourceteacher: [
          {
            required: true,
            message: "请选择名师",
            trigger: "blur",
          },
        ],
        resourcelink: [
          {
            required: true,
            message: "请输入资料链接",
            trigger: "blur",
          },
        ],
      },
      msg: "这是一个新闻列表！",
      newslist: [],
      queryInfo: {
        query: "",
        query1: "",
        //当前页数
        pagenum: 1,
        //当前每页显示条数
        pagesize: 5,
      },
      total: 0,
      dialogVisible: false,
    };
  },
  mounted() {
    this.requestData();
  },
  methods: {
    async requestData() {
      await this.$get("/api/resources", this.queryInfo)
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
      // this.searchList();
      this.requestData();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;

      this.requestData();
    },
    //获取查询的新闻列表
    searchList() {
      this.$get("/api/searchresource", this.queryInfo)
        .then((response) => {
          this.newslist = response.data.results;
          this.total = response.data.total;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async removeresourceById(id) {
      console.log(id);
      //弹框询问
      const confirmResult = await this.$confirm(
        "此操作将永久删除该资料, 是否继续?",
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

      await this.$get("/api/removeresource", { id }).then((res) => {
        if (res.data.code !== 200) {
          return this.$message.error("删除资料失败");
        }
      });
      this.$message.success("删除成功");
      this.requestData();
    },
    editresourece(id) {
      console.log(id);
      this.dialogVisible = true;
      this.addresourceForm.resourceid = id;
      this.$get("/api/resource_id", { id }).then((res) => {
        console.log(res);
        this.addresourceForm.resourcename = res.data.result[0].resourcename;
        this.addresourceForm.resourceteacher =
          res.data.result[0].resourceteacher;
        this.addresourceForm.resourcelink = res.data.result[0].resourcelink;
        this.addresourceForm.resourcenum = res.data.result[0].resourcenum;
      });
    },
    updata() {
      this.$refs.addresourceFormref.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必填项");
        }
        const form = _.cloneDeep(this.addresourceForm);
        console.log(form);

        await this.$post("/api/updataresource", form)
          .then((response) => {
            console.log(response);
            this.dialogVisible = false;

            return this.$message.success("修改成功");
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.head {
  height: 100px;
  width: 100%;
  background-color: #681414;
}
h2 {
  float: left;
  position: relative;
}
.list {
  li {
    height: 3.4rem;
    line-height: 3.4rem;
    border-bottom: 1px solid #eee;
    font-size: 1.6rem;
    a {
      color: #666;
    }
  }
}
.text {
  color: black;
  text-decoration: none;
}
.text:hover {
  color: #2a90ab;
}
</style>