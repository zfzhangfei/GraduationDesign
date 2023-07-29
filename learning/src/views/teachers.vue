<template>
  <div>
    <div class="head">
      <h2>{{ msg }}</h2>
    </div>
    <div class="content">
      <el-card>
          <el-button class="out" @click="logout()" type="primary">退出</el-button>
       <ul v-for="(item,index) in teacherlist" :key="index">
           <div class="photo">
               <img :src="item.teacherpicture" alt="" class="pic">
           </div>
           <div class="message">
           教师：{{item.teachername}} <br>
           简介：{{item.introduce}}<br>
           课程链接：<a :href="item.course" target="_blank">{{item.course}}</a>{{item.checknum}}
           </div>
       </ul>
      </el-card>
    </div>
  </div>
</template>

<script>
	export default {
		data() {
			return {
				msg: '这是名师推荐库',
			teacherlist: [],
			}
		},
		methods:{
   logout(){
       //  window.sessionStorage.clear();
         this.$router.push({path:'/'})
         },
			
	requestData() {
        this.$get("/api/teachlist")
        .then((response) => {
          console.log(response)
					//注意 用到this要注意this指向
					this.teacherlist = response.data.result;
                     console.log(this.teacherlist)
				},(error) => {
					console.log(error);
				})
			},
		},
		mounted() {
			this.requestData();
		}
	}
</script>

<style scoped>
.head {
  height: 100px;
  width: 100%;
  display: flex;
  background-color: #681414;
}
.out{
    float: right;
}
ul{
    margin-bottom: 30px;
}
.pic{
    width: 100px;
    height: 100px;
}
.photo{
    float: left;
    position:absolute;
}
.message{
    width: 900px;
    margin-left: 150px;
    white-space: normal;
}
</style>