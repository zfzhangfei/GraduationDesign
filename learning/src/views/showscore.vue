<template>
    <div>
     <div class="score">
        <div class="show">客观题分数为：<h2>{{this.score}}</h2></div>
        <el-button class="btn" type="primary" @click="out()">退出</el-button>
     </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            score:'',
            form:{
                uid:'',
                examid:''
            }
        }
    },
    created(){
        this.getscore()
    },
    methods:{
           getscore(){
                this.form.examid=window.sessionStorage.getItem("examid")
                this.form.uid=window.sessionStorage.getItem("uid")
            this.$get("/api/examsscore",this.form)
                .then((response) => {
                  console.log(response)
                  this.score=response.data.result[0].allscore
				},(error) => {
					console.log(error);
				})
         },
         out(){
               this.$router.push({path:'/shijuan'})
         }
    }
}
</script>


<style scoped>
.score{
  width: 400px;
  height: 400px;
   position:absolute;
   left: 50%;
   top:50%;
   transform: translate(-50%,-50%);
   border-radius:10px;
   /* background: url("../assets/scoreback.jpg"); */
}
.show{
     position:absolute;
     left: 50%;
     top:50%;
    transform: translate(-50%,-50%);
    font-size: 25px;
}
.score>img{
    width: 100%;
    height: 100%;
}
h2{
    margin-left: 50%;
    color: red;
}
.btn{
    margin-top:90%;
    margin-left: 82%;
}
</style>