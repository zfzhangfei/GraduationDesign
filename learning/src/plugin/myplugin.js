import {get,post, setToken} from '../util/request.js'

export default{
    install:function(Vue){
        Vue.mixin({
            methods:{
                $get(url,params){
                    return get(url,params)
                },
                $post(url,params){
                    return post(url,params)
                },
                $setToken(){
                    setToken()
                }
            }
        })
    }
}