<template>
  <div>
    <div class="p1">
      欢迎来到我的网站&emsp;&emsp;
      <span class="time" style="white-space: pre-wrap">{{ nowWeek }}</span
      >&emsp;
      <span class="time" style="white-space: pre-wrap">{{ nowDate }}</span
      >&emsp;
      <span class="time" style="white-space: pre-wrap">{{ nowTime }}</span>
      <input type="button" id="btn" :value="show" :v-model="state" @click="goto()">
      <el-link class="link" :underline="false" @click="back()">后台管理</el-link>
      <el-link class="link" :underline="false" @click="teach()">名师推荐</el-link>
        <el-link class="link" :underline="false" @click="knowlodge()">资料集合</el-link>
    </div>
    <header>
      <div class="head">
        <img src="..\assets\301.jpg" alt="" />
        <h1>This is my Web</h1>
        <h2>Let's Begin to Study !</h2>
        <div class="btn">
          <el-button round @click="zhenti()">真题练习<br />True Topic Exercise</el-button>
          <!-- &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; -->
          <el-button round @click="xianshi()" class="limit">限时挑战<br />Time Limited Challenge</el-button>
        </div>
      </div>
    </header>
    <content>
      <el-carousel :interval="4000" type="card" height="400px">
        <el-carousel-item v-for="(item, index) in dataList" :key="index">
          <a :href="'newscontent/' + item.id"
            ><img :src="item.newspicture" :title="item.title"
          /></a>
        </el-carousel-item>
      </el-carousel>
      <div class="morenewslink">
        <el-link
          type="primary"
          @click="shownews()"
          class="morelink"
          :underline="false"
          >>>>更多</el-link
        >
      </div>
      <div class="plate">
        <div class="lanmu1">
          <div class="lanmuname">
            <i class="el-icon-document-copy"></i>&emsp;&emsp;
            {{ lanmu1 }}
          </div>
          <div class="newstitle">
            <ul class="list">
              <li v-for="item in newslist1" :key="item.id">
                <router-link
                  :to="'/newscontent/' + item.id"
                  class="newstitle"
                  :title="item.title"
                >
                  {{ item.title | ellipsis }}&nbsp;&nbsp;&nbsp;
                  {{item.newssubmittime}}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="lanmu2">
          <div class="lanmuname">
            <i class="el-icon-reading"></i>&emsp;&emsp;
            {{ lanmu2 }}
          </div>
          <div class="newstitle">
            <ul class="list">
              <li v-for="item in newslist2" :key="item.id">
                <router-link
                  :to="'/newscontent/' + item.id"
                  class="newstitle"
                  :title="item.title"
                >
                  {{ item.title | ellipsis }}
                    &nbsp;&nbsp;&nbsp;
                  {{item.newssubmittime}}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="lanmu3">
          <div class="lanmuname">
            <i class="el-icon-office-building"></i>&emsp;&emsp;
            {{ lanmu3 }}
          </div>
          <div class="newstitle">
            <ul class="list">
              <li v-for="item in newslist3" :key="item.id">
                <router-link
                  :to="'/newscontent/' + item.id"
                  class="newstitle"
                  :title="item.title"
                >
                  {{ item.title | ellipsis }}&nbsp;&nbsp;&nbsp;
                  {{item.newssubmittime}}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="weblink">
        <table>
          <tr>
            <td>
              <a href="https://www.sina.com.cn/" target="_blank" name="新浪"
                ><img
                  src="https://ss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy/baike/s%3D600%3Bq%3D50/sign=3f03e26ca6c27d1ea12638c42beedc53/d62a6059252dd42ac3085163013b5bb5c8eab8f1.jpg"
                  alt=""
              /></a>
            </td>
            <td>
              <a
                href="http://www.chinanews.com.cn/world.shtml?0tnbl"
                target="_blank"
                name="中新网"
                ><img
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbkimg.cdn.bcebos.com%2Fpic%2F4e4a20a4462309f7ef0c29737e0e0cf3d7cad674&refer=http%3A%2F%2Fbkimg.cdn.bcebos.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651388813&t=da1d392b75f33be2019159cc602f6c45"
                  alt=""
              /></a>
            </td>
            <td>
              <a
                href="https://www.tencent.com/zh-cn/"
                target="_blank"
                name="腾讯"
                ><img
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F015df55ba9f13ba801213dea8f91dd.jpg%401280w_1l_2o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651388011&t=2faf592e62e6e38a4a432da07f0f5214"
                  alt=""
              /></a>
            </td>
            <td>
              <a href="https://www.baidu.com/" target="_blank" name="百度"
                ><img
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fstorage-public.zhaopin.cn%2Fuser%2Favatar%2F1583843473427893323%2F3b455a32-17d4-4e39-b5b6-fa04a88c36ed.jpg&refer=http%3A%2F%2Fstorage-public.zhaopin.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651388059&t=80f49321dc4253c4b27ee414953a5ed6"
                  alt=""
              /></a>
            </td>
            <td>
              <a href="https://www.163.com/" target="_blank" name="网易"
                ><img
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fx0.ifengimg.com%2Fucms%2F2021_22%2FC8520A093508F49903B78FC2384AA82AC12B1BE6_size107_w600_h338.png&refer=http%3A%2F%2Fx0.ifengimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651388102&t=7e4bacbfe98aec28729dceff85c06ebf"
                  alt=""
              /></a>
            </td>
          </tr>
          <tr>
            <td>
              <a href="http://www.xinhuanet.com/" target="_blank" name="新华网"
                ><img
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F03%2F36%2F70%2F5b8e0f395f6d8_610.jpg&refer=http%3A%2F%2Fpic.51yuansu.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651387800&t=d8c2fd4dcc075af5614ef99d4a6a5634"
                  alt=""
              /></a>
            </td>
            <td>
              <a href="https://www.ifeng.com/" target="_blank" name="凤凰网"
                ><img
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp2.itc.cn%2Fq_70%2Fimages03%2F20200604%2F0c4d7f279f3243dfa27e40dc8306c284.jpeg&refer=http%3A%2F%2Fp2.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651388129&t=9a0ce1a7a85f02ad8b9754124d9e4042"
                  alt=""
              /></a>
            </td>
            <td>
              <a href="https://www.cctv.com/" target="_blank" name="央视网"
                ><img
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbkimg.cdn.bcebos.com%2Fpic%2F9f510fb30f2442a74e568b6bdf43ad4bd01302a7&refer=http%3A%2F%2Fbkimg.cdn.bcebos.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651388170&t=47325a8cc2b93c3fd00e603270a00d04"
                  alt=""
              /></a>
            </td>
            <td>
              <a href="https://www.sohu.com/" target="_blank" name="搜狐"
                ><img
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimgslim.geekpark.net%2Fuploads%2Fimage%2Ffile%2F56%2Faa%2F56aab17fb83b7978350a7ef217811be1.png&refer=http%3A%2F%2Fimgslim.geekpark.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651388210&t=508fcc741d28f239718099cf47478255"
                  alt=""
              /></a>
            </td>
            <td>
              <a href="http://www.people.com.cn/" target="_blank" name="人民网"
                ><img
                  src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180118%2F24919cd3140b4286b9549e0b67765da8.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1651388276&t=adf940e6ddfb5b3292ef664bba7de9c6"
                  alt=""
              /></a>
            </td>
          </tr>
        </table>
      </div>
    </content>
    <footer>张菲 © 2022 版权所有</footer>
  </div>
</template>



<script>
export default {
  data() {
    return {
      dataList: [],
      timer: null,
      nowWeek: "",
      nowDate: "",
      nowTime: "",
      newslist1: [],
      newslist2: [],
      newslist3: [],
      lanmu1: "",
      lanmu2: "",
      lanmu3: "",
      state:false,
      show:"未登录",
    };
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 13) {
        return value.slice(0, 13) + "...";
      }
      return value;
    },
  },
  methods: {
    //跳转到登录页面
    goto() {
      this.$router.push("/Login");
    },
       teach() {
       if(this.state===false)
      {
          alert("用户未登录！请先登录")
      }
      else{
         this.$router.push({path:'/teachers'});
      }
    },
    knowlodge(){
            if(this.state===false)
      {
          alert("用户未登录！请先登录")
      }
      else{
         this.$router.push({path:'/resource'});
      }
    },
      zhenti() {
       if(this.state===false)
      {
          alert("用户未登录！请先登录")
      }
      else{
          this.$router.push({path:'/shijuan'})//编程式导航
      }
      },
      xianshi() {
               if(this.state===false)
      {
          alert("用户未登录！请先登录")
      }
      else{
           this.$router.push({path:'/chooseqtype'})//编程式导航
      }
      },
    back(){
      if(this.state===true&&window.sessionStorage.getItem('identity')==='admin')
      {
          this.$router.push({path:'/privatepage'})//编程式导航
      }
       else if(this.state===true&&window.sessionStorage.getItem('identity')==='user')
      {
          this.$router.push({path:'/uprivatepage'})//编程式导航
      }
          else if(this.state===true&&window.sessionStorage.getItem('identity')==='author')
      {
          this.$router.push({path:'/authorprivatepage'})//编程式导航
      }
          else if(this.state===false)
      {
          alert("用户未登录！请先登录")
      }
    },
    //跳转到整个新闻显示页面
    shownews() {
      this.$router.push("/showallnews");
    },
    // 显示当前时间
    setNowTimes() {
      let myDate = new Date();
      // console.log(myDate)
      let wk = myDate.getDay();
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
      let weeks = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      let week = weeks[wk];
      this.nowDate = yy + "-" + mm + "-" + dd;
      this.nowTime = hou + ":" + min + ":" + sec;
      this.nowWeek = week;

      if(window.sessionStorage.getItem('uid')!==null)
      {
        this.state=true,
        this.show="已登录"
      }
    },
    //获取1-10新闻列表
    requestData1() {
      this.$get("/api/news1").then(
        (response) => {
          console.log(response);
          //注意 用到this要注意this指向
          this.newslist1 = response.data.result;
        },
        (error) => {
          console.log(error);
        }
      );
    },
    //获取10-20新闻列表
    requestData2() {
      this.$get("/api/news2").then(
        (response) => {
          console.log(response);
          //注意 用到this要注意this指向
          this.newslist2 = response.data.result;
        },
        (error) => {
          console.log(error);
        }
      );
    },
    //获取20-30新闻列表
    requestData3() {
      this.$get("/api/news3").then(
        (response) => {
          console.log(response);
          //注意 用到this要注意this指向
          this.newslist3 = response.data.result;
        },
        (error) => {
          console.log(error);
        }
      );
    },
    //获取新闻图片
    requestpic() {
      this.$get("/api/newspic").then(
        (response) => {
          console.log(response);
          //注意 用到this要注意this指向
          this.dataList = response.data.result;
          console.log(response.data.result);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    //获取一栏目名
    requestlanmu1() {
      this.$get("/api/lanmu1").then(
        (response) => {
          console.log(response);
          //注意 用到this要注意this指向
          this.lanmu1 = response.data.result[0].lanmuName;
          console.log(response.data.result);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    requestlanmu2() {
      this.$get("/api/lanmu2").then(
        (response) => {
          console.log(response);
          //注意 用到this要注意this指向
          this.lanmu2 = response.data.result[0].lanmuName;
          console.log(response.data.result);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    requestlanmu3() {
      this.$get("/api/lanmu3").then(
        (response) => {
          console.log(response);
          //注意 用到this要注意this指向
          this.lanmu3 = response.data.result[0].lanmuName;
          console.log(response.data.result);
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
  mounted() {
    (this.timer = setInterval(() => {
      this.setNowTimes();
    }, 1000)),
      this.requestData1();
    this.requestData2();
    this.requestData3();
    this.requestpic();
    this.requestlanmu1();
    this.requestlanmu2();
    this.requestlanmu3();
  },
};
</script>










<style scoped>
.p1 {
  background-color: #681414;
  color: #d7ccb6;
  font-size: 12px;
  padding: 15px;
}
.p1 .link {
  float: right;
  color: #d7ccb6;
  margin-right: 20px;
  text-decoration: none;
}
.p1 .link:hover {
  text-decoration: none;
  font-size: 17px;
}
#btn{
  float: right;
}
header {
  min-height: 450px;
  background-color: #d7ccb6;
  position: relative;
  display: flex;
}
.head {
  width: 100%;
}
header img {
  height: 400px;
  width: 80%;
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 30px;
}
header h1 {
  float: left;
  position: relative;
  margin-left: 50px;
  width: 100%;
  font-family: Cambria;
}
header h2 {
  position: relative;
  margin-left: 200px;
  font-family: Cambria;
}
header .btn {
  position: relative;
  width: 100%;
  text-align: center;
  top: 200px;
}
.btn button {
  border: solid 3px #681414;
  color: #681414;
  width: 30%;
}
.btn button:hover {
  background-color: #681414;
  color: #d7ccb6;
}
.limit{
  margin-left: 10%;
}


content {
  flex: 1;
}
.el-carousel__item img {
  height: 400px;
  width: 640px;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.morenewslink {
  border-top: solid #681414;
  width: 100%;
  text-align: right;
}
.morelink {
  color: #681414;
  font-size: 20px;
}
.morelink:hover {
  color: #d7ccb6;
}
.plate {
  height: 500px;
  padding-top: 20px;
  background-color: #d7ccb6;
}
.lanmu1 {
  width: 30%;
  float: left;
  position: relative;
}
.lanmu2 {
  width: 30%;
  margin-left: 35%;
  position: absolute;
}
.lanmu3 {
  width: 30%;
  float: right;
  position: relative;
}
.lanmuname {
  height: 100px;
  border: dashed #681414;
  border-radius: 30px;
  font-size: 30px;
  color: #681414;
  font-family: Cambria;
}
.lanmuname i {
  margin: 40px;
  font-size: 30px;
  color: #681414;
}
.newstitle {
  color: #681414;
  text-decoration: none;
  line-height: 30px;
  width: 90%;
  font-size: 10px;
}
.newstitle li {
  list-style: none;
  border-bottom: solid #681414;
}
.newstitle:hover {
  color: white;
}
.weblink {
  background-color: #d7ccb6;
  height: 190px;
  padding: 10px;
}
.weblink img {
  width: 200px;
  height: 50px;
  margin: 20px;
}

footer {
  min-height: 50px;
  background-color: #681414;
  text-align: center;
}
</style>