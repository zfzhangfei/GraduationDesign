<template>
  <div id="body">
    <div id="content">
      <div class="title">
        <div class="picture">
          <img :src="picurl" alt="未有封面" />
        </div>
        <div class="tab">
          <h2>{{ list.title }}</h2>
          <span>作者：{{ list.author }}</span><br>
          <span>发布时间：{{ list.newssubmittime }}</span>
        </div>
      </div>
      <div class="btn">
        <el-button type="primary" @click="logout()" style="color: #06397d"
          >退出</el-button
        >
      </div>
      <div class="news" >
        <div v-html="list.content"></div>
      </div>
      <div class="talkspace">
        <el-card class="talkcard">
          <el-avatar :src="circleUrl"></el-avatar>
          <el-input
            placeholder="发送一条评论"
            class="talktext"
            v-model="queryInfo.query"
            clearable
          >
            <el-button slot="append" type="primary" @click="talkbtn()"
              >评论</el-button
            >
          </el-input>
          <el-table :data="talklist" :show-header="false">
            <el-table-column
              prop="nickname"
              align="right"
              width="100px"
            ></el-table-column>
            <el-table-column prop="talkcontent" width="600px"></el-table-column>
            <el-table-column prop="time"></el-table-column>
          </el-table>
          <el-pagination
            align="right"
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      id: this.$route.params.id,
      list: [],
      picurl: "",
      //评论功能参数
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        //当前每页显示条数
        pagesize: 5,
        newsid1: this.$route.params.id,
      },
      total: 0,
      talklist: [],
      talkForm: {
        nickname: "",
        content: "",
        time: "",
        uid: window.sessionStorage.getItem("uid"),
        newsid2: this.$route.params.id,
      },
      timer: null,
      nowWeek: "",
      nowDate: "",
      nowTime: "",
    };
  },
  created() {
    this.requestData();
    this.getTalklist();
  },
  methods: {
    requestData() {
      let id = this.id;
      console.log(id);
      this.$get("/api/news_id", { id }).then(
        (response) => {
          console.log(response);
          this.list = response.data[0];
          if(response.data[0].newspicture===undefined||response.data[0].newspicture===''){
                      this.picurl = "https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fq_70%2Cc_zoom%2Cw_640%2Fimages%2F20190228%2F3f0ddbb93bcc4cd7bd47fbf07c3e36c3.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651938751&t=ee6fc5db81df03be46070d5b8f6839f3"
          }else{
                      this.picurl = response.data[0].newspicture;
          }

        },
        (error) => {
          console.log(error);
        }
      );
    },
    logout() {
      if (window.history.length <= 1) {
        this.$router.push({ path: "/" });
        return false;
      } else {
        this.$router.go(-1);
      }
    },
    //评论区js
    getTalklist() {
      this.$get("/api/talk", this.queryInfo).then(
        (response) => {
          console.log(response);
          //注意 用到this要注意this指向
          this.talklist = response.data.results;
          this.talkForm.nickname = this.list.username;
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
      this.getTalklist();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getTalklist();
    },
    talkbtn() {
      console.log(this.talkForm.uid)
      this.talkForm.nickname = window.sessionStorage.getItem("username");
      this.talkForm.content = this.queryInfo.query;
      let myDate = new Date();
      let yy = String(myDate.getFullYear());
      let mm = myDate.getMonth() + 1;
      let dd = String(
        myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate()
      );
      let hou = String(
        myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours()
      );
      let min = String(
        myDate.getMinutes() < 10
          ? "0" + myDate.getMinutes()
          : myDate.getMinutes()
      );
      let sec = String(
        myDate.getSeconds() < 10
          ? "0" + myDate.getSeconds()
          : myDate.getSeconds()
      );
     if(this.talkForm.uid===undefined||this.talkForm.uid===null){
       alert("用户未登录,请登陆后发言")
            this.queryInfo.query = "";
     }else{
        this.talkForm.time =
        yy + "-" + mm + "-" + dd +' '+ hou + ":" + min + ":" + sec;
      this.$post("/api/submittalk", this.talkForm)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      this.getTalklist();
      this.queryInfo.query = "";
     }
    },
  },
};
</script>

<style lang="scss" scoped>
#body {
  background: url("../assets/newscontentback.jpg") no-repeat;
  background-size: 100% 100%;
}
#content {
  line-height: 2;
  width: 100%;
  margin: 0 auto;
}
/*头部标题*/
.title {
  width: 100%;
  height: 300px;
  background-color: #9a3b4e;
  text-align: center;
}
.picture {
  width: 20%;
  height: 300px;
  float: left;
  position: relative;
}
.picture > img {
  width: 300px;
  height: 300px;
}
.tab {
  width: 80%;
  height: 300px;
  position: relative;
  float: right;
}
.btn {
  background-color: white;
//   border-style: dashed;
//   border-width: 0px 5px 0px 5px;
  text-align: right;
}
/*新闻主体*/
.news {
  background-color: white;
//   border-style: dashed;
//   border-width: 0px 5px 5px 5px;
  min-height: 100vh;
  text-indent: 50px;
  display: flex;
  font-size: 10px;
}
.news .img{
width: 80%;
}
.talkspace {
  width: 100%;
}
.talkcard {
  width: 100%;
  background-color:bisque;
}
.talktext {
  width: 95%;
  float: right;
}
</style>
