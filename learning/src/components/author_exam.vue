<template>
 <div>
<!--面包屑导航-->
 <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/welcome1' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>成绩管理</el-breadcrumb-item>
  <el-breadcrumb-item>成绩列表</el-breadcrumb-item>
</el-breadcrumb>
<!--卡片视图-->
<el-card class="box-card">
    <!--搜索-->
    <el-row :gutter="20">
    <el-col :span="12">
  <el-input placeholder="请输入试卷名的关键字" v-model="queryInfo.query" clearable @clear="searchexamList">
    <el-button slot="append" icon="el-icon-search" @click="searchexamList" ></el-button>
  </el-input>
    </el-col>
    </el-row>
<!--试卷列表-->
<el-table :data="examlist" border stripe>
    <el-table-column label="#" type="index"></el-table-column>
    <el-table-column label="试卷名" prop="testname" width="300px"></el-table-column>
    <el-table-column label="客观题总分" prop="allscore"></el-table-column>
    <el-table-column label="主观题总分" prop="minescore"></el-table-column>
     <el-table-column label="操作">
         <template slot-scope="scope"> <!--scope数据插槽-->
<!--查看试题解析按钮-->
<el-button type="primary" size="mini"
@click="analysiById(scope.row.examid)"
>查看试题解析</el-button>
        </template>
     </el-table-column>
      <el-table-column label="评语" prop="comment" :show-overflow-tooltip="true"></el-table-column>
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
            pagesize:5,
            uid:''
        },
        examlist:[],
        total:0,
        //控制添加用户对话框的显示与隐藏
        dialogVisible:false,
    }
},
created(){
    this.getexamList();
},
methods:{
    async getexamList(){
        this.queryInfo.uid=window.sessionStorage.getItem('uid')
        console.log(this.uid)
       await this.$get("/api/examlist",this.queryInfo)
         .then(response => {
          this.examlist = response.data.results;
          this.total=response.data.total;
          console.log(this.examlist)
        })
        .catch(error => {
          console.log(error);
        });
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize){
        console.log(newSize)
        this.queryInfo.pagesize=newSize
        this.getexamList()
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage){
        console.log(newPage)
        this.queryInfo.pagenum=newPage
        this.getexamList()
    },
    //获取查询的试卷列表
    searchexamList(){
     this.$get("/api/searchexamlist",this.queryInfo)
        .then(response => {
          this.examlist = response.data.results;
          this.total=response.data.total;
             console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //根据id删除考过的试卷
    async removeexamById(id){
          console.log(id)
          //弹框询问
         const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
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

        await this.$get('/api/removeexam',{id})
         .then(res=>{
             if(res.data.code!==200){
                 return this.$message.error('删除失败')
             }
         })
         this.$message.success('删除成功')
         this.getexamList()
       // console.log('确认删除')
      },
      analysiById(id){
        console.log(id)
        this.$router.push({ path: "/examanalysis1/"+id });
      }

}

}
</script>

<style scoped>

</style>
