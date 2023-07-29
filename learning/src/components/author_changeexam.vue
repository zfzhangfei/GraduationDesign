<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考试管理</el-breadcrumb-item>
      <el-breadcrumb-item>编辑试卷</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入试卷名的关键字"
            v-model="queryInfo.queryexam"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchexam"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--试卷列表-->
      <el-table :data="examlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="试卷名">
          <template slot-scope="scope">
            <a :href="'/zhenti/' + scope.row.id" class="text">{{
              scope.row.examname
            }}</a>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--scope数据插槽-->
            <!--删除按钮-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeexamById(scope.row.id)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editexam(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--试卷分页-->
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
  </div>
</template>



<script>
export default {
  data() {
    return {
      examlist: [],
      queryInfo: {
        queryexam: "",
        //当前页数
        pagenum: 1,
        //当前每页显示条数
        pagesize: 5,
      },
      total: 0,
    };
  },
  methods: {
    requestData() {
      this.$get("/api/examslizi", this.queryInfo).then(
        (response) => {
          console.log(response);
          //注意 用到this要注意this指向
          console.log("试卷")
          console.log(this.examlist)
          this.examlist = response.data.results;
          this.total = response.data.total;
        },
        (error) => {
          console.log(error);
        }
      );
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.requestData();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.requestData();
    },

    searchexam() {
      this.$get("/api/searchexam", this.queryInfo)
        .then((response) => {
          this.examlist = response.data.results;
          this.total = response.data.total;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async removeexamById(id) {
      console.log(id);
      //弹框询问
      const confirmResult = await this.$confirm(
        "此操作将永久删除该试卷, 是否继续?",
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

      await this.$get("/api/removewholeexam", { id }).then((res) => {
        if (res.data.code !== 200) {
          return this.$message.error("删除试卷失败");
        }
      });
      this.$message.success("删除成功");
      this.requestData();
      // console.log('确认删除')
    },
    editexam(id) {
      console.log(id);
      this.$router.push({ path: "/examquestion/"+id });
    },
  },
  mounted() {
    this.requestData();
  },
};
</script>

<style scoped>
</style>
