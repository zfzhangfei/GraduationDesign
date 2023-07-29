<template>
    <div>
        <!--面包屑导航-->
 <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/welcome1' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>资料管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加资料</el-breadcrumb-item>
</el-breadcrumb>
<!--卡片视图-->
<el-card class="card">
<!--提示区域-->
 <el-alert class="tip"
    title="添加资料"
    type="info" center show-icon :closable="false">
  </el-alert>

  <!--tab栏区域-->
  <el-form :model="addresourceForm" :rules="addresourceFormrules" ref="addresourceFormref" label-width="100px"
  label-position="top">
  <el-tabs :tab-position="'left'">
    <el-tab-pane label="资料名"></el-tab-pane>
    <el-form-item label="资料名" prop="resourcename">
        <el-input v-model="addresourceForm.resourcename"></el-input>
    </el-form-item>
      <el-tab-pane label="相关名师"></el-tab-pane>
    <el-form-item label="相关名师" prop="resourceteacher">
        <el-input v-model="addresourceForm.resourceteacher"></el-input>
    </el-form-item>
      <el-tab-pane label="资料链接"></el-tab-pane>
    <el-form-item label="资料链接" prop="resourcelink">
        <el-input v-model="addresourceForm.resourcelink"></el-input>
    </el-form-item>
      <el-tab-pane label="资料提取码"></el-tab-pane>
    <el-form-item label="资料提取码" prop="resourcenum">
        <el-input v-model="addresourceForm.resourcenum"></el-input>
    </el-form-item>
    
  <!--添加新闻的按钮-->
  <el-button type="primary" class="btnAdd" @click="add()">添加资料</el-button>
    
  </el-tabs>
  </el-form>
</el-card>
    </div>
</template>

<script>
import _ from 'lodash'

export default{
    data(){
        return{
            //添加新闻的表单数据
            addresourceForm:{
                resourcename:'',
                resourceteacher:'',
                resourcelink:'',
                resourcenum:'',
            },
          addresourceFormrules:{
                resourcename:[{
                    required:true,message:'请输入资料名',trigger:'blur'
                }],
                resourceteacher:[{
                      required:true,message:'请选择名师',trigger:'blur'
                }],
                resourcelink:[{
                      required:true,message:'请输入资料链接',trigger:'blur'
                }],
            },

        }
    },
    methods:{
        //添加资料
        add(){   
            this.$refs.addresourceFormref.validate(
               async valid=>{
                    if(!valid){
                        return this.$message.error('请填写必填项')
                    }
                    const form=_.cloneDeep(this.addresourceForm)
                    console.log(form)

                    await this.$post('/api/addresource',form)
                    .then(response => {
                      console.log(response);
                    return this.$message.success("添加成功")
                       })
                     .catch(error => {
                           console.log(error);
                          });
                }
            )
            this.addresourceForm.resourcename='',
            this.addresourceForm.resourceteacher='',
            this.addresourceForm.resourcelink='',
            this.addresourceForm.resourcenum=''
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
