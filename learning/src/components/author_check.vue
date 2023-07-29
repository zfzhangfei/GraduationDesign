<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考试管理</el-breadcrumb-item>
      <el-breadcrumb-item>批改试卷</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card class="box-card">
      <!--用户列表-->
      <el-table :data="anwserlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="试卷" prop="examname"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <!--scope数据插槽-->
            <!--修改按钮-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showedit(scope.row.examid, scope.row.uid)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="主观题分数" prop="minescore"></el-table-column>
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
      <!--打分页面-->
      <el-dialog
        title="简答题打分页面"
        :visible.sync="dialogVisible"
        width="70%"
      >
        <div>
          <ul v-for="(item, i) in textcontentlist" :key="i" class="text">
            <div>
              {{ i + 34 }}、
              <div v-html="item.textcontent"></div>
            </div>
          </ul>
          答案：
          <ul v-for="(son, j) in textanwser" :key="j + 'a'" class="anwser">
            <div>
              第{{ j + 34 }}大题、
              <div style="white-space: pre-wrap; word-break: break-all">
                {{ son.textanwser }}
              </div>
            </div>
          </ul>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-input
            type="textarea"
            v-model="form.comment"
            placeholder="请填写评语"
          >
          </el-input>
          <el-input v-model="form.have_score" class="have_score"></el-input>
          <el-button type="primary" @click="givescore()">打分</el-button>
        </div>
      </el-dialog>
      <el-dialog
  title="提示"
  :visible.sync="scoredialogVisible"
  width="30%">
  <span>试卷已打分，请选择其他试卷</span>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="scoredialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
    </el-card>
  </div>
</template>



<script>
export default {
  data() {
    return {
      queryInfo: {
        //当前页数
        pagenum: 1,
        //当前每页显示条数
        pagesize: 5,
      },
      anwserlist: [],
      total: 0,
      //控制添加用户对话框的显示与隐藏
      dialogVisible: false,
      scoredialogVisible:false,
      form: {
        have_score: "",
        comment: "",
        examid: "",
        uid: "",
      },
      textcontentlist: [],
      textanwser: [],
      form1: {
        uid: "",
        examkeepid: "",
      },
      showscore: "",
    };
  },

  //创建函数
  created() {
    this.getanwserList();
    // this.requestData_text()
  },
  methods: {
    //获取用户列表
    getanwserList() {
      this.$get("/api/anwserlist", this.queryInfo)
        .then((response) => {
          this.anwserlist = response.data.results;
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
      this.getanwserList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getanwserList();
    },
    showedit(i, j) {
      this.form.have_score = "";
      this.form.comment = "";
      this.form1.uid = j;
      this.form1.examkeepid = i;
      this.form.examid = i;
      this.form.uid = j;
      let id = i;
     this.$get("/api/isscore", this.form1).then(
        (response) => {
          console.log("测试");
          console.log(response);
          if(response.data.msg===1)
          {
            this.scoredialogVisible=true;
          }else{
                 this.dialogVisible = true;
                  this.$get("/api/exams_text_id", { id }).then(
        (response) => {
          console.log("简答题材料");
          console.log(response.data);
          this.textcontentlist = response.data.result;
        },
        (error) => {
          console.log(error);
        }
      );

      this.$get("/api/exams_text_anwser", this.form1).then(
        (response) => {
          console.log("简答题答案");
          console.log(response.data);
          //  this.textanwser = response.data;
          for (let count = 0; count < response.data.length; count++) {
            if (response.data[count].textanwser === "undefined") {
              //  console.log(response.data[count].textanwser)
              this.textanwser[count] = " ";
            } else {
              //  console.log(response.data[count].textanwser)
              this.textanwser[count] = response.data[count];
            }
            this.textanwser = response.data;
          }
        },
        (error) => {
          console.log(error);
        }
      );
          }
        },
        (error) => {
          console.log(error);
        }
      );
      // this.$get("/api/exams_text_id", { id }).then(
      //   (response) => {
      //     console.log("简答题材料");
      //     console.log(response.data);
      //     this.textcontentlist = response.data.result;
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );

      // this.$get("/api/exams_text_anwser", this.form1).then(
      //   (response) => {
      //     console.log("简答题答案");
      //     console.log(response.data);
      //     //  this.textanwser = response.data;
      //     for (let count = 0; count < response.data.length; count++) {
      //       if (response.data[count].textanwser === "undefined") {
      //         //  console.log(response.data[count].textanwser)
      //         this.textanwser[count] = " ";
      //       } else {
      //         //  console.log(response.data[count].textanwser)
      //         this.textanwser[count] = response.data[count];
      //       }
      //       this.textanwser = response.data;
      //     }
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
    },

    givescore() {
      this.$post("/api/givetextscore", this.form).then(
        (response) => {
          console.log("打分");
          console.log(response.data);
          this.showscore = this.form.have_score;
        },
        (error) => {
          console.log(error);
        }
      );
      alert("打分成功！");
      this.getanwserList();
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped>
.have_score {
  width: 100px;
}
</style>
