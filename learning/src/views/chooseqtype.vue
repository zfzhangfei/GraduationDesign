<template>
    <div>
        <el-menu
  :default-active="activeIndex"
  class="el-menu-demo"
  mode="horizontal"
  @select="handleSelect"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b"
  router >
  <el-menu-item index="/welcome3">首页</el-menu-item>
  <el-menu-item index="/danxuanxianshi">单选</el-menu-item>
  <el-menu-item index="/duoxuanxianshi">多选</el-menu-item>
  <el-button class="outbtn" @click="out()" type="primary">退出</el-button>
</el-menu>
<el-main>
   <router-view></router-view>
</el-main>
    </div>
</template>

<script>
export default {
     data() {
      return {
        activeIndex: ''
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
        this.activeIndex=key
      },
      out(){
         //window.sessionStorage.clear();
         this.$router.push({path:'/'})
      }
    }
}
</script>

<style scoped>

.outbtn{
  float: right;
  margin: 10px;
}
.el-menu-demo{
  position: relative;
}
</style>