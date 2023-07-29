import axios from 'axios'
//导入
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Vue from 'vue'


///////////////////////////////////////////

Vue.prototype.$http = axios
////////////////////////////////////////////////




// 创建实例时设置配置的默认值
var instance = axios.create({
    baseURL: 'http://localhost:8080',
    setTimeout:30000
  });

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    NProgress.start()
    //为请求对象添加token验证的Authorization字段
    config.headers.Authorization=window.sessionStorage.getItem('token')
    return config;
  }, function (error) {
    // 对请求错误做些什么
    NProgress.done()
    return Promise.reject(error);
  });

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    NProgress.done()
    return response;
  }, function (error) {
    // 对响应错误做点什么
    NProgress.done()
    return Promise.reject(error);
  });



  
let get = async function(url,params){
    let data = instance.get(url,{params});
    return data
}

let post = async function(url,params){
  let data = instance.post(url,params);
  return data
}

//创建一个将token信息保存到请求头的方法
let setToken=function(){
  instance.defaults.headers.common['token']=sessionStorage.getItem('token');
}

  //导出
  export {
      get,
      post,
      setToken
  }