<template>
    <div>
           <div class="duoxuan">多选(共{{more_num}}题)(每题两分)
          <el-card class="card">
          <el-card>
           <div>{{index+1}}、{{more_qtitle[index]}}</div>
           <el-checkbox-group v-model="more_checked"  @change="getIputValue_more(index)">
           <div class="anwser"><el-checkbox :label="'A'" >{{aA[index]}}</el-checkbox></div>
           <div class="anwser"><el-checkbox :label="'B'" >{{aB[index]}}</el-checkbox></div>
           <div class="anwser"><el-checkbox :label="'C'" >{{aC[index]}}</el-checkbox></div>
           <div class="anwser"><el-checkbox :label="'D'" >{{aD[index]}}</el-checkbox></div>
        </el-checkbox-group>
          </el-card>
          <li v-for="(item,more_index) in more_list" :class="{'current':currentIndex == more_index}" :key="more_index" @click="goto(more_index)"></li>
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
        more_index:0,//多选题题目编号
        currentIndex: 0,
        more_checked:[],//多选题答案
        more_qtitle:[],//多选题目
        more_list: [],//多选题题库数据
        aA:[],
        aB:[],
        aC:[],
        aD:[],
        more_num:'',//多选题目总数
        moreanwser:[],//多选的正确答案
        more_allcheck:[],//多选题所有做的题目数组，如做了三道题more_allradio[[ABC],[AD],[AC]]
        more_nextcord:[],//存储所作题目的对与错
        cordid:'',
        morecount:0,//多选题得分
        more_compare:[],
        zhuangtai:false,
        s:0,
        str:'00'
        }
    },
   
 computed: {
    nextIndex() {
    this.judgescore()
    if(this.currentIndex == this.more_list.length - 1) {
      return 0;
    }else {
      return this.currentIndex + 1;
    }
  },
 },


methods:{
  goto(more_index){
    this.currentIndex = more_index;
    this.index=this.currentIndex
  },
    //获取题目信息
    requestData_more() {
                  let id=this.id
                  this.$get("/api/rand_more_id",{id})
                .then((response) => {
                    console.log(response)
                    this.more_list = response.data.results;
                    this.more_num=response.data.num
                    for(let i=0;i<this.more_num;i++)
                    {
                        this.more_qtitle[i]=this.more_list[i].qtitle
                        this.aA[i]=this.more_list[i].aA
                        this.aB[i]=this.more_list[i].aB
                        this.aC[i]=this.more_list[i].aC
                        this.aD[i]=this.more_list[i].aD
                    }
                    this.moreanwser=this.more_list[this.more_index].anwser
				},(error) => {
					console.log(error);
				})
			},
//勾选复选框触发的事件
getIputValue_more(index) {
        console.log("题目编号和答案：    "+(index + 1 )+ "题" + this.more_checked)
        this.more_allcheck[index]=this.more_checked
        console.log("第一题答案："+this.more_allcheck[0]+"第二题答案："+this.more_allcheck[1]+"第三题答案："+this.more_allcheck[2]+"第四题答案："+this.more_allcheck[3])  
},
//判断多选得分
judgescore(){
       var i,j,k=0,count=0;
       //判断得分
        for(i=0;i<this.moreanwser.length;i++)
        {
          for(j=0;j<this.more_checked.length;j++)
          {
            if(this.more_checked[j]===this.moreanwser[i])
            {
              this.more_compare[k]=this.moreanwser[i]
              k+=1;
            }
          }
        }
        for(i=0;i<this.moreanwser.length;i++)
        {
            if(this.more_compare[i]!==this.moreanwser[i]||this.more_checked.length>this.moreanwser.length)
        {
            this.cordid=this.index+1
            this.more_nextcord[this.cordid-1]='false'
            break;
        }
        else if(i===this.moreanwser.length-1){
           this.cordid=this.index+1
           this.more_nextcord[this.cordid-1]='true'
            break;
        }
        }
        this.more_compare=[]
          for(i=0;i<this.cordid;i++)
      {
        if(this.more_nextcord[i]==='true')
        count++;
      }
        this.morecount=count*this.more_list[this.index].score
        console.log(this.cordid)
         console.log("对错记录："+this.more_nextcord)
        console.log("得分 :  "+this.morecount)
        console.log(this.more_qtitle)
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
                this.more_checked=[]
                if(this.cordid===10){
            clearInterval(time)
            clearInterval(times)
            alert("结束")
            this.zhuangtai=false
            this.$router.push({path:'/xianshishowscore',query:{score:this.morecount}})
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
          this.requestData_more();
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
.anwser .el-checkbox{
  margin-top: 15px;
  margin-bottom: 15px;
  width: 100% !important;
  text-overflow: ellipsis;
  white-space: normal;
  display: flex;
}
.card{
  height: 300px;
}
</style>