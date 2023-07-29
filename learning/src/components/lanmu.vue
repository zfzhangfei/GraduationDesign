<template>
 <div>
<!--面包屑导航-->
 <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
  <el-breadcrumb-item>栏目列表</el-breadcrumb-item>
</el-breadcrumb>
<!--卡片视图-->
<el-card class="box-card">
    <!--搜索-->
    <el-row :gutter="20">
    <el-col :span="12">
  <el-input placeholder="请输入栏目名的关键字" v-model="queryInfo.query" clearable @clear="searchlanmuList">
    <el-button slot="append" icon="el-icon-search" @click="searchlanmuList" ></el-button>
  </el-input>
    </el-col>
     <el-col :span="4">
    <el-button type="primary" @click="dialogVisible=true">添加栏目</el-button>
    </el-col>
    </el-row>
<!--栏目列表-->
<el-table :data="lanmulist" border stripe>
    <el-table-column label="#" type="index"></el-table-column>
    <el-table-column label="栏目名" prop="lanmuName"></el-table-column>
    <el-table-column label="操作">
    <template slot-scope="scope"> <!--scope数据插槽-->
<!--删除按钮-->
<el-button type="danger" icon="el-icon-delete" size="mini"
@click="removelanmuById(scope.row.LanMuid)"
></el-button>
        </template>
    </el-table-column>
</el-table>
<!--分页区域-->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5,10,15,20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<!--添加栏目-->
<el-dialog
  title="添加栏目"
  :visible.sync="dialogVisible"
  width="50%"
  @close="resetForm"
  >
 <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
    <el-form-item label="栏目名" prop="lanmuname">
    <el-input type="lanmuname" v-model="ruleForm.lanmuname" autocomplete="off"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible=false">取 消</el-button>
    <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
  </span>
</el-dialog>
</div>
</template>

<script>
export default{
data(){
    return{
 queryInfo:{
            query:'',
            //当前页数
            pagenum:1,
            //当前每页显示条数
            pagesize:5
        },
        lanmulist:[],
        total:0,
        //控制添加用户对话框的显示与隐藏
        dialogVisible:false,
        ruleForm: {
          lanmuname:'',
        },
        rules:{
        lanmuname:[{
        required:true,message:'请输入用户名',trigger:'blur'
        }]
        }
    }
},
created(){
    this.getLanMuList();
},
methods:{
    async getLanMuList(){
       await this.$get("/api/lanmulist",this.queryInfo)
         .then(response => {
          this.lanmulist = response.data.results;
          this.total=response.data.total;
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //表单提交方法
    submitForm(formName) {
        this.$refs[formName].validate (async(valid) => {
        console.log(valid)
         if (valid) {
         await this.$post("/api/addlanmu", this.ruleForm )
         .then(res=>{
           console.log(res.data)
           this.dialogVisible=false
           alert("添加成功"),
           this.getLanMuList()
       })
            }
        })

      },
//表单重置方法
 resetForm() {
        this.$refs.ruleForm.resetFields();
      },
    //监听pagesize改变的事件
    handleSizeChange(newSize){
        console.log(newSize)
        this.queryInfo.pagesize=newSize
        this.getLanMuList()
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage){
        console.log(newPage)
        this.queryInfo.pagenum=newPage
        this.getLanMuList()
    },
    //获取查询的栏目列表
    searchlanmuList(){
     this.$get("/api/searchlanmulist",this.queryInfo)
        .then(response => {
          this.lanmulist = response.data.results;
          this.total=response.data.total;
             console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //根据id删除栏目
    async removelanmuById(id){
          console.log(id)
          //弹框询问
         const confirmResult=await this.$confirm('此操作将永久删除该栏目以及栏目下的所有新闻, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        //如果用户确认删除，则返回字符串confirm
        //如果用户取消删除，则返回字符串cancel
        //console.log(confirmResult)
        if(confirmResult!=='confirm'){
            return this.$message.info('已取消删除')
        }

        await this.$get('/api/removelanmu',{id})
         .then(res=>{
             if(res.data.code!==200){
                 return this.$message.error('删除栏目失败')
             }
         })
         this.$message.success('删除成功')
         this.getLanMuList()
       // console.log('确认删除')
      }

}

}
</script>

<style scoped>

</style>
