<template>
  <div>
    <h3>修改</h3>
    <div class="single">
      单选
      <el-card>
        <el-button type="success" @click="dialogVisible = true"
          >添加单选</el-button
        >
        <el-table :data="singlelist" border stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="题目" prop="qtitle"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--scope数据插槽-->
              <!--删除按钮-->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removesingleById(scope.row.id)"
              ></el-button>
              <!--修改按钮-->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showchangesingleById(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div class="multiple">
      多选
      <el-card>
        <el-button type="success" @click="dialogVisible1 = true"
          >添加多选</el-button
        >
        <el-table :data="multiplelist" border stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="题目" prop="qtitle"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--scope数据插槽-->
              <!--删除按钮-->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removemultipleById(scope.row.id)"
              ></el-button>
              <!--删除按钮-->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showchangemultipleById(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div class="material">
      材料题
      <el-card>
        <el-button type="success" @click="dialogVisible2 = true"
          >添加材料题</el-button
        >
        <el-table :data="materiallist" border stripe>
          <el-table-column label="#" type="index"></el-table-column>

          <el-table-column
            label="题目"
            prop="textcontent"
            class="text"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--scope数据插槽-->
              <!--删除按钮-->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removematerialById(scope.row.Materialid)"
              ></el-button>
              <!--修改按钮-->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showchangematerialById(scope.row.Materialid)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 添加单选 -->
    <el-dialog :visible.sync="dialogVisible" width="70%">
      <h2>添加单选</h2>
      <el-form>
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
        <el-form-item label="答案" label-width="150px" prop="singleanwser">
          <el-select v-model="formsingle.region" placeholder="请选择正确答案">
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
            <el-option label="D" value="D"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button class="addsingle" @click="addsingle()" type="primary"
          >添加单选</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加多选 -->
    <el-dialog title="提示" :visible.sync="dialogVisible1" width="70%">
      <el-form>
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button class="addmore" @click="addmore()" type="primary"
          >添加多选</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加材料题 -->
    <el-dialog title="提示" :visible.sync="dialogVisible2" width="70%">
      <el-form>
        <h2>添加简答题</h2>
        <el-form-item label="简答题材料+题目" label-width="150px">
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
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button class="addtext" @click="addtext()" type="primary"
          >添加简答题</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改单选 -->
    <el-dialog title="提示" :visible.sync="dialogVisible3" width="70%">
      <h2>修改单选</h2>
      <el-form>
        <el-form-item label="单选题目" label-width="150px">
          <el-input
            v-model="formchangesingle.query_singlename"
            class="query_singlename"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="A选项" label-width="150px">
          <el-input
            v-model="formchangesingle.query_A"
            class="query_A"
            placeholder="格式:A.XXX"
          ></el-input>
        </el-form-item>

        <el-form-item label="B选项" label-width="150px">
          <el-input
            v-model="formchangesingle.query_B"
            class="query_B"
            placeholder="格式:B.XXX"
          ></el-input>
        </el-form-item>
        <el-form-item label="C选项" label-width="150px">
          <el-input
            v-model="formchangesingle.query_C"
            class="query_C"
            placeholder="格式:C.XXX"
          ></el-input>
        </el-form-item>
        <el-form-item label="D选项" label-width="150px">
          <el-input
            v-model="formchangesingle.query_D"
            class="query_D"
            placeholder="格式:D.XXX"
          ></el-input>
        </el-form-item>
        <el-form-item label="答案" label-width="150px">
          <el-select
            v-model="formchangesingle.region"
            placeholder="请选择正确答案"
          >
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
            <el-option label="D" value="D"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加解析" label-width="150px">
          <el-input
              type="textarea"
            v-model="formchangesingle.analysis"
            class="analysis"
            placeholder="填写该题解析"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="changesingleById()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改多选 -->
    <el-dialog title="提示" :visible.sync="dialogVisible4" width="70%">
      <el-form>
        <h2>修改多选</h2>
        <el-form-item label="多选题目" label-width="150px">
          <el-input
            v-model="formchangemore.query_morename"
            class="query_morename"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="A选项" label-width="150px">
          <el-input
            v-model="formchangemore.query_As"
            class="query_As"
            placeholder="格式:A.XXX"
          ></el-input>
        </el-form-item>

        <el-form-item label="B选项" label-width="150px">
          <el-input
            v-model="formchangemore.query_Bs"
            class="query_Bs"
            placeholder="格式:B.XXX"
          ></el-input>
        </el-form-item>
        <el-form-item label="C选项" label-width="150px">
          <el-input
            v-model="formchangemore.query_Cs"
            class="query_Cs"
            placeholder="格式:C.XXX"
          ></el-input>
        </el-form-item>
        <el-form-item label="D选项" label-width="150px">
          <el-input
            v-model="formchangemore.query_Ds"
            class="query_Ds"
            placeholder="格式:D.XXX"
          ></el-input>
        </el-form-item>
        <el-form-item label="输入正确答案" label-width="150px">
          <el-input
            placeholder="格式:ABCD(无空格)"
            v-model="formchangemore.moreregion"
          ></el-input>
        </el-form-item>
               <el-form-item label="添加解析" label-width="150px">
          <el-input
              type="textarea"
            v-model="formchangemore.analysis"
            class="analysis"
            placeholder="填写该题解析"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible4 = false">取 消</el-button>
        <el-button type="primary" @click="changemultipleById()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改材料题 -->
    <el-dialog title="提示" :visible.sync="dialogVisible5" width="70%">
      <el-form>
        <h2>修改材料题</h2>
        <el-form-item label="简答题材料+题目" label-width="150px">
          <quill-editor v-model="formchangetext.query_text" class="query_text">
          </quill-editor>
        </el-form-item>
          <el-form-item label="答案" label-width="150px">
          <el-input
          type="textarea"
            v-model="formchangetext.anwser"
            class="anwser"
            placeholder="请输入材料题答案"
          ></el-input>
        </el-form-item>
               <el-form-item label="添加解析" label-width="150px">
          <el-input
            type="textarea"
            v-model="formchangetext.analysis"
            class="analysis"
            placeholder="填写该题解析"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible5 = false">取 消</el-button>
        <el-button type="primary" @click="changematerialById()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      examid: this.$route.params.id,
      singleid: "",
      multipleid: "",
      materialid: "",
      singlelist: [],
      multiplelist: [],
      materiallist: [],
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,

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
      formchangesingle: {
        query_singlename: "",
        query_A: "",
        query_B: "",
        query_C: "",
        query_D: "",
        region: "",
        analysis: "",
        examidsingle: this.$route.params.id,
        id: "",
      },
      formchangemore: {
        query_morename: "",
        query_As: "",
        query_Bs: "",
        query_Cs: "",
        query_Ds: "",
        moreregion: "",
         analysis: "",
        examidmore: this.$route.params.id,
        id: "",
      },
      formchangetext: {
        query_text: "",
        analysis:"",
              anwser:"",
        examidtext: this.$route.params.id,
        textid: "",
      },
    };
  },
  mounted() {
    this.getSingle(), this.getMultiple(), this.getMaterial();
  },
  methods: {
    getSingle() {
      let id = this.examid;
      this.$get("/api/siglelist", { id })
        .then((response) => {
          this.singlelist = response.data.result;
          console.log(this.singlelist);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getMultiple() {
      let id = this.examid;
      this.$get("/api/multiplelist", { id })
        .then((response) => {
          this.multiplelist = response.data.result;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getMaterial() {
      let id = this.examid;
      this.$get("/api/materiallist", { id })
        .then((response) => {
          this.materiallist = response.data.result;
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //删除单选
    async removesingleById(id) {
      console.log(id);
      //弹框询问
      const confirmResult = await this.$confirm(
        "此操作将永久删除该题, 是否继续?",
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

      await this.$get("/api/removesingle", { id }).then((res) => {
        if (res.data.code !== 200) {
          return this.$message.error("删除题目失败");
        }
      });
      this.$message.success("删除成功");
      this.getSingle();
      // console.log('确认删除')
    },
    //删除多选
    async removemultipleById(id) {
      console.log(id);
      //弹框询问
      const confirmResult = await this.$confirm(
        "此操作将永久删除该题, 是否继续?",
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

      await this.$get("/api/removemultiple", { id }).then((res) => {
        if (res.data.code !== 200) {
          return this.$message.error("删除题目失败");
        }
      });
      this.$message.success("删除成功");
      this.getMultiple();
      // console.log('确认删除')
    },
    //删除材料题
    async removematerialById(id) {
      console.log(id);
      //弹框询问
      const confirmResult = await this.$confirm(
        "此操作将永久删除该题, 是否继续?",
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

      await this.$get("/api/removematerial", { id }).then((res) => {
        if (res.data.code !== 200) {
          return this.$message.error("删除题目失败");
        }
      });
      this.$message.success("删除成功");
      this.getMaterial();
      // console.log('确认删除')
    },
    //添加单选
    addsingle() {
      this.dialogVisible = false;
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
      this.getSingle();
    },
    //添加多选
    addmore() {
      this.dialogVisible1 = false;
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

      this.getMultiple();
    },
    //添加简答题
    addtext() {
      this.dialogVisible2 = false;
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
      this.getMaterial();
    },
    //修改单选
    showchangesingleById(id) {
      console.log(id);
      this.dialogVisible3 = true;
      this.$get("/api/getsigle", { id })
        .then((response) => {
          console.log(response);
          this.formchangesingle.query_singlename =
            response.data.result[0].qtitle;
          this.formchangesingle.query_A = response.data.result[0].aA;
          this.formchangesingle.query_B = response.data.result[0].aB;
          this.formchangesingle.query_C = response.data.result[0].aC;
          this.formchangesingle.query_D = response.data.result[0].aD;
          this.formchangesingle.region = response.data.result[0].anwser;
          this.formchangesingle.analysis = response.data.result[0].analysis;
        })
        .catch((error) => {
          console.log(error);
        });
      this.singleid = id;
    },
    changesingleById() {
      console.log(this.singleid);
      this.dialogVisible3 = false;
      this.formchangesingle.id = this.singleid;
      this.$post("/api/changesingle", this.formchangesingle).then(
        (response) => {
          console.log(response);
          this.singleindex += 1;
          alert("修改成功");
        },
        (error) => {
          console.log(error);
        }
      );
      this.getSingle();
    },
    //修改多选
    showchangemultipleById(id) {
      console.log(id);
      this.dialogVisible4 = true;
      this.$get("/api/getmultiple", { id })
        .then((response) => {
          console.log(response);
          this.formchangemore.query_morename = response.data.result[0].qtitle;
          this.formchangemore.query_As = response.data.result[0].aA;
          this.formchangemore.query_Bs = response.data.result[0].aB;
          this.formchangemore.query_Cs = response.data.result[0].aC;
          this.formchangemore.query_Ds = response.data.result[0].aD;
          this.formchangemore.moreregion = response.data.result[0].anwser;
          this.formchangemore.analysis = response.data.result[0].analysis;
        })
        .catch((error) => {
          console.log(error);
        });
      this.multipleid = id;
    },
    changemultipleById() {
      console.log(this.multipleid);
      this.dialogVisible4 = false;
      this.formchangemore.id = this.multipleid;
      this.$post("/api/changemore", this.formchangemore).then(
        (response) => {
          console.log(response);
          this.moreindex += 1;
          alert("修改成功");
        },
        (error) => {
          console.log(error);
        }
      );

      this.getMultiple();
    },
    //修改材料题
    showchangematerialById(id) {
      console.log(id);
      this.dialogVisible5 = true;
      this.$get("/api/getmaterial", { id })
        .then((response) => {
          console.log(response);
          this.formchangetext.query_text = response.data.result[0].textcontent;
          this.formchangetext.analysis = response.data.result[0].analysis;
           this.formchangetext.anwser = response.data.result[0].anwser;
        })
        .catch((error) => {
          console.log(error);
        });
      this.materialid = id;
    },
    changematerialById() {
      console.log(this.materialid);
      this.dialogVisible5 = false;
      this.formchangetext.textid = this.materialid;
      this.$post("/api/changetext", this.formchangetext).then(
        (response) => {
          console.log(response);
          this.textindex += 1;
          alert("修改成功");
        },
        (error) => {
          console.log(error);
        }
      );
      this.getMaterial();
    },
  },
};
</script>

<style scoped>
.out {
  float: right;
}
</style>