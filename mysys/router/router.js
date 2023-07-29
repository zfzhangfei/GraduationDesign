const express = require('express')
const { CLIENT_LONG_PASSWORD } = require('mysql/lib/protocol/constants/client')
const con = require('../modul/db.js')
const jwt = require("jsonwebtoken");

const router = express.Router()

let db= con.handleDisconnection()




// 处理数据的函数
// data 数据
// root 顶级数据
let getChildren = function (data, root) {
  var children = [];
  for (var i = 0; i < data.length; i++) {
    if (root == data[i].super) {
      data[i].children = getChildren(data, data[i].id);
      children.push(data[i]);
    }
  }
  return children;
}
//用户登录
router.get('/users', (req, res)=>{
	let params = req.query;
	let username = params.username;
	let password = params.password;
  let sel_sql = `SELECT * FROM users WHERE users.username = '${username}' `
  let sql = `SELECT * FROM users WHERE users.username = '${username}' and users.password='${password}' `
    db.query(sql, [params.username, params.password],function(err, result) {
    let data = JSON.parse(JSON.stringify(result)) //JSON.stringify方法用于将 JavaScript 值转换为 JSON 字符串。
    console.log('data '+data.toString()+'result '+result.toString());
//生成token
    let content = {
      password: params.password
    }
    let secretOrPrivateKey = '_jwt'; //这是加密的Key(密钥)
    let token = jwt.sign(content, secretOrPrivateKey, {
      expiresIn: 60 * 60 * 1 //1小时过期
    });
    if (err) {
      console.log(err)
    }
		  if(result.length===0) {
			return res.send(JSON.stringify({ //序列化json数据
				msg: 'no admin',
        res:result
			}))
		}
    else {
      db.query(sel_sql, params.username, (error, result) =>{
			if(result[0].identity=="admin")
      {
        return res.send(JSON.stringify({
          msg: 'admin login success',
          success:true,
           username: params.username,
          password: params.password,
          token: token,
          res:result,
        }))
      }
      if(result[0].identity=="user"){
        return res.send(JSON.stringify({
          msg: 'user login success',
          success:true,
           username: params.username,
          password: params.password,
          token: token,
          res:result,
        }))
      }
      if(result[0].identity=="author"){
        return res.send(JSON.stringify({
          msg: 'author login success',
          success:true,
           username: params.username,
          password: params.password,
          token: token,
          res:result,
        }))
      }
    })
		}
	})
});
// 注册接口
router.post('/adduser', (req, res) => {
	let params = req.body;
  let username = params.username;
	let password = params.password; 
  let email=params.email;
 const sel_sql = `SELECT * FROM users WHERE users.username = '${username}' `
 const add_sql = `INSERT INTO users (username,email,password,identity) values ('${username}','${email}','${password}','user')`
	console.log(sel_sql);
	
	db.query(sel_sql, params.username, (error, results) => {
		if(error) {
			console.log(err);
		}
		if (results.length != 0 && params.username == results[0].username) {
			res.send(JSON.stringify({
        msg:-1,
        res:results
      }));  // -1 表示用户名已经存在
		} 
    else {
			db.query(add_sql, [params.username, params.password], (err, rst) => {
				if (err) {
					console.log(err);
				} else{
					console.log(rst);
          res.send(JSON.stringify({
            msg:0,
            res:results
          })); // 0 表示用户创建成功
				}
			});
		}
	});
});
//添加用户
router.post('/adduser1', (req, res) => {
	let params = req.body;
  let username = params.username;
	let password = params.password; 
  let email=params.email;
  let region=params.region;
 const sel_sql = `SELECT * FROM users WHERE users.username = '${username}' `
 const add_sql = `INSERT INTO users (username,email,password,identity) values ('${username}','${email}','${password}','${region}')`
	console.log(sel_sql);
	
	db.query(sel_sql, params.username, (error, results) => {
		if(error) {
			console.log(err);
		}
		if (results.length != 0 && params.username == results[0].username) {
			res.send(JSON.stringify({
        msg:-1,
        res:results
      }));  // -1 表示用户名已经存在
		} 
    else {
			db.query(add_sql, [params.username, params.password], (err, rst) => {
				if (err) {
					console.log(err);
				} else{
					console.log(rst);
          res.send(JSON.stringify({
            msg:0,
            res:results
          })); // 0 表示用户创建成功
				}
			});
		}
	});
});
//根据新闻id获取新闻
router.get('/news_id', (req, res) => {
  let id = req.query.id
  let sql = `SELECT * FROM news WHERE news.id =${id} `
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})
router.get('/getnews', (req, res) => {
  let id = req.query.id
  let sql = `SELECT * FROM news inner join lanmu on lanmu.LanMuid=news.LanMuid WHERE news.id =${id} `
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})
//左侧管理列表(管理员)
router.get('/manage', (req, res) => {
  let sql = `SELECT * FROM management_taskes`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      res.send(getChildren(results, 0))
    }
  })
})
//左侧管理列表(作者)
router.get('/manage1', (req, res) => {
  let sql = `SELECT * FROM management_taskes1`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      res.send(getChildren(results, 0))
    }
  })
})
//左侧管理列表普通用户
router.get('/manage2', (req, res) => {
  let sql = `SELECT * FROM management_taskes2`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      res.send(getChildren(results, 0))
    }
  })
})
//获取用户列表
router.get('/userlist', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let query=req.query.query
  let sql = `SELECT * FROM users where users.username like '%${query}%' LIMIT ${pagenum*pagesize-pagesize},${pagesize};`
  let sql_last = `SELECT count(*) as num FROM users where users.username like '%${query}%';`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
//搜索用户
router.get('/searchuserlist', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let query=req.query.query
  if(pagenum!=1){
    let n=pagenum-1
     sql = `SELECT * FROM users where users.username like '%${query}%' LIMIT ${(pagenum-n)*pagesize-pagesize},${pagesize};`
  }else{
     sql = `SELECT * FROM users where users.username like '%${query}%' LIMIT ${pagenum*pagesize-pagesize},${pagesize};`
  }
  let sql_last = `SELECT count(*) as num FROM users where users.username like'%${query}%';`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
//根据id获取用户
router.get('/user_id', (req, res) => {
  let id = req.query.id
  let sql = `SELECT * FROM users WHERE users.id = ${id} `
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(JSON.stringify({
        msg:"success",
        result
      }))
    }
  })
})
//修改用户
router.post('/userupdate', (req, res) => {
  let id = req.body.id
  let email=req.body.email
  let region=req.body.region
  let sql = `UPDATE users SET users.email='${email}',users.identity='${region}' WHERE users.id = ${id}`
  db.query(sql,(err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200
      }
      )
    }
  })
})
//
router.post('/changePass', (req, res) => {
  let email=req.body.email
  let username=req.body.username
  let password=req.body.password
  let select_sql=`select * from users where users.email='${email}' and users.username='${username}'`
  let sql = `UPDATE users SET users.password='${password}' WHERE  users.email='${email}' and users.username='${username}'`
  db.query(select_sql,(err, results) => {
    if (err) {
      console.log(err)
    }else if(results.length==0) {
      res.json(
        {
          code:201,
          results
        }
      )
    } else {
      db.query(sql,(err, result) => {
        if (err) {
          console.log(err)
        } else {
          res.json({
            code: 200,
            result
          }
          )
        }
      })
    }
  })
})
//删除用户
router.get('/removeuser', (req, res) => {
  let id = req.query.id
  let sql = `DELETE FROM users WHERE users.id = ${id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200
      })
    }
  })
})
//前台更多获取所有新闻列表
router.get('/news', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let query=req.query.query
  let query1=req.query.query1
  let sql = `SELECT * FROM news inner join lanmu on news.LanMuid=lanmu.LanMuid where news.title like '%${query}%' and lanmu.LanMuname like '%${query1}%' LIMIT ${pagenum*pagesize-pagesize},${pagesize};`
  let sql_last = `SELECT count(*) as num FROM news inner join lanmu on news.LanMuid=lanmu.LanMuid where news.title like '%${query}%' and lanmu.LanMuname like '%${query1}%';`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
router.get('/searchlist', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let query=req.query.query
  let query1=req.query.query1
  if(pagenum!=1){
    let n=pagenum-1
     sql = `SELECT * FROM news inner join lanmu on news.LanMuid=lanmu.LanMuid where news.title like '%${query}%' and lanmu.LanMuname like '%${query1}%' LIMIT ${(pagenum-n)*pagesize-pagesize},${pagesize};`
  }else{
     sql = `SELECT * FROM news inner join lanmu on news.LanMuid=lanmu.LanMuid where news.title like '%${query}%' and lanmu.LanMuname like '%${query1}%' LIMIT ${pagenum*pagesize-pagesize},${pagesize};`
  }
  let sql_last = `SELECT count(*) as num FROM news inner join lanmu on news.LanMuid=lanmu.LanMuid where news.title like'%${query}%' and lanmu.LanMuname like '%${query1}%';`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
//获取新闻图片
router.get('/newspic', (req, res) => {
  let sql = `SELECT * FROM news where news.newspicture like '%http%' ORDER BY news.id DESC LIMIT 5`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(JSON.stringify({
        msg:"success",
        result
      }))
    }
  })
})
//获取栏目1列表
router.get('/news1', (req, res) => {
  let sql = `SELECT * FROM news where LanMuid=1 order by news.id desc LIMIT 10`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(JSON.stringify({
        msg:"success",
        result
      }))
    }
  })
})
//获取栏目2列表
router.get('/news2', (req, res) => {
  let sql = `SELECT * FROM news where LanMuid=2 order by news.id desc LIMIT 10 `
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(JSON.stringify({
        msg:"success",
        result
      }))
    }
  })
})
//获取栏目3列表
router.get('/news3', (req, res) => {
  let sql = `SELECT * FROM news where LanMuid=3 order by news.id desc LIMIT 10`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(JSON.stringify({
        msg:"success",
        result
      }))
    }
  })
})
router.get('/lanmu1', (req, res) => {
  let sql = `SELECT * FROM lanmu LIMIT 1`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(JSON.stringify({
        msg:"success",
        result
      }))
    }
  })
})
router.get('/lanmu2', (req, res) => {
  let sql = `SELECT * FROM lanmu LIMIT 1,1`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(JSON.stringify({
        msg:"success",
        result
      }))
    }
  })
})
router.get('/lanmu3', (req, res) => {
  let sql = `SELECT * FROM lanmu LIMIT 2,1`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(JSON.stringify({
        msg:"success",
        result
      }))
    }
  })
})
//后台获取新闻
router.get('/news_list', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let query=req.query.query
  let uid=req.query.uid
  let sql = `SELECT * FROM news right join lanmu on news.LanMuid=lanmu.LanMuid where news.uid='${uid}' and news.title like '%${query}%' order by news.id desc LIMIT ${pagenum*pagesize-pagesize},${pagesize};`
  let sql_last = `SELECT count(*) as num FROM news where news.uid='${uid}' and news.title like '%${query}%';`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
//搜索新闻
router.get('/searchnewslist', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let query=req.query.query
  let uid=req.query.uid
  if(pagenum!=1){
    let n=pagenum-1
     sql = `SELECT * FROM news inner join lanmu on lanmu.LanMuid=news.LanMuid where news.title like '%${query}%' and news.uid='${uid}' LIMIT ${(pagenum-n)*pagesize-pagesize},${pagesize};`
  }else{
     sql = `SELECT * FROM news inner join lanmu on lanmu.LanMuid=news.LanMuid where news.title like '%${query}%' and news.uid='${uid}' LIMIT ${pagenum*pagesize-pagesize},${pagesize};`
  }
  let sql_last = `SELECT count(*) as num FROM news inner join lanmu on lanmu.LanMuid=news.LanMuid where news.title like'%${query}%' and news.uid='${uid}';`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
//删除新闻
router.get('/removenews', (req, res) => {
  let id = req.query.id
  let sql = `DELETE FROM news WHERE news.id = ${id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200
      })
    }
  })
})
//获取栏目列表
router.get('/lanmulist', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let query=req.query.query
  let sql = `SELECT * FROM lanmu where lanmu.LanMuname like '%${query}%' LIMIT ${pagenum*pagesize-pagesize},${pagesize};`
  let sql_last = `SELECT count(*) as num FROM lanmu where lanmu.LanMuname like '%${query}%';`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
//获取栏目名
router.get('/lanmuname', (req, res) => {
  let sql = `SELECT * FROM lanmu`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(JSON.stringify({
        msg:"success",
        result
      }))
    }
  })
})
//上传图片
const multer = require('multer') // Multer中间件
const fs = require('fs');
const { route } = require('express/lib/application');
//const { append } = require('express/lib/response');
router.post("/upload", multer({
  //设置文件存储路径
  dest: "public/images/",
}).array("file", 1),
function (req, res, next) {
  console.log('进来了')
  let files = req.files;
  let file = files[0];
  let fileInfo = {};
  let path = "public/images/" + Date.now().toString() + "_" + file.originalname;
  let url="http://127.0.0.1:3000/"+Date.now().toString() + "_" + file.originalname
  fs.renameSync("./public/images/" + file.filename, path);
  //获取文件基本信息
  fileInfo.type = file.mimetype;
  fileInfo.name = file.originalname;
  fileInfo.size = file.size;
  fileInfo.path = path;
  fileInfo.url=url
  res.send({
    code: 200,
    msg: "OK",
    data: fileInfo,
  });
}
)
//添加新闻
router.post('/addnews', (req, res) => {
  let sql = `INSERT INTO news (title,newspicture,content,LanMuid,uid,author,newssubmittime) values ('${req.body.news_title}','${req.body.url}','${req.body.content}','${req.body.news_cat}','${req.body.uid}','${req.body.author}','${req.body.time}')`
  if(req.body.uid=='undefined'){
    res.send(JSON.stringify({
      msg:1,
    })); // 0 表示用户创建成功
  }else{
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(JSON.stringify({
          msg:0,
          res:result
        })); // 0 表示用户创建成功
      }
    })
  }
})
//编辑新闻
router.post('/editnews', (req, res) => {
  let sql = `UPDATE news SET title='${req.body.news_title}',content='${req.body.content}' WHERE news.id='${req.body.news_id}'`
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(JSON.stringify({
          msg:0,
          res:result
        })); 
      }
    })
})
//添加栏目
router.post('/addlanmu', (req, res) => {
  let sql = `INSERT INTO lanmu (lanmuName) values ('${req.body.lanmuname}')`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200
      })
    }
  })
})
//搜索栏目
router.get('/searchlanmulist', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let query=req.query.query
  if(pagenum!=1){
    let n=pagenum-1
     sql = `SELECT * FROM lanmu where lanmu.LanMuname like '%${query}%' LIMIT ${(pagenum-n)*pagesize-pagesize},${pagesize};`
  }else{
     sql = `SELECT * FROM lanmu where lanmu.LanMuname like '%${query}%' LIMIT ${pagenum*pagesize-pagesize},${pagesize};`
  }
  let sql_last = `SELECT count(*) as num FROM lanmu where lanmu.LanMuname like'%${query}%';`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
//删除栏目
//添加级联删除
router.get('/removelanmu', (req, res) => {
  let id = req.query.id
  let sql = `DELETE FROM lanmu WHERE lanmu.LanMuid = ${id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200
      })
    }
  })
})

/*
router.get('/exams', (req, res) => {
  let sql = `SELECT * FROM exam`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(JSON.stringify({
        msg:"success",
        result
      }))
    }
  })
})*/
//获取试卷
router.get('/examslizi', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let queryexam=req.query.queryexam
  let sql = `SELECT * FROM exam where exam.examname like '%${queryexam}%' LIMIT ${pagenum*pagesize-pagesize},${pagesize};`
  let sql_last = `SELECT count(*) as num FROM exam where exam.examname like '%${queryexam}%';`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
//前端搜索试卷
router.get('/searchexam', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let queryexam=req.query.queryexam
  if(pagenum!=1){
    let n=pagenum-1
     sql = `SELECT * FROM exam where exam.examname like '%${queryexam}%' LIMIT ${(pagenum-n)*pagesize-pagesize},${pagesize};`
  }else{
     sql = `SELECT * FROM exam where exam.examname like '%${queryexam}%' LIMIT ${pagenum*pagesize-pagesize},${pagesize};`
  }
  let sql_last = `SELECT count(*) as num FROM exam where exam.examname like'%${queryexam}%';`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})

//根据id获取单选
router.get('/exams_id', (req, res) => {
  let id = req.query.id
  let sql = `SELECT * FROM exam right join exam_content on exam_content.examid =exam.id  WHERE exam.id =  ${id} `
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})
//根据id获取多选
router.get('/exams_more_id', (req, res) => {
  let id = req.query.id
  let sql = `SELECT * FROM exam right join exam_content_more on exam_content_more.examid =exam.id  WHERE exam.id ='${id}' `
  let sql_last = `SELECT count(*) as num FROM exam right join exam_content_more on exam_content_more.examid =exam.id  WHERE exam.id = '${id}' `
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              num:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
//根据id获取简答题材料和问题
router.get('/exams_text_id', (req, res) => {
  let id = req.query.id
  let sql = `SELECT * FROM exam_fill_text where exam_fill_text.examid= '${id}' `
  let sql_last = `SELECT count(*) as num FROM exam_fill_text where exam_fill_text.examid= '${id}' `
  db.query({
    sql: sql
  }, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              num:rst[0].num,
              rst,
              result
            }))
        }
      })
    }
  })
})
//根据id获取简答题答案
router.get('/exams_text_anwser', (req, res) => {
  let id = req.query.examkeepid
  let uid=req.query.uid
  let sql = `SELECT * FROM textanwserlist where examid='${id}' and uid='${uid}' `
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(result)
    }
  })
})
//保存学生做的主观题答案
router.post('/addtextanwser', (req, res) => {
    let sql=`SELECT * FROM textanwserlist where textanwserlist.uid= '${req.body.uid}' and examid=${req.body.e_id} and textid=${req.body.t_id} `
    let sql_in = `INSERT INTO textanwserlist (uid,textanwser,examid,textid) values ('${req.body.uid}','${req.body.content}',${req.body.e_id},${req.body.t_id})`
    let sql_update=`UPDATE textanwserlist SET textanwser ='${req.body.content}' where uid='${req.body.uid}' and examid=${req.body.e_id} and textid=${req.body.t_id}`
/* 
db.query(sql_in, (err, result) => {
  if(err){
    console.log(err)
  }else{
    result
  }
})
*/
 db.query(sql, (err, result) => {
      if (result.length===0) {
        db.query(sql_in, (err, result_in) => {
          if(err){
            console.log(err)
          }else{
            res.send(JSON.stringify({
              msg:0,
              res:result_in
            })); // 0 表示用户创建成功
          }
        })
      }else {
        db.query(sql_update, (err, result_up) => {
          if(err){
            console.log(err)
          }else{
            res.send(JSON.stringify({
              msg:0,
              res:result_up
            })); // 0 表示用户创建成功
          }
        })
      }
    })
})
//判断主观题是否打过分
router.get('/isscore', (req, res) => {
  let id = req.query.examkeepid
  let uid=req.query.uid
  let sql = `SELECT minescore FROM score where examid='${id}' and uid='${uid}' `
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else if(result[0].minescore==null) {
      res.send(JSON.stringify({
        msg:0,
      })); // 表示已打分数
    }else{
      res.send(JSON.stringify({
        msg:1,
        result
      })); // 表示未打分数
    }
  })
})
//主观题打分
router.post('/givetextscore', (req, res) => {
  let sql = `update score set minescore='${req.body.have_score}',comment='${req.body.comment}' where examid='${req.body.examid}' and uid='${req.body.uid}'`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200
      })
    }
  })

})
//添加分数
router.post('/addscore', (req, res) => {
  let sql = `INSERT INTO score (uid,testname,allscore,examid,minescore) values ('${req.body.uid}','${req.body.testname}','${req.body.counts}','${req.body.examid}',null)`
  let sql_select=`select * from score where uid='${req.body.uid}' and testname='${req.body.testname}'`
  let sql_up=`update score set allscore='${req.body.counts}',minescore=null,comment=null where uid='${req.body.uid}' and testname='${req.body.testname}'`
  db.query(sql_select, (err, result) => {
    if (result.length===0) {
      db.query(sql, (err, result_in) => {
        if (err) {
          console.log(err)
        } else {
          res.send(JSON.stringify({
            msg:0,
            res:result_in
          })); // 0 表示用户创建成功
        }
      })
    } else {
      db.query(sql_up, (err, result_up) => {
        if (err) {
          console.log(err)
        } else {
          res.send(JSON.stringify({
            msg:0,
            res:result_up
          })); // 0 表示用户创建成功
        }
      })
    }
  })
  /*
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(JSON.stringify({
          msg:0,
          res:result
        })); // 0 表示用户创建成功
      }
    })
  */
  
})
//获取试卷列表
router.get('/examlist', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let query=req.query.query
  let uid=req.query.uid
  let sql = `SELECT * FROM score inner join exam on score.examid=exam.id where score.uid='${uid}' and score.testname like '%${query}%' LIMIT ${pagenum*pagesize-pagesize},${pagesize};`
  let sql_last = `SELECT count(*) as num FROM score inner join exam on score.examid=exam.id where score.uid='${uid}' and score.testname like '%${query}%';`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
//搜索试卷
router.get('/searchexamlist', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let query=req.query.query
  let uid=req.query.uid
  if(pagenum!=1){
    let n=pagenum-1
     sql = `SELECT * FROM score inner join exam on score.examid=exam.id where score.testname like '%${query}%' and score.uid='${uid}' LIMIT ${(pagenum-n)*pagesize-pagesize},${pagesize};`
  }else{
     sql = `SELECT * FROM score inner join exam on score.examid=exam.id where score.testname like '%${query}%' and score.uid='${uid}'  LIMIT ${pagenum*pagesize-pagesize},${pagesize};`
  }
  let sql_last = `SELECT count(*) as num FROM score inner join exam on score.examid=exam.id where score.testname like'%${query}%' and score.uid='${uid}' ;`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
//删除考过的试卷
router.get('/removeexam', (req, res) => {
  let id = req.query.id
  let sql = `DELETE FROM score WHERE score.scoreid = ${id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200
      })
    }
  })
})
//alter级联删除
router.get('/removewholeexam', (req, res) => {
  let id = req.query.id
  let sql = `DELETE FROM exam WHERE exam.id = ${id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200
      })
    }
  })
})
//组卷
router.post('/finishaddexam', (req, res) => {
  let sql = `INSERT INTO exam (examname) values ('${req.body.query_examname}')`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200,
        result
      })
    }
  })
})
//添加单选
router.post('/addsingle', (req, res) => {
  let sql = `INSERT INTO exam_content (qtitle,aA,aB,aC,aD,anwser,examid,score) values ('${req.body.query_singlename}','${req.body.query_A}','${req.body.query_B}','${req.body.query_C}','${req.body.query_D}','${req.body.region}','${req.body.examidsingle}',2)`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200,
        result
      })
    }
  })
})
//添加多选
router.post('/addmore', (req, res) => {
  let sql = `INSERT INTO exam_content_more (qtitle,aA,aB,aC,aD,anwser,examid,score) values ('${req.body.query_morename}','${req.body.query_As}','${req.body.query_Bs}','${req.body.query_Cs}','${req.body.query_Ds}','${req.body.moreregion}','${req.body.examidmore}',2)`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200,
        result
      })
    }
  })
})
//添加简答题
router.post('/addtext', (req, res) => {
let sql = `INSERT INTO exam_fill_text (examid,textcontent,fillscore,anwser) values ('${req.body.examidtext}','${req.body.query_text}',10,'${req.body.anwser}')`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200,
        result
      })
    }
  })
})
//修改单选
router.post('/changesingle', (req, res) => {
  let sql = `update exam_content set qtitle='${req.body.query_singlename}',aA='${req.body.query_A}',aB='${req.body.query_B}',aC='${req.body.query_C}',aD='${req.body.query_D}',anwser='${req.body.region}',examid='${req.body.examidsingle}',score=1, analysis='${req.body.analysis}' WHERE id='${req.body.id}'`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200,
        result
      })
    }
  })
})
//修改多选
router.post('/changemore', (req, res) => {
  let sql = `update exam_content_more set qtitle='${req.body.query_morename}',aA='${req.body.query_As}',aB='${req.body.query_Bs}',aC='${req.body.query_Cs}',aD='${req.body.query_Ds}',anwser='${req.body.moreregion}',examid='${req.body.examidmore}',score=2,analysis='${req.body.analysis}'  WHERE id='${req.body.id}'`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200,
        result
      })
    }
  })
})
//修改材料题
router.post('/changetext', (req, res) => {
  let sql = `update exam_fill_text set examid='${req.body.examidtext}',textcontent='${req.body.query_text}',fillscore=10,analysis='${req.body.analysis}',anwser='${req.body.anwser}'  WHERE Materialid=${req.body.textid}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200,
        result
      })
    }
  })
})
//获取批改试卷信息列表
router.get('/anwserlist', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let sql = `SELECT * FROM (score inner join exam on exam.id=score.examid) inner join users on users.id=score.uid
  LIMIT ${pagenum*pagesize-pagesize},${pagesize};`
  let sql_last = `SELECT count(*) as num FROM (score inner join exam on exam.id=score.examid) inner join users on users.id=score.uid;`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
//获取主观题分数
router.get('/examsscore', (req, res) => {
  let id = req.query.id
  let sql = `select * FROM score WHERE score.examid = '${req.query.examid}' and score.uid='${req.query.uid}'`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200,
        result
      })
    }
  })
})
//随机获取多选题
router.get('/rand_more_id', (req, res) => {
  let id = req.query.id
  let sql = `SELECT * FROM exam_content_more ORDER BY  RAND() LIMIT 10`
  let sql_last = `SELECT count(*) as num FROM exam_content_more WHERE exam_content_more.id = 10 `
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              num:'10',
              rst,
              results
            }))
        }
      })
    }
  })
})
//随机获取单选题
router.get('/rand_single_id', (req, res) => {
  let id = req.query.id
  let sql = `SELECT * FROM exam_content ORDER BY  RAND() LIMIT 10`
  let sql_last = `SELECT count(*) as num FROM exam_content WHERE exam_content.id = 10 `
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              num:'10',
              rst,
              results
            }))
        }
      })
    }
  })
})
//获取评论列表
router.get('/talk', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let newsid=req.query.newsid1
  let sql = `SELECT * FROM talk inner join users on talk.uid=users.id where talk.newsid=${newsid} order by talk.talkid desc  LIMIT ${pagenum*pagesize-pagesize},${pagesize} ;`
  let sql_last = `SELECT count(*) as num FROM talk inner join users on talk.uid=users.id where talk.newsid= ${newsid} ;`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
//添加评论
router.post('/submittalk', (req, res) => {
  let sql = `INSERT INTO talk (nickname,talkcontent,time,uid,newsid) values ('${req.body.nickname}:','${req.body.content}','时间：${req.body.time}','${req.body.uid}','${req.body.newsid2}')`
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.json({
          code: 200,
          result
        })
      }
    })
  })
//单选题列表examquestion
router.get('/siglelist', (req, res) => {
  let id=req.query.id
  let sql = `SELECT * FROM exam_content where examid='${id}'`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(JSON.stringify({
        result
      }))
    }
  })
})
//多选题列表examquestion
router.get('/multiplelist', (req, res) => {
  let id=req.query.id
  let sql = `SELECT * FROM exam_content_more where examid='${id}'`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(JSON.stringify({
        result
      }))
    }
  })
})
//材料题列表examquestion
router.get('/materiallist', (req, res) => {
  let id=req.query.id
  let sql = `SELECT * FROM exam_fill_text where examid='${id}'`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.send(JSON.stringify({
        result
      }))
    }
  })
})
//删除单选
router.get('/removesingle', (req, res) => {
  let id = req.query.id
  let sql = `DELETE FROM exam_content WHERE id = ${id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200
      })
    }
  })
})
//删除多选
router.get('/removemultiple', (req, res) => {
  let id = req.query.id
  let sql = `DELETE FROM exam_content_more WHERE id = ${id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200
      })
    }
  })
})
//删除材料题
router.get('/removematerial', (req, res) => {
  let id = req.query.id
  let sql = `DELETE FROM exam_fill_text WHERE Materialid = ${id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200
      })
    }
  })
})
//根据id查单选examquestion
router.get('/getsigle', (req, res) => {
  let id = req.query.id
  let sql = `select * FROM exam_content WHERE id = ${id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200,
        result
      })
    }
  })
})
//根据id查多选examquestion
router.get('/getmultiple', (req, res) => {
  let id = req.query.id
  let sql = `select * FROM exam_content_more WHERE id = ${id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200,
        result
      })
    }
  })
})
//根据id查材料题examquestion
router.get('/getmaterial', (req, res) => {
  let id = req.query.id
  let sql = `select * FROM exam_fill_text WHERE Materialid = ${id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200,
        result
      })
    }
  })
})
//获取教师列表
router.get('/teachlist', (req, res) => {
  let id = req.query.id
  let sql = `select * FROM teachers`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200,
        result
      })
    }
  })
})
//添加名师信息
router.post('/addteach', (req, res) => {
  let sql = `INSERT INTO teachers (teachername,introduce,teacherpicture,course,checknum) values ('${req.body.teachername}','${req.body.content}','${req.body.url}','${req.body.course}','提取码：${req.body.checknum}')`
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(JSON.stringify({
          msg:0,
          res:result
        })); 
      }
    })
})

//删除名师
router.get('/removeteacher', (req, res) => {
  let id = req.query.id
  let sql = `DELETE FROM teachers WHERE teacherid = ${id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200
      })
    }
  })
})
//根据id查找名师
router.get('/selectteacher', (req, res) => {
  let id = req.query.id
  let sql = `select * FROM teachers WHERE teacherid = ${id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200,
        result
      })
    }
  })
})
//修改名师信息
router.post('/updatateach', (req, res) => {
  let introduce = req.body.content
  let course=req.body.course
  let checknum=req.body.checknum
  let id=req.body.teacherid
  let sql = `UPDATE teachers SET teachers.introduce='${introduce}',teachers.course='${course}',teachers.checknum='提取码：${checknum}' WHERE teachers.teacherid = ${id}`
  db.query(sql,(err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200
      }
      )
    }
  })
})
//获取资料库
router.get('/resources', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let query=req.query.query
  let query1=req.query.query1
  let sql = `SELECT * FROM resource where resourcename like '%${query}%' and resourceteacher like '%${query1}%' LIMIT ${pagenum*pagesize-pagesize},${pagesize};`
  let sql_last = `SELECT count(*) as num FROM resource where resourcename like '%${query}%' and resourceteacher like '%${query1}%';`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
//搜索资料
router.get('/searchresource', (req, res) => {
  let pagenum=req.query.pagenum
  let pagesize=req.query.pagesize
  let query=req.query.query
  let query1=req.query.query1
  if(pagenum!=1){
    let n=pagenum-1
     sql = `SELECT * FROM resource where resourcename like '%${query}%' and resourceteacher like '%${query1}%' LIMIT ${(pagenum-n)*pagesize-pagesize},${pagesize};`
  }else{
     sql = `SELECT * FROM resource where resourcename like '%${query}%' and resourceteacher like '%${query1}%' LIMIT ${pagenum*pagesize-pagesize},${pagesize};`
  }
  let sql_last = `SELECT count(*) as num FROM resource where resourcename like '%${query}%' and resourceteacher like '%${query1}%';`
  db.query({
    sql: sql
  }, (err, results) => {
    if (err) {
      console.log(err)
    } else {
      db.query(sql_last, (err, rst) =>{
        if (err) {
					console.log(err);
				}else{
            res.send(JSON.stringify({
              pagenum:req.query.pagenum,
              total:rst[0].num,
              rst,
              results
            }))
        }
      })
    }
  })
})
//添加资料
router.post('/addresource', (req, res) => {
  let sql = `INSERT INTO resource (resourcename,resourceteacher,resourcelink,resourcenum) values ('${req.body.resourcename}','${req.body.resourceteacher}','${req.body.resourcelink}','${req.body.resourcenum}')`
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        res.send(JSON.stringify({
          msg:0,
          res:result
        })); 
      }
    })
})
//删除资料
//删除名师
router.get('/removeresource', (req, res) => {
  let id = req.query.id
  let sql = `DELETE FROM resource WHERE resourceid = ${id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200
      })
    }
  })
})
//根据id查资料
router.get('/resource_id', (req, res) => {
  let id = req.query.id
  let sql = `select * FROM resource WHERE resourceid = ${id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200,
        result
      })
    }
  })
})
//修改资料信息
router.post('/updataresource', (req, res) => {
  let sql = `UPDATE resource SET resourcename='${req.body.resourcename}',resourceteacher='${req.body.resourceteacher}',resourcelink='${req.body.resourcelink}',resourcenum='${req.body.resourcenum}' where resourceid='${req.body.resourceid}'`
  db.query(sql,(err, result) => {
    if (err) {
      console.log(err)
    } else {
      res.json({
        code: 200
      }
      )
    }
  })
})



module.exports = router