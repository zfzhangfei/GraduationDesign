<template>
    <div>
        <!--面包屑导航-->
 <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>名师推荐</el-breadcrumb-item>
  <el-breadcrumb-item>推荐管理</el-breadcrumb-item>
</el-breadcrumb>
<!--卡片视图-->
<el-card class="card">
<!--提示区域-->
 <el-alert class="tip"
    title="添加新闻"
    type="info" center show-icon :closable="false">
  </el-alert>

  <!--tab栏区域-->
  <el-form :model="introduceForm" :rules="introduceFormrules" ref="introduceFormref" label-width="100px"
  label-position="top">
  <el-tabs :tab-position="'left'">
    <el-tab-pane label="名师姓名"></el-tab-pane>
    <el-form-item label="名师姓名" prop="teachername">
        <el-input v-model="introduceForm.teachername"></el-input>
    </el-form-item>
    <el-tab-pane label="名师肖像"></el-tab-pane>
     <el-form-item label="名师肖像">
    <el-upload
  action="/api/upload"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :on-success="handleSuccess"
  list-type="picture">
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
</el-form-item>
    <el-tab-pane label="名师简介"></el-tab-pane>
        <!--富文本编辑器-->
        <el-form-item label="名师简介" prop="content">
        <el-input type="textarea" v-model="introduceForm.content">
  </el-input>
  </el-form-item>
    <el-tab-pane label="课程链接"></el-tab-pane>
    <el-form-item label="课程链接" prop="course">
        <el-input v-model="introduceForm.course" placeholder="例如:(百度网盘链接)https://pan.baidu.com/s/1pmVcAR_Mo7IJbAcqnJKAKA"></el-input>
    </el-form-item>
        <el-tab-pane label="提取码"></el-tab-pane>
    <el-form-item label="提取码" prop="checknum">
        <el-input v-model="introduceForm.checknum"></el-input>
    </el-form-item>
  <!--添加名师的按钮-->
  <el-button type="primary" class="btnAdd" @click="add()">添加</el-button>
    
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
            introduceForm:{
                teachername:'',
                pics:[],
                content:'',
                url:'',
                course:'',
                checknum:'',
            },
            introduceFormrules:{
               teachername:[{
                    required:true,message:'请输入姓名',trigger:'blur'
                }],
                content:[{
                      required:true,message:'请输入简介',trigger:'blur'
                }]

            },
            previewPath:'',
            previewVisible:false

        }
    },
    methods:{
        //处理图片预览效果
        handlePreview(file){
            console.log(file)
            this.previewPath=file.response.data.url
            this.previewVisible=true
        },
        //处理移除图片的效果
        handleRemove(file){
            const filePath=file.response.data.path
            const i=this.introduceForm.pics.findIndex(x=>x.pic===filePath)
            console.log(i)
            this.introduceForm.pics.splice(i,1)
            console.log(this.introduceForm)
        },
        //监听图片上传成功的事件
        handleSuccess(response){
            console.log(response)
            const picInfo={pic:response.data.path}
            this.introduceForm.pics.push(picInfo)
            this.introduceForm.url=response.data.url
            console.log(this.introduceForm)
        },
        //添加新闻
        add(){
            this.$refs.introduceFormref.validate(
               async valid=>{
                    if(!valid){
                        return this.$message.error('请填写必填项')
                    }
                    if(this.introduceForm.course===undefined){
                        this.introduceForm.course=''
                    }
                       if(this.introduceForm.checknum===undefined){
                        this.introduceForm.checknum='提取码:无'
                    }
                    const form=_.cloneDeep(this.introduceForm)
                    console.log(form)

                    await this.$post('/api/addteach',form)
                    .then(response => {
                      console.log(response);
                      return this.$message.success("添加成功")
                       })
                     .catch(error => {
                           console.log(error);
                          });
                }
            )
            this.introduceForm.teachername='',
            this.introduceForm.url='',
            this.introduceForm.content='',
            this.introduceForm.course='',
            this.introduceForm.checknum=''
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
