import md5 from 'js-md5'

function strTomd5(str){
    return md5(md5(str).split('').reverse().join(''))
}

export{
    strTomd5
}