<template>
    <div>
        <!--面包屑导航-->
 <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/welcome1' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>新闻管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加新闻</el-breadcrumb-item>
</el-breadcrumb>
<!--卡片视图-->
<el-card class="card">
<!--提示区域-->
 <el-alert class="tip"
    title="添加新闻"
    type="info" center show-icon :closable="false">
  </el-alert>

  <!--tab栏区域-->
  <el-form :model="addnewsForm" :rules="addnewsFormrules" ref="addnewsFormref" label-width="100px"
  label-position="top">
  <el-tabs :tab-position="'left'">
    <el-tab-pane label="新闻标题"></el-tab-pane>
    <el-form-item label="新闻标题" prop="news_title">
        <el-input v-model="addnewsForm.news_title"></el-input>
    </el-form-item>
    <el-tab-pane label="新闻栏目"></el-tab-pane>
      <el-form-item label="所属栏目" prop="news_cat">
    <el-cascader
    v-model="addnewsForm.news_cat"
    :options="lanmulist"
    :props="lanmuProps"
    @change="handleChange"></el-cascader>
      </el-form-item>
    <el-tab-pane label="新闻封面"></el-tab-pane>
     <el-form-item label="新闻封面(ps:不可更改)" prop="newspic">
    <el-upload
  action="/api/upload"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :on-success="handleSuccess"
  list-type="picture">
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
</el-form-item>
    <el-tab-pane label="新闻内容"></el-tab-pane>
        <!--富文本编辑器-->
        <el-form-item label="新闻内容" prop="newscontent">
        <quill-editor v-model="addnewsForm.content">
  </quill-editor>
  </el-form-item>
  <!--添加新闻的按钮-->
  <el-button type="primary" class="btnAdd" @click="add()">添加新闻</el-button>
    
  </el-tabs>
  </el-form>
</el-card>
<!--图片预览-->
<el-dialog
  title="图片预览"
  :visible.sync="previewVisible"
  width="50%">
  <img :src="previewPath" alt="" class="picview">
</el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'

export default{
    data(){
        return{
            //添加新闻的表单数据
            addnewsForm:{
                news_title:'',
                news_cat:[],
                pics:[],
                content:'',
                url:'',
                uid:'',
                author:'',
                time:'',
            },
            addnewsFormrules:{
                news_title:[{
                    required:true,message:'请输入新闻标题',trigger:'blur'
                }],
                news_cat:[{
                      required:true,message:'请选择新闻所属栏目',trigger:'blur'
                }],
                content:[{
                      required:true,message:'请输入新闻内容',trigger:'blur'
                }]

            },
            //栏目列表
            lanmulist :[],
            lanmuProps:{
                label:'lanmuName',
                value:'LanMuid'
            },
            previewPath:'',
            previewVisible:false

        }
    },
    //生命周期函数
    created(){
        this.getLanmulist()
    },
    methods:{
       async getLanmulist(){
           await this.$get('/api/lanmuname')
             .then(response => {
          this.lanmulist = response.data.result;
             console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
        },
        //
        handleChange(){
            console.log(this.addnewsForm.news_cat)
        },
        //处理图片预览效果
        handlePreview(file){
            console.log(file)
            this.previewPath=file.response.data.url
            this.previewVisible=true
        },
        //处理移除图片的效果
        handleRemove(file){
            const filePath=file.response.data.path
            const i=this.addnewsForm.pics.findIndex(x=>x.pic===filePath)
            console.log(i)
            this.addnewsForm.pics.splice(i,1)
            console.log(this.addnewsForm)
        },
        //监听图片上传成功的事件
        handleSuccess(response){
            console.log(response)
            const picInfo={pic:response.data.path}
            this.addnewsForm.pics.push(picInfo)
            this.addnewsForm.url=response.data.url
            console.log(this.addnewsForm)
        },
        //添加新闻
        add(){
             let myDate = new Date();
      let yy = String(myDate.getFullYear());
      let mm = myDate.getMonth() + 1;
      let dd = String(
        myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate()
      );
      let hou = String(
        myDate.getHours() < 10 ? "0" + myDate.getHours() : myDate.getHours()
      );
      let min = String(
        myDate.getMinutes() < 10
          ? "0" + myDate.getMinutes()
          : myDate.getMinutes()
      );
      let sec = String(
        myDate.getSeconds() < 10
          ? "0" + myDate.getSeconds()
          : myDate.getSeconds()
      );
      this.addnewsForm.time =
        yy + "-" + mm + "-" + dd + hou + ":" + min + ":" + sec;
            this.$refs.addnewsFormref.validate(
               async valid=>{
                    if(!valid){
                        return this.$message.error('请填写必填项')
                    }
                    this.addnewsForm.uid=window.sessionStorage.getItem('uid')
                    this.addnewsForm.author=window.sessionStorage.getItem('username')
                    const form=_.cloneDeep(this.addnewsForm)
                    form.news_cat=form.news_cat.join('')
                    console.log(form)

                    await this.$post('/api/addnews',form)
                    .then(response => {
                      console.log(response);
                     if(response.data.msg!==0){
                      return this.$message.error("uid失效,请重新登录")
                     }else{
                      return this.$message.success("添加成功")
                     }
                       })
                     .catch(error => {
                           console.log(error);
                          });
                }
            )
            this.addnewsForm.news_title='',
            this.addnewsForm.news_cat=[],
            this.addnewsForm.content=''
            this.addnewsForm.pics=[],
            this.addnewsForm.url=''
        }
    }
}
</script>

<style scoped>
.tip{
    margin-bottom:20px ;
}
.btnAdd{
    margin-top: 15px;
}
.picview{
    width: 100%;
    height: 300px;
}
.card{
    min-height: 600px;
}
</style>
