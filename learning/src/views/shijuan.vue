<template>
	<div id="exams">
	<div class="head">
    <!-- <img src="..\assets\homeheader.jpg"> -->
    <h2>{{msg}}</h2>
    </div>
		<el-card>
		<el-row :gutter="20">
       <el-col :span="8">
       <el-input placeholder="请输入试卷名的关键字" v-model="queryInfo.queryexam" clearable>
       <el-button slot="append" icon="el-icon-search"  @click="searchexam"></el-button>
       </el-input>
       </el-col>
        <!--退出按钮-->
      <el-col :span="16" style=" text-align: right;">
      <el-button type="primary" @click="logout()" style="color: #06397d">退出</el-button>
      </el-col>
		</el-row>
		<!--试卷列表-->
		<el-table :data="examlist" border stripe>
  <el-table-column label="#" type="index"></el-table-column>
  <el-table-column label="试卷名" >
         <template slot-scope="scope">
               <a :href="'/zhenti/'+scope.row.id" class="text">{{scope.row.examname}}</a>
         </template>
    </el-table-column>
        </el-table>
<!--试卷分页-->
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
	export default {
		data() {
			return {
				msg: '这是一个试卷列表！',
			examlist: [],
			queryInfo:{
            queryexam:'',
            //当前页数
            pagenum:1,
            //当前每页显示条数
            pagesize:5,
        },
		total:0
			}
		},
		methods:{
   logout(){
       //  window.sessionStorage.clear();
         this.$router.push({path:'/'})
         },
			
	requestData() {
        this.$get("/api/examslizi",this.queryInfo)
        .then((response) => {
          console.log(response)
					//注意 用到this要注意this指向
					this.examlist = response.data.results;
					this.total=response.data.total;
				},(error) => {
					console.log(error);
				})
			},
         //监听pagesize改变的事件
        handleSizeChange(newSize){
        console.log(newSize)
        this.queryInfo.pagesize=newSize
        this.requestData()
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage){
        console.log(newPage)
        this.queryInfo.pagenum=newPage
        this.requestData()
    },

	searchexam(){
       this.$get("/api/searchexam",this.queryInfo)
        .then(response => {
          this.examlist = response.data.results;
          this.total=response.data.total;
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },
		},
		mounted() {
			this.requestData();
		}
	}
</script>

<style lang="scss" scoped>
	.list{
		li{
			height: 3.4rem;
			line-height: 3.4rem;
			border-bottom: 1px solid #eee;
			font-size: 1.6rem;
			a{
				color: #666;
			}
		}
	}
.head{
  height: 100px;
  width: 100%;
  display: flex;
  background-color: #681414;
}
.head>img{
  width: 100%;
  height: 100px;
  position: absolute;
  display: flex;
}
h2{
  float: left;
  position: relative;
}
.show{
	list-style: none;
}
</style>