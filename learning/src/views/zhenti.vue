<template>
  <div>
    <div class="head">
      <h2>{{ title }}</h2>
      <div class="btn">
        <el-button class="receipt" @click="receipt()">开始考试</el-button>
        <el-button class="send" @click="jiaojuan()" :disabled="state"
          >交卷</el-button
        >
        <el-button type="primary" @click="logout()" :disabled="state">退出</el-button>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <span>时间到，请交卷！</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="jiaojuan()">交卷</el-button>
        </span>
      </el-dialog>
    </div>
    <content class="content">
      <div class="timu">
        <!--单选-->
        <div class="danxuan">
          一、单项选择题：1～16小题，每小题1分，共16分。下列每题给出的四个选项中，只有一个选项是符合题目要求的。请在答题卡上将所选项的字母涂黑。
          <ul v-for="(item, i) in examinationData" :key="i">
            <div>{{ i + 1 }}、{{ item.qtitle }}</div>
            <el-radio-group v-model="radio[i]" @change="getIputValue(i)">
              <div class="anwser">
                <el-radio :label="'A'">{{ item.aA }}</el-radio>
              </div>
              <div class="anwser">
                <el-radio :label="'B'">{{ item.aB }}</el-radio>
              </div>
              <div class="anwser">
                <el-radio :label="'C'">{{ item.aC }}</el-radio>
              </div>
              <div class="anwser">
                <el-radio :label="'D'">{{ item.aD }}</el-radio>
              </div>
            </el-radio-group>
          </ul>
        </div>
        <!--多选-->
        <div class="duoxuan">
          多选(共{{ more_num }}题)(每题两分)
          二、多项选择题：17～33题，每小题2分，共34分。下列每题给出的四个选项中，至少有两个选项是符合题目要求的。请在答题卡上将所选项的字母涂黑。多选或少选均不得分。
          <el-card class="card">
            <div>{{ more_index + 17 }}、{{ more_qtitle }}</div>
            <el-checkbox-group
              v-model="more_checked"
              @change="getIputValue_more(more_index)"
            >
              <div class="anwser">
                <el-checkbox :label="'A'">{{ aA }}</el-checkbox>
              </div>
              <div class="anwser">
                <el-checkbox :label="'B'">{{ aB }}</el-checkbox>
              </div>
              <div class="anwser">
                <el-checkbox :label="'C'">{{ aC }}</el-checkbox>
              </div>
              <div class="anwser">
                <el-checkbox :label="'D'">{{ aD }}</el-checkbox>
              </div>
            </el-checkbox-group>
            <el-row :gutter="20">
              <!--返回上一题的按钮-->
              <el-col :span="12">
                <el-button @click="fontquestion()">上一题</el-button>
              </el-col>
              <!--提交多选答案的按钮-->
              <el-col :span="12">
                <el-button @click="nextquestion()" type="primary"
                  >提交</el-button
                >
              </el-col>
            </el-row>
          </el-card>
        </div>
        <!--简答题-->
        <div class="jianda">
          三、分析题：34～38小题，每小题10分，共50分。要求结合所学知识分析材料并回答问题。将答案写在答题纸指定位置上。
          <ul v-for="(item, i) in textcontentlist" :key="i" class="text">
            <div>{{ i + 34 }}、<div v-html="item.textcontent"></div></div>
            <el-input
              v-model="text_input[i]"
              placeholder="请输入内容"
              class="textanwser"
              type="textarea"
              
            ></el-input>
          </ul>
        </div>
      </div>
      <div class="list">
        <el-row>
       <div class="time">{{ str }}</div>
        </el-row>
        <el-row class="icons">
          <div>单选</div>
          <div class="ul" style="flex-wrap: wrap">
            <ul v-for="(item, i) in examinationData" :key="i" class="icon">
              <el-button class="iconcss">{{ radio[i]}}</el-button>
            </ul>
          </div>
        </el-row>
        <el-row class="icons">
          <div>多选</div>
          <div class="ul" style="flex-wrap: wrap">
            <ul v-for="(item, i) in more_list" :key="i" class="icon">
              <el-button class="iconcss" :type="changeicon2[i]">{{
                i + 1
              }}</el-button>
            </ul>
          </div>
        </el-row>
      </div>
    </content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      state: false,
      //单选数据
      id: this.$route.params.id, //试卷编号
      list: [],
      title: "",
      count: 0, //单选题得分
      num: 0,
      anwser: [],
      examinationData: [],
      allRadio: [], //提交给后台的真题数据
      radio: [], //单选真题答案
      form: {
        uid: "",
        counts: "", //试卷客观题总分
        testname: "",
        examid: "",
      },
      //多选数据
      more_index: 0, //多选题题目编号
      more_checked: [], //多选题答案
      more_qtitle: "", //多选题目
      more_list: [], //多选题题库数据
      aA: "",
      aB: "",
      aC: "",
      aD: "",
      more_num: "", //多选题目总数
      moreanwser: [], //多选的正确答案
      more_allcheck: [], //多选题所有做的题目数组，如做了三道题more_allradio[[ABC],[AD],[AC]]
      more_nextcord: [], //存储所作题目的对与错
      cordid: "",
      morecount: 0, //多选题得分
      more_compare: [],
      //简答题数据设置
      text_input: [], //用户的答案
      textcontentlist: [],
      text_index: 0,
      form_text: {
        t_id: "",
        content: "",
        uid: "",
        e_id: "",
      },
      text_num: "",
      //定时器设置
      rptType: true, //状态
      h: 0, //定义时，分，秒，毫秒并初始化为0；
      m: 0,
      ms: 0,
      s: 0,
      time: 0,
      str: "00:00:00",
      dialogVisible: false,
      //按钮设置
      changeicon2: [],
    };
  },
  created() {
    this.requestData();
    this.requestData_more();
    this.requestData_text();
  },
  methods: {
    //退出答题界面
    logout() {
      this.$router.go(-1);
    },
    //获取单选题目
    requestData() {
      let id = this.id;
      console.log(id);
      this.$get("/api/exams_id", { id }).then(
        (response) => {
          console.log(response);
          this.list = response.data;
          this.title = this.list[0].examname;
          this.examinationData = response.data;
        },
        (error) => {
          console.log(error);
        }
      );
    },
    //

    //点击单选按钮触发事件并计算分数
    getIputValue(index) {
      console.log(index + 1 + "题" + this.radio[index]);
      this.allRadio[index] = this.radio[index]; // 将数据存入提交给后台的数据中
      if (this.allRadio[index] === this.examinationData[index].anwser) {
        this.anwser[index] = this.examinationData[index].anwser;
        this.count = this.count + this.examinationData[index].score;
        // console.log('点到正确答案：   '+this.count)
      } else if (
        this.anwser[index] !== undefined &&
        this.anwser[index] === this.allRadio[index]
      ) {
        this.count += 0;
        //   console.log('点到正确答案：   '+this.count)
      } else if (
        this.anwser[index] !== undefined &&
        this.anwser[index] !== "E" &&
        this.anwser[index] !== this.allRadio[index]
      ) {
        this.count = this.count - this.examinationData[index].score;
        //   console.log('点到错误答案：   '+this.count)
        this.anwser[index] = "E";
      } else if (
        this.anwser[index] === "E" &&
        this.anwser[index] !== this.allRadio[index]
      ) {
        this.count = this.count + 0;
        //   console.log('点到错误答案：   '+this.count)
      } else {
        this.count += 0;
        //  console.log('点到错误答案：   '+this.count)
      }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //获取多选题目
    requestData_more() {
      let id = this.id;
      this.$get("/api/exams_more_id", { id }).then(
        (response) => {
          // console.log(response)
          this.more_list = response.data.results;
          this.more_qtitle = this.more_list[this.more_index].qtitle;
          this.aA = this.more_list[this.more_index].aA;
          this.aB = this.more_list[this.more_index].aB;
          this.aC = this.more_list[this.more_index].aC;
          this.aD = this.more_list[this.more_index].aD;
          this.more_num = response.data.num;
          this.moreanwser = this.more_list[this.more_index].anwser;
        },
        (error) => {
          console.log(error);
        }
      );
    },
    //勾选复选框触发的事件
    getIputValue_more(more_index) {
      console.log(
        "题目编号和答案：    " + (more_index + 1) + "题" + this.more_checked
      );
      this.more_allcheck[more_index] = this.more_checked;
      console.log(
        "第一题答案：" +
          this.more_allcheck[0] +
          "第二题答案：" +
          this.more_allcheck[1] +
          "第三题答案：" +
          this.more_allcheck[2] +
          "第四题答案：" +
          this.more_allcheck[3]
      );
      this.changeicon2[more_index] = "primary";
    },
    //点击上一题事件
    fontquestion() {
      this.changeicon2[this.more_index] = "";
      this.changeicon2[this.more_index - 1] = "";
      let i,
        count = 0;
      this.more_checked = [];
      if (this.more_index === 0) {
        this.more_index += 0;
        return this.$message.error("前面没有题了！");
      } else {
        this.more_index--;
      }
      if (this.more_nextcord[this.cordid - 1] !== null) {
        this.cordid--;
        this.more_nextcord.length -= 1;
      }
      this.requestData_more();
      for (i = 0; i < this.cordid; i++) {
        if (this.more_nextcord[i] === "true") count++;
      }
      this.morecount = count * this.more_list[this.more_index].score;
      console.log("对错记录：" + this.more_nextcord);
      console.log("向上得分 :  " + this.morecount);
    },
    //点击下一题事件
    nextquestion() {
      if (this.more_index + 1 === this.more_num) {
        this.more_index += 0;
        this.judgescore();
        return this.$message.error("后面没有题了！");
      } else {
        this.judgescore();
        this.more_index++;
        this.requestData_more();
        this.more_checked = [];
      }
    },
    //判断多选得分
    judgescore() {
      var i,
        j,
        k = 0,
        count = 0;
      //判断得分
      for (i = 0; i < this.moreanwser.length; i++) {
        for (j = 0; j < this.more_checked.length; j++) {
          if (this.more_checked[j] === this.moreanwser[i]) {
            this.more_compare[k] = this.moreanwser[i];
            k += 1;
          }
        }
      }
      for (i = 0; i < this.moreanwser.length; i++) {
        if (
          this.more_compare[i] !== this.moreanwser[i] ||
          this.more_checked.length > this.moreanwser.length
        ) {
          this.cordid = this.more_index + 1;
          this.more_nextcord[this.cordid - 1] = "false";
          break;
        } else if (i === this.moreanwser.length - 1) {
          this.cordid = this.more_index + 1;
          this.more_nextcord[this.cordid - 1] = "true";
          break;
        }
      }
      this.more_compare = [];
      console.log(this.cordid);
      for (i = 0; i < this.cordid; i++) {
        if (this.more_nextcord[i] === "true") count++;
      }
      this.morecount = count * this.more_list[this.more_index].score;
      console.log("对错记录：" + this.more_nextcord);
      console.log("得分 :  " + this.morecount);
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //获取简答题材料
    requestData_text() {
      let id = this.id;
      this.$get("/api/exams_text_id", { id }).then(
        (response) => {
          console.log("简答题材料");
          console.log(response);
          this.textcontentlist = response.data.result;
          this.text_title = this.textcontentlist[0].textcontent;
          this.text_num = response.data.num;
        },
        (error) => {
          console.log(error);
        }
      );
      if (this.dialogVisible === true) {
        let i;
        for (i = 0; i < this.text_num; i++) {
          this.Infotextanwser(i);
        }
      }
    },
    //提交主观题
    async Infotextanwser(t_id) {
      (this.form_text.t_id = t_id + 1),
        (this.form_text.content = this.text_input[t_id]);
      this.form_text.uid = window.sessionStorage.getItem("uid");
      this.form_text.e_id = this.id;
      console.log(this.form_text);
      await this.$post("/api/addtextanwser", this.form_text)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //交卷计算客观题总分
    countscore() {
      this.form.uid = window.sessionStorage.getItem("uid");
      this.form.counts = this.count + this.morecount;
      this.form.testname = this.title;
      this.form.examid = this.id;
      window.sessionStorage.setItem("examid", this.id);
      this.$post("/api/addscore", this.form).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //定时器设置
    getTask(e) {
      this.taskType = e;
    },
    //开始
    receipt() {
      this.state = true;
      this.radio = [];
      this.more_checked = [];
      this.more_index = 0;
      this.text_input = [];
      this.changeicon2 = [];
      this.count = 0;
      this.morecount = 0;
      this.time = setInterval(this.timer, 50);
    },
    timer() {
      //定义计时函数
      this.ms = this.ms + 50; //毫秒
      if (this.ms >= 1000) {
        this.ms = 0;
        this.s = this.s + 1; //秒
      }
      if (this.s >= 60) {
        this.s = 0;
        this.m = this.m + 1; //分钟
      }
      if (this.m >= 60) {
        this.m = 0;
        this.h = this.h + 1; //小时
      }
      this.str =
        this.toDub(this.h) +
        ":" +
        this.toDub(this.m) +
        ":" +
        this.toDub(this.s) +
        "";
      if (this.s === 3) {
        this.dialogVisible = true;
        this.rptType = true;
        clearInterval(this.time);
        this.str = "00:00:00";
      }
    },
    toDub(n) {
      //补0操作
      if (n < 10) {
        return "0" + n;
      } else {
        return "" + n;
      }
    },
    jiaojuan() {
      let i;
      this.countscore();
      console.log("简答题个数：" + this.text_input.length);
      console.log(this.text_input);
      for (i = 0; i < this.text_num; i++) {
        this.Infotextanwser(i);
      }
      this.$router.push({ path: "/showscore" });
    },
  },
};
</script>

<style lang="scss" scoped>
.head {
  height: 100px;
  padding-top:0px;
  background-color: #681414;
}
h2{
  float: left;
}
.btn {
  margin-top: 30px;
  float: right;
}
.time {
  margin: 20px auto;
  position: relative;
  font-size: 30px;
  text-align: center;
}
.content {
  background-color: antiquewhite;
}
.timu {
  width: 70%;
  position: absolute;
  background-color: #d7ccb6;
}
.danxuan {
  width: 100%;
  padding-bottom: 15px;
  word-break: normal;
}
.duoxuan {
  width: 100%;
  padding-bottom: 15px;
  word-break: normal;
}
.card {
  width: 90%;
  margin-left: 40px;
}
.anwser .el-radio{
  margin-top: 15px;
  margin-bottom: 15px;
  font-size: 15px;
  width: 100% !important;
  text-overflow: ellipsis;
  white-space: normal;
}
.anwser .el-checkbox{
  margin-top: 15px;
  margin-bottom: 15px;
  width: 100% !important;
  text-overflow: ellipsis;
  white-space: normal;
  display: flex;
}
.jianda {
  width: 100%;
  padding-bottom: 15px;
  word-break: normal;
}
.textanwser {
  width: 95%;
}
.list {
  width: 30%;
  height: 100%;
  float: right;
}
.ul {
  display: flex;
}
.iconcss {
  width: 50px;
  height: 40px;
}
</style>
