<template>
    <div>
           <div class="danxuan">单选(共{{num}}题)(每题一分)
          <el-card class="card">
          <el-card>
           <div>{{index+1}}、{{title[index]}}</div>
          <el-radio-group v-model="radio" @change="getIputValue(index)">
           <div class="anwser"><el-radio  :label="'A'" >{{aA[index]}}</el-radio></div>
           <div class="anwser"><el-radio  :label="'B'" >{{aB[index]}}</el-radio></div>
           <div class="anwser"><el-radio  :label="'C'" >{{aC[index]}}</el-radio></div>
           <div class="anwser"><el-radio  :label="'D'" >{{aD[index]}}</el-radio></div>
              </el-radio-group>
          </el-card>
          <li v-for="(item,index) in list" :class="{'current':currentIndex == index}" :key="index" @click="goto(index)"></li>
        </el-card>
<el-row :gutter="20" class="begin">
      <el-button @click="begin()">开始</el-button>
      <div class="showtime">{{this.str}}</div>
  </el-row>
              </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
        id:1,
        index:0,
        currentIndex: 0,
        list: [],
        title:[],
        aA:[],
        aB:[],
        aC:[],
        aD:[],
        count:0,//单选题得分
        num:0,
        anwser:[],
        examinationData:[],
        allRadio: [],//提交给后台的真题数据
        radio: [],//单选真题答案
        form:{
        uid:'',
        counts:'',//试卷客观题总分
        testname:'',
        examid:'',
      },
        zhuangtai:false,
        s:0,
        str:'00'
        }
    },
   
 computed: {
    nextIndex() {
    if(this.currentIndex == this.list.length) {
      return 0;
    }else {
      return this.currentIndex + 1;
    }
  },
 },


methods:{
goto(index){
    this.currentIndex = index;
    this.index=this.currentIndex
  },
    //获取题目信息
requestData() {
               let id=this.id
               console.log(id)
			this.$get("/api/rand_single_id",{id})
                .then((response) => {
					console.log(response);
                    this.list = response.data.results;
                    this.examinationData=response.data.results;
                    this.num=response.data.num
                    for(let i=0;i<this.num;i++)
                    {
                        this.title[i]=this.list[i].qtitle
                        this.aA[i]=this.list[i].aA
                        this.aB[i]=this.list[i].aB
                        this.aC[i]=this.list[i].aC
                        this.aD[i]=this.list[i].aD
                    }
				},(error) => {
					console.log(error);
				})
			},
//点击单选按钮触发事件
getIputValue(index){
      console.log(index + 1 + "题" + this.radio);
      this.allRadio[index] = this.radio; // 将数据存入提交给后台的数据中
      if(this.allRadio[index]===this.examinationData[index].anwser)
      {
        this.anwser[index]=this.examinationData[index].anwser
        this.count=this.count+this.examinationData[index].score;
       // console.log('点到正确答案：   '+this.count)
      }else if(this.anwser[index]!==undefined&&this.anwser[index]===this.allRadio[index]){
        this.count+=0
      //   console.log('点到正确答案：   '+this.count)
      }else if(this.anwser[index]!==undefined&&this.anwser[index]!=="E"&&this.anwser[index]!==this.allRadio[index]){
         this.count=this.count-this.examinationData[index].score;
      //   console.log('点到错误答案：   '+this.count)
         this.anwser[index]="E"
      }
      else if(this.anwser[index]==="E"&&this.anwser[index]!==this.allRadio[index]){
         this.count=this.count+0;
      //   console.log('点到错误答案：   '+this.count)
      }
      else{
        this.count+=0
      //  console.log('点到错误答案：   '+this.count)
      }
      console.log('分数：'+this.count)
    },

begin(){
  var time
  var times
  this.zhuangtai=true
  console.log(this.zhuangtai)
        if(this.zhuangtai===true)
   {
        time=setInterval( ()=>{
                this.goto(this.nextIndex)
                this.radio=[]
                if(this.nextIndex===0){
            clearInterval(time)
            clearInterval(times)
            alert("结束")
            this.zhuangtai=false
            this.$router.push({path:'/xianshishowscore',query:{score:this.count}})
           }
           },2000)
         times=setInterval(() => {{
            if(this.s<2){
                  this.s+=1
                  this.str =this.toDub(this.s)
                  }else{
                  this.str='01';
                  this.s=1
                  }
                  }
                  },1000)
   }
          },
toDub(n){  //补0操作
     if(n<10){
       return "0"+n;
     }
     else {
       return ""+n;
     }
 },
},
 created() {
   //var time=null
          this.requestData();
},
}
</script>

<style scoped>
li{
  list-style: none;
}
.begin{
    text-align: center;
}
.showtime{
    color: red;
    font-size: 100px;
   
}
.anwser .el-radio{
  margin-top: 15px;
  margin-bottom: 15px;
  font-size: 15px;
  width: 100% !important;
  text-overflow: ellipsis;
  white-space: normal;
}
</style>