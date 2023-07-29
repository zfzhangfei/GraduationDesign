<template>
  <div id="news">
    <div class="head">
      <img src="..\assets\homeheader.jpg" />
      <h2>{{ msg }}</h2>
    </div>
    <!--新闻列表展示-->
    <el-card>
      <!--新闻标题搜索-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入新闻标题的关键字"
            v-model="queryInfo.query"
            clearable
          >
          </el-input>
        </el-col>
        <!--新闻栏目搜索-->
        <el-col :span="8">
          <el-input
            placeholder="请输入栏目名"
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
        <!--退出按钮-->
        <el-col :span="8" style="text-align: right">
          <el-button type="primary" @click="logout()" style="color: #06397d"
            >退出</el-button
          >
        </el-col>
      </el-row>

      <!--新闻列表-->
      <el-table :data="newslist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="新闻标题" width=600px   :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <a :href="'/newscontent/' + scope.row.id" class="text">{{
              scope.row.title
            }}</a>
          </template>
        </el-table-column>
        <el-table-column label="新闻栏目" prop="lanmuName"></el-table-column>
         <el-table-column label="发布时间" prop="newssubmittime"></el-table-column>
         <el-table-column label="作者" prop="author"></el-table-column>
      </el-table>
      <!--新闻分页-->
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
      msg: "这是一个新闻列表！",
      newslist: [],
      queryInfo: {
        query: '',
        query1: '',
        //当前页数
        pagenum: 1,
        //当前每页显示条数
        pagesize: 5,
      },
      total: 0,
    };
  },
    mounted() {
    this.requestData();
  // this.searchList();
  },
  methods: {
  async requestData() {
      await this.$get("/api/news", this.queryInfo)
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
  // this.searchList();
   this.requestData();
    },
    //获取查询的新闻列表
     searchList(){
      this.$get("/api/searchlist", this.queryInfo)
        .then((response) => {
          this.newslist = response.data.results;
          this.total = response.data.total;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },












    logout() {
      this.$router.push({ path: "/" });
    },
  },
};
</script>

<style lang="scss" scoped>
.head {
  height: 100px;
  width: 100%;
}
.head > img {
  width: 100%;
  height: 100px;
  position: absolute;
  display: flex;
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