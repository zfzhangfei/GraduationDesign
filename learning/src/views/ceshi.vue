<template>
  <div>
    <input type="text" v-model="username" @keyup.enter="add()">
    <input type="button" value="按钮" @click="add()">
    <div v-show="this.arr.length==0">暂无留言</div>
    <ul>
      <li v-for="(item,index) in arr" :key="index">{{item}}
        <a href="#" @click="remove($index)">删除</a>
      </li>
    </ul>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
     username:'',
     arr:[]
    };
  },
  methods: {
    add:function(){
      this.arr.unshift(this.username);
      this.username='';
    },
    remove:function(index){
      this.arr.splice(index,1);
    }
  }
};
</script>
