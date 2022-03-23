
/*工具模块：用户登录，依赖于数据库访问和处理模块 */

const path=require('path');
const mysql=require(path.join(__dirname, "./mysqldatautil.js"));        
const config=require(path.join(__dirname, "../../../config.js"));
var querystring = require('querystring');


//读取二级菜单数据
function getsecondmenu(req,res){
  var dataquery='select brolefunctionname,brolefunctionlocat from cf_brole_function where nodebelong=?';

  const promise = new Promise((resolve, reject) => {
    mysql.databasequeryin(dataquery,req.query.functionid,resolve);
    });
    promise.then(function(data){
    
    if(data){
      var secmenusloc= [];
      var secmenuname=[];
      for(var i=0;i<data.length;i++){
        secmenusloc.push(config.mybloghost+data[i].brolefunctionlocat);
    }
    for(var i=0;i<data.length;i++){
      secmenuname.push(data[i].brolefunctionname);
  }
  var str={
    "secmenusloc":secmenusloc,
    "secmenuname":secmenuname
  }

   res.send(str)
            }
            else {
            
            }
        })
}

//验证功能权限

function verifyfunction(func,req,res) {
  var hostname= config.mybloghost;
  var dataquery='select 1 from cf_brole_function a,cf_brole_and_function b where a.brolefunctionid=b.brolefunctionid and b.isenable=1 and a.brolefunctionlocat=? and b.broleid=?;';
  var queryrole='select broleid from cf_buser where user_id=?';
  const promise1= new Promise((resolve, reject) => {
    mysql.databasequeryin(queryrole,req.session.user_id?req.session.user_id:2,resolve);

  })
  promise1.then(function(data) {

    const promise2 = new Promise((resolve, reject) => {
      mysql.databasequeryin(dataquery,[func,data[0].broleid],resolve);
      });
  
      promise2.then(function(data){
        var funcd=func.slice(1);
      
        if(!data.userflag){
         
          switch (funcd) {
            case 'insertfixissue':
              res.render('insertfixissue.ejs',{host:hostname});
              break;
              case 'seefixissue':
                res.render('contentdisplay.ejs',{host:hostname});
                break;
                case 'sysconfig':
                  res.render('config.ejs',{host:hostname});
                  break;
                  case 'addcontacts':
                    res.render('addcontacts.ejs',{host:hostname});
                  break;
                   case 'viewcontacts':
                     res.render('viewcontacts.ejs',{host:hostname});
                    break;
            default:
              break;
          }
         
                }
  
                else{
                  res.render('401.ejs');
                }
            }
            
            )
  })
}

///取用户目录信息


function getuserimfor(req,resolve){
  var dataquery='select * from cf_userinformation where user_id=?';
  const promise = new Promise((resolve, reject) => {
    mysql.databasequeryin(dataquery,req.session.user_id,resolve);
    });
    promise.then(function(data){
    
    if(data){
      
      var umenus= [];
      var upages=[];
      var functionids=[];
        
    
      for(var i=0;i<data.length;i++){
        umenus.push(data[i].brolefunctionname);
      }

      for(var i=0;i<data.length;i++){
        upages.push(config.mybloghost+'/getsecondmenus');
    }
    for(var i=0;i<data.length;i++){
      functionids.push(data[i].brolefunctionid);
  }
   var str={"host":  config.mybloghost,
     "username":data[0].user_nicname,
     "userid":data[0].user_id,
    "userprofilepic":data[0].user_profile_photo,
    "functionids":functionids,
    "menus":umenus,
    "pages":upages
  
  }

      resolve(str);
            }
        }
        
        )
        
     
}
//验证用户
function scanuser(req,resolve){
  var q='select user_id from cf_buser where user_id=?';
  var tmp;
  if(req.session.user_id){
  tmp=req.session.user_id; 
}
   else{
    tmp='2';
   }


const promise = new Promise((resolve, reject) => {


mysql.databasequeryin(q,tmp,resolve);
});
promise.then(function(data){

if(data){
    req.session.user_id=data[0].user_id;

    getuserimfor(req,resolve);
}
else{
  return;
}

});
}
//登出用户
function logout(req,res){

var q='select user_id from cf_buser where user_id=?';
  const promise = new Promise((resolve, reject) => {
  mysql.databasequeryin(q,'2',resolve);
  });
  promise.then(function(data){
  //zheli
  if(data){
    req.session.user_id=data[0].user_id;
  res.send({flag:'登出成功！'});

 }
  else{
    return;
  }
  
  });
}

//用户登录
function login(req,resolve){
  var q;
  var tmp;
  //
 var str="";
 req.on('data', data => {
  str += data
});
req.on('end', function () {
  str= decodeURI(str);
  var dataObject = querystring.parse(str);
  tmp=[dataObject.user_name,dataObject.user_passwd];
  q='select user_id from cf_buser where user_name=? and user_passwd=?';
  const promise = new Promise((resolve, reject) => {
    mysql.databasequeryin(q,tmp,resolve);
    });
    promise.then(function(data){
        console.log(data)
    if(data.length>0){
      req.session.user_id=data[0].user_id;
        resolve(data);
  
    }else{
      resolve({user_id:'undefineduser'});
   
    }

    
    });
});
//
  

 
};



module.exports={scanuser,logout,login,getsecondmenu,verifyfunction};