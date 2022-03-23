

/** 工具模块：数据库访问与处理
@module mysqldatautil
*/
var mysql = require('mysql'); 
var querystring = require('querystring');
const path=require('path');
const config=require(path.join(__dirname, "../../config.js"));



//当前使用的数据库
var localdb_config={ 
  host     : config.localmysqlhost.host,
  user     : config.localmysqlhost.user,
  password : config.localmysqlhost.password,
  port: config.localmysqlhost.port,
  database: config.localmysqlhost.database
}

var client = mysql.createPool(localdb_config); 



/**从外部提交数据通用方法
@param {object} req 原网页中的请求体
@param {object} res 原网页中的响应体
@param {string} qstring 提交查询语句
@param {object} callback 回调函数，用于在本函数体以外放入所提交内容。格式可以是JOSON,或者一个[]数组
*/
function dopost(qstring,callback,req,res)
{     let str="";
////MYSQL部分
  req.on('data', data => {
    str += data
  });
 ///////                                                    
  req.on('end', function () {
    str= decodeURI(str);
    var dataObject = querystring.parse(str);

    var contentq= callback(dataObject);
    if(contentq.flag){
      res.send({flag:contentq.flag});
      return;
    }
    dataquery(qstring,contentq,res,'post');
 
})
}

/**从外部查询数据通用方法
@param {string} condition 查询条件
@param {object} res 原网页中的响应体
@param {string} qstring 查询语句
@param {string} querymode 请求方式，get post checkexit 或者delete
*/
function dataquery(qstring,condition,res,querymode)
{   client.getConnection(function(err,connection){
  connection.query(qstring,condition,function selectCb(err, results, fields) {
    if (err) { 
        throw err; 
      } 
       if(results.length>0)
        {

switch (querymode) {
  case 'get':
    res.send(results);
    break;
case 'post':
case 'delete':
  res.send({flag:"succeed"});
  break;
  case 'checkexit':
        switch (results.length) {
         case 0:
          res.send({flag:"failed"});
          break;
         default: 
         res.send({flag:"succeed"});
          break;
        }
    break;
  default:
    break;
} 
        }
        else{res.send({flag:"havenodata"});
    
      }
        connection.release();
})


})
  
}
/**从内部查询数据通用方法
@param {string} condition 查询条件
@param {string} qstring 查询语句
@param {string} resolve promise的resolve对象，用于线性执行JS
*/
function databasequeryin(qstring,condition,resolve){
   client.getConnection(function(err,connection){
   connection.query(qstring,condition,function selectCb(err, results, fields) {
      if (err) { 
        throw err; 
      } 
  
     if(results.length>0){
    
      resolve(results);}

      else {
       
        resolve({userflag:'false'});
      }
     
    })
    connection.release();
  })
}

/**测试数据库是否连通，结果返回到console.

*/
function testconnect(){
 var connection = mysql.createConnection(localdb_config);
 connection.connect(function(err) { 
 if(err){  

console.log(err);
}
   else{
  console.log("连接成功！")
   }

   })


}

/////
module.exports={dataquery,dopost,testconnect,databasequeryin}
