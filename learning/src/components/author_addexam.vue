<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome1' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考试管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加试卷</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form class="form" :rules="rules">
        <el-form-item label="试卷名" label-width="150px" prop="examname">
          <el-input
            v-model="form.query_examname"
            class="query_examname"
          ></el-input>
          <el-button class="finish" @click="finish()" type="success"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
      <el-form>
        <!--单选-->
        <h2>添加单选</h2>
        <el-form-item label="单选题目" label-width="150px">
          <el-input
            v-model="formsingle.query_singlename"
            class="query_singlename"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="A选项" label-width="150px">
          <el-input
            v-model="formsingle.query_A"
            class="query_A"
            placeholder="格式:A.XXX"
          ></el-input>
        </el-form-item>

        <el-form-item label="B选项" label-width="150px">
          <el-input
            v-model="formsingle.query_B"
            class="query_B"
            placeholder="格式:B.XXX"
          ></el-input>
        </el-form-item>
        <el-form-item label="C选项" label-width="150px">
          <el-input
            v-model="formsingle.query_C"
            class="query_C"
            placeholder="格式:C.XXX"
          ></el-input>
        </el-form-item>
        <el-form-item label="D选项" label-width="150px">
          <el-input
            v-model="formsingle.query_D"
            class="query_D"
            placeholder="格式:D.XXX"
          ></el-input>
        </el-form-item>
        <el-form-item label="答案" label-width="150px">
          <el-select v-model="formsingle.region" placeholder="请选择正确答案">
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
            <el-option label="D" value="D"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="150px">
          <el-button class="addsingle" @click="addsingle()" type="primary"
            >添加单选</el-button
          >
          添加了{{ this.singleindex }}题单选
        </el-form-item>

        <!--多选-->
        <h2>添加多选</h2>
        <el-form-item label="多选题目" label-width="150px">
          <el-input
            v-model="formmore.query_morename"
            class="query_morename"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="A选项" label-width="150px">
          <el-input
            v-model="formmore.query_As"
            class="query_As"
            placeholder="格式:A.XXX"
          ></el-input>
        </el-form-item>

        <el-form-item label="B选项" label-width="150px">
          <el-input
            v-model="formmore.query_Bs"
            class="query_Bs"
            placeholder="格式:B.XXX"
          ></el-input>
        </el-form-item>
        <el-form-item label="C选项" label-width="150px">
          <el-input
            v-model="formmore.query_Cs"
            class="query_Cs"
            placeholder="格式:C.XXX"
          ></el-input>
        </el-form-item>
        <el-form-item label="D选项" label-width="150px">
          <el-input
            v-model="formmore.query_Ds"
            class="query_Ds"
            placeholder="格式:D.XXX"
          ></el-input>
        </el-form-item>
        <el-form-item label="输入正确答案" label-width="150px">
          <el-input
            placeholder="格式:ABCD(无空格)"
            v-model="formmore.moreregion"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="150px">
          <el-button class="addmore" @click="addmore()" type="primary"
            >添加多选</el-button
          >
          添加了{{ this.moreindex }}题多选
        </el-form-item>

        <!--简答-->
        <h2>添加简答题</h2>
        <el-form-item label="材料+题目" label-width="150px">
          <!-- <el-input v-model="formtext.query_text" class="query_text" type="textarea"></el-input> -->
          <quill-editor v-model="formtext.query_text" class="query_text">
          </quill-editor>
        </el-form-item>
                       <el-form-item label="答案" label-width="150px">
          <el-input
          type="textarea"
            v-model="formtext.anwser"
            class="anwser"
            placeholder="请输入材料题答案"
          ></el-input>
        </el-form-item>
        <el-form-item label-width="150px">
          <el-button class="addtext" @click="addtext()" type="primary"
            >添加简答题</el-button
          >
          添加了{{ this.textindex }}题简答题
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        query_examname: "",
      },
      formsingle: {
        query_singlename: "",
        query_A: "",
        query_B: "",
        query_C: "",
        query_D: "",
        region: "",
        examidsingle: "",
      },
      singleindex: 0, //记录单选题个数
      formmore: {
        query_morename: "",
        query_As: "",
        query_Bs: "",
        query_Cs: "",
        query_Ds: "",
        moreregion: "",
        examidmore: "",
      },

      moreindex: 0, //记录多选题个数
      formtext: {
        query_text: "",
        examidtext: "",
        anwser:"",
        textid: "",
      },
      textindex: 0, //记录简答题个数
      examid: "",
      //校验规则
      rules: {
        examname: [
          { required: true, message: "请输入试卷名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //添加单选
    addsingle() {
      if (this.examid === 0 || this.examid === "") {
        alert("请先填写并添加试卷名");
      } else {
        this.formsingle.examidsingle = this.examid;
        this.$post("/api/addsingle", this.formsingle).then(
          (response) => {
            console.log(response);
            this.singleindex += 1;
            alert("添加成功");
          },
          (error) => {
            console.log(error);
          }
        );
      }
    },
    //添加多选
    addmore() {
      if (this.examid === 0 || this.examid === "") {
        alert("请先填写并添加试卷名");
      } else {
        this.formmore.examidmore = this.examid;
        this.$post("/api/addmore", this.formmore).then(
          (response) => {
            console.log(response);
            this.moreindex += 1;
            alert("添加成功");
          },
          (error) => {
            console.log(error);
          }
        );
      }
    },
    //添加简答题
    addtext() {
      if (this.examid === 0 || this.examid === "") {
        alert("请先填写并添加试卷名");
      } else {
        this.formtext.examidtext = this.examid;
        this.$post("/api/addtext", this.formtext).then(
          (response) => {
            console.log(response);
            this.textindex += 1;
            alert("添加成功");
          },
          (error) => {
            console.log(error);
          }
        );
      }
    },
    //完成组卷,添加试卷
    finish() {
      if (this.form.query_examname === "") {
        alert("请先填写并添加试卷名");
      } else {
        this.$post("/api/finishaddexam", this.form).then(
          (response) => {
            this.examid = response.data.result.insertId;
            alert("成功添加试卷")
          },
          (error) => {
            console.log(error);
          }
        );
      }
    },
  },
};
</script>

<style scoped>
.finish {
  margin-top: 5px;
}
</style>
