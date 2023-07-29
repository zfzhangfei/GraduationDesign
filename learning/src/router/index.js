import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  //首页
  {
    path: '/',
    component:()=>import('@v/homepage.vue'),
   },
   //登录页面
 {
  path: '/Login',
  component:()=>import('@v/Login.vue'),
 },
 //管理员后台
 {
  path: '/privatepage',
  component:()=>import('@v/privatepage.vue'),
  redirect:'/welcome',
  children: [
    {
    path: '/welcome',
    component:()=>import('@c/welcome.vue')
  },
  {
    path: '/users',
    component:()=>import('@c/users.vue')
  },
  {
    path: '/lanmu',
    component:()=>import('@c/lanmu.vue')
  },
  {
    path: '/manage_exam',
    component:()=>import('@c/manage_exam.vue')
  },
  {
    path: '/examanalysis3/:id',
    component:()=>import('@c/examanalysis.vue')
  },
  // {
  //   path: '/manage_introduce',
  //   component:()=>import('@c/manage_introduce.vue')
  // },
  // {
  //   path: '/manage_changeintroduce',
  //   component:()=>import('@c/manage_changeintroduce.vue')
  // },
],
 },
 //用户后台
 {
  path: '/uprivatepage',
  component:()=>import('@v/uprivatepage.vue'),
  redirect:'/welcome2',
  children: [
    {
    path: '/welcome2',
    component:()=>import('@c/welcome.vue')
  },
  {
    path: '/user_exam',
    component:()=>import('@c/user_exam.vue')
  },
  {
    path: '/examanalysis2/:id',
    component:()=>import('@c/examanalysis.vue')
  }
],
 },
 //作者后台
 {
  path: '/authorprivatepage',
  component:()=>import('@v/authorprivatepage.vue'),
  redirect:'/welcome1',
  children: [
    {
    path: '/welcome1',
    component:()=>import('@c/welcome.vue')
  },
  {
    path: '/addnews',
    component:()=>import('@c/addnews.vue')
  },
  {
    path: '/authornewslist',
    component:()=>import('@c/authornewslist.vue')
  },
  {
    path: '/author_exam',
    component:()=>import('@c/author_exam.vue')
  },
  {
    path: '/author_addexam',
    component:()=>import('@c/author_addexam.vue')
  },
  {
    path: '/author_check',
    component:()=>import('@c/author_check.vue')
  },
  {
    path: '/author_changeexam',
    component:()=>import('@c/author_changeexam.vue')
  },
  {
    path: '/examquestion/:id',
    component:()=>import('@c/examquestion.vue')
  },
  {
    path: '/examanalysis1/:id',
    component:()=>import('@c/examanalysis.vue')
  },
  {
    path: '/author_addresource',
    component:()=>import('@c/author_addresource.vue')
  },
  {
    path: '/author_changeresource',
    component:()=>import('@c/author_changeresource.vue')
  },
  {
    path: '/manage_introduce',
    component:()=>import('@c/manage_introduce.vue')
  },
  {
    path: '/manage_changeintroduce',
    component:()=>import('@c/manage_changeintroduce.vue')
  },

],
 },
 //新闻内容展示
 {
   path: '/newscontent/:id', 
 component:()=>import('@v/newscontent.vue')
},
//新闻列表展示
{
  path: '/showallnews', 
component:()=>import('@v/showallnews.vue')
},
//注册页面
 {
  path: '/register',
  component:()=>import('@v/register.vue')
 },
 //真题区域
 {
  path: '/zhenti/:id',
  component:()=>import('@v/zhenti.vue')
 },
 //限时挑战区域
 {
  path: '/chooseqtype',
  component:()=>import('@v/chooseqtype.vue'),
  redirect:'/welcome3',
  children:[
    {
      path: '/welcome3',
      component:()=>import('@c/welcome.vue')
    },
    {
      path: '/danxuanxianshi',
      component:()=>import('@c/danxuanxianshi.vue')
     },
    {
      path: '/duoxuanxianshi',
      component:()=>import('@c/duoxuanxianshi.vue')
     },
     {
      path: '/xianshishowscore',
      component:()=>import('@v/xianshishowscore.vue')
     },
  ]
 },


  //试卷选择区域
  {
    path: '/shijuan',
    component:()=>import('@v/shijuan.vue')
   },
  //分数展示页面
   {
    path: '/showscore',
    component:()=>import('@v/showscore.vue')
   },
   //名师推荐
   {
    path: '/teachers',
    component:()=>import('@v/teachers.vue')
   },
   //资料集合
   {
    path: '/resource',
    component:()=>import('@v/resource.vue')
   },
   //修改密码
   {
    path: '/changepass',
    component:()=>import('@v/changepass.vue')
   },
 //测试页面
 {
  path: '/ceshi',
  component:()=>import('@v/ceshi.vue')
 },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to将要访问的路径
  //from代表从哪个路径跳转而来
  //next表示放行函数
  if(to.path==='/')return next()
  if(to.path==='/Login')return next()
  if(to.path==='/logindati')return next()
  if(to.path==='/loginxianshi')return next()
  if(to.path==='/register')return next()
  if(to.path==='/showallnews')return next()
  if(to.path.split('/newscontent/')[1])return next()
  if(to.path==='/changepass')return next()
  if(to.path==='/ceshi')return next()

 // if(to.path==='/ceshi')return next()
  //if(from.path==='/ceshi'&&to.path==='/showscore')return next()

  //获取token
  const tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr)return next('/Login')
  next()
  })
export default router
