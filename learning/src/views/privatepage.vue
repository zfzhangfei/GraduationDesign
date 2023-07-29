<template>
    <el-container class="container">
      <!--头部区域-->
  <el-header>
    <div>
      <img src="../assets/backstage.png" alt="" class="pic1">
      <span>后台管理系统</span>
    </div>
      <el-button type="out" @click="logout()">退出</el-button>
  </el-header>
   <!--页面主体区域-->
  <el-container >
     <!--侧边栏区域-->
    <el-aside :width="icCollapse ?'64px':'200px'">
      <div class="shrinkmenu" @click="toggleCollapse">|||</div>
       <!--"："表示动态数据绑定-->
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
          v-for="item in menulist"
          :key="item.id"
          :collapse=" icCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
        <!--一级菜单-->
      <el-submenu :index="item.id+''" >
        <template slot="title">
          <i :class="icons[item.id]"></i>
          <span>{{item.name}}</span>
        </template>
         <!--二级菜单-->
              <el-menu-item :index="'/'+item2.path" v-for="item2 in item.children" :key="item2.id"
              @click="saveNameState('/'+item2.path)">
              <template slot="title">
              <i class="el-icon-location"></i>
          <span>{{item2.name}}</span>
        </template>
                </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
     <!--右侧主体区域-->
    <el-main>
     <!--路由占位符-->
     <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>


<script>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    export default {
      data() {
    return {
      menulist: [],
      icons:{
        1:'el-icon-s-custom',
        2:'el-icon-key',
        3:'el-icon-document',
     //   10:'el-icon-thumb'
      },
      //是否折叠(默认不折叠)
      icCollapse:false,
      activePath:''
    };
  },
      created(){
        //获取左侧菜单
        this.getMenuList()
        this.activePath=window.sessionStorage.getItem('activePath')
      },
 methods: {
         logout(){
         this.$router.push('/');
         },
         getMenuList() {
         this.$get("/api/manage")
        .then(response => {
          this.menulist = response.data;
             console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },
    toggleCollapse(){
      this.icCollapse=!this.icCollapse
    },
    //保存链接的激活状态
    saveNameState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath 
    }
         }
    }
</script>




<style scoped>
.container{
  height: 100vh;
}
.el-header {
    background-color: #B3C0D1;
    display: flex;
    justify-content: space-between;
    padding-left: 0px;
    align-items: center;
    color: #fff;
    font-size: 20px;
}
.el-header >div{
  display: flex;
  align-items: center;
}
.el-header >div>span{
margin-left: 15px;
}
.el-aside {
    background-color: #545c64;
}
.el-aside>.el-menu{
      border-right: none;
    }

.el-main {
    background-color: #E9EEF3;
}
.pic1{
  height: 50px;
  width: 50px;
}
.shrinkmenu{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>


