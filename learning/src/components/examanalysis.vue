<template>
  <div>
    <div class="single">
      单选
      <el-card>
        <el-table :data="singlelist" border stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="题目" prop="qtitle"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--修改按钮-->
              <el-button
                type="primary"
                size="mini"
                @click="showchangesingleById(scope.row.id)"
              >解析</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div class="multiple">
      多选
      <el-card>
        <el-table :data="multiplelist" border stripe>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="题目" prop="qtitle"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--scope数据插槽-->
              <!--删除按钮-->
              <el-button
                type="primary"
                size="mini"
                @click="showchangemultipleById(scope.row.id)"
              >解析</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div class="material">
      材料题
      <el-card>
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
              <!--修改按钮-->
              <el-button
                type="primary"
                size="mini"
                @click="showchangematerialById(scope.row.Materialid)"
              >解析</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 修改单选 -->
    <el-dialog title="提示" :visible.sync="dialogVisible3" width="70%">
      <el-form>
        <el-form-item
          label="答案:"
          label-width="150px"
          v-model="formchangesingle.anwser"
                  style="white-space: pre-wrap; word-break: break-all"
        >
          {{ formchangesingle.anwser }}
        </el-form-item>
        <el-form-item
          label="解析:"
          label-width="150px"
          v-model="formchangesingle.analysis"
        >
          {{ formchangesingle.analysis }}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible3 = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改多选 -->
    <el-dialog title="提示" :visible.sync="dialogVisible4" width="70%">
      <el-form>
        <el-form-item
          label="答案:"
          label-width="150px"
          v-model="formchangemore.anwser"
        >
          {{ formchangemore.anwser }}
        </el-form-item>
        <el-form-item
          label="解析:"
          label-width="150px"
          v-model="formchangemore.analysis"
                  style="white-space: pre-wrap; word-break: break-all"
        >
          {{ formchangemore.analysis }}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible4 = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 材料题 -->
    <el-dialog title="提示" :visible.sync="dialogVisible5" width="70%">
      <el-form>
        <el-form-item
          label="答案:"
          label-width="150px"
          v-model="formchangetext.anwser"
          style="white-space: pre-wrap; word-break: break-all"
        >
          {{ formchangetext.anwser }}
        </el-form-item>
        <el-form-item
          label="解析"
          label-width="150px"
          v-model="formchangetext.analysis"
          style="white-space: pre-wrap; word-break: break-all"
        >
          {{ formchangetext.analysis }}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible5 = false"
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
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      formchangesingle: {
        query_singlename: "",
        anwser: "",
        analysis: "",
        examidsingle: this.$route.params.id,
        id: "",
      },
      formchangemore: {
        query_morename: "",
        analysis: "",
        examidmore: this.$route.params.id,
        id: "",
      },
      formchangetext: {
        query_text: "",
        anwser: "",
        analysis: "",
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
    //修改单选
    showchangesingleById(id) {
      console.log(id);
      this.dialogVisible3 = true;
      this.$get("/api/getsigle", { id })
        .then((response) => {
          console.log(response);
          this.formchangesingle.anwser = response.data.result[0].anwser
          console.log(response.data.result[0].analysis)
           if(response.data.result[0].analysis==='null'||response.data.result[0].analysis===''||response.data.result[0].analysis===null)
          {
              this.formchangesingle.analysis='无'
          }
          else{
            this.formchangesingle.analysis = response.data.result[0].analysis;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.singleid = id;
    },
    //修改多选
    showchangemultipleById(id) {
      console.log(id);
      this.dialogVisible4 = true;
      this.$get("/api/getmultiple", { id })
        .then((response) => {
          console.log(response);
          this.formchangemore.anwser = response.data.result[0].anwser;
          this.formchangemore.analysis = response.data.result[0].analysis;
                    if(response.data.result[0].analysis==='null'||response.data.result[0].analysis===''||response.data.result[0].analysis===null)
          {
            this.formchangemore.analysis='无'
          }
          else{
              this.formchangemore.analysis = response.data.result[0].analysis;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.multipleid = id;
    },

    //修改材料题
    showchangematerialById(id) {
      console.log(id);
      this.dialogVisible5 = true;
      this.$get("/api/getmaterial", { id })
        .then((response) => {
          console.log(response);
          this.formchangetext.anwser = response.data.result[0].anwser;
          if(response.data.result[0].analysis==='null'||response.data.result[0].analysis===''||response.data.result[0].analysis===null)
          {
            this.formchangetext.analysis='无'
          }
          else{
            this.formchangetext.analysis = response.data.result[0].analysis;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.materialid = id;
    },
  },
};
</script>

<style scoped>
.out {
  float: right;
}
</style>