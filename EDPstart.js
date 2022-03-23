const express = require('express');
const app = express();
var fs = require('fs')
const path=require('path');
const mysqld=require(path.join(__dirname, "./public/server/js/mysqldatautil.js"));
const verifyuser=require(path.join(__dirname, "./public//server/js/verifyuser.js"));
const config=require(path.join(__dirname, "./config.js"));
const tool=require(path.join(__dirname, "./public/server/js/tools.js"));
const read=require(path.join(__dirname, "./public/server/js/readfileutil.js"));
app.set('view engine','ejs');//设置模板引擎是什么  
//app.set('views',__dirname+'\\views');//设置模板引擎的目录
app.use('/xt',express.static(__dirname + '\\public'));
mysqld.testconnect();

var session = require('express-session');
//const { resolve } = require('path');
//tool.menugenerate();
app.use(session({
  secret: 'tvxqcooler',//与cookieParser中的一致
  resave: true,
  saveUninitialized:true,
  cookie:{
    maxAge: 1000*60*10 // default session expiration is set to 10 minite
}
}));







app.use('/index',function(req,res){

  const promise = new Promise((resolve, reject) => {
  verifyuser.scanuser(req,resolve);
});
    
promise.then(function(data){
   res.render('mainpages/index.ejs',data);

})
})




app.use('/content',function(req,res){

  const promise = new Promise((resolve, reject) => {
  verifyuser.scanuser(req,resolve);
});
    
promise.then(function(data){
   res.render('contentinsert.ejs',data);

})
})

app.use('/login',function(req,res){

  const promise = new Promise((resolve, reject) => {
  verifyuser.scanuser(req,resolve);
});
    
promise.then(function(data){

   res.render('mainpages/login.ejs',data);

})
})

app.use('/goonlogin',function(req,res){

  const promise = new Promise((resolve, reject) => {
  verifyuser.login(req,resolve);
});
    
promise.then(function(data){

    if(data){
      res.send(data);
    }

})
})

app.use('/logout',function(req,res){

  
  verifyuser.logout(req,res);

    

})


//
app.use('/getmenutree',function(req,res){
  
res.send(read.outputfile(path.join(__dirname,'./files/menudata.html')));
})


//数据获取功能
app.use('/getroleimfor',function(req,res){
   var s='select * from cf_brole;'
 mysqld.databasequery(s,'',res,'get');
 


})
//获取单个角色拥有的权限和没有的权限
app.use('/getrolemenuimfor',function (req,res){
  
  
})
app.use('/getroleandfunc',function(req,res){
  var s='select b.user_nicname,b.user_name,a.brolename,a.broleid,b.user_id from cf_brole a,cf_buser b where a.broleid=b.broleid ;';
 
  mysqld.databasequery(s,'',res,'get');

})


app.use('/getcontactmes',function(req,res){
  var s='SELECT * FROM cf_contact order by contactid;'
mysqld.databasequery(s,'',res,'get');

})


app.use('/getcontactmesbyname',function(req,res){
  var s='SELECT * FROM cf_contact where contactname like ?;'
mysqld.databasequery(s,'%'+req.query.contactname+'%',res,'get');

})



app.use('/selectissues',function(req,res){
  var s='SELECT * FROM cf_fixissues where issues_title like ?;'
mysqld.databasequery(s,'%'+req.query.issues_title+'%',res,'get');

})




app.use('/selectissuesbyid',function(req,res){
  var s='SELECT * FROM cf_fixissues where issues_id=?;'
mysqld.databasequery(s,req.query.issues_id,res,'get');

})
//获取二级菜单
app.use('/getsecondmenus',function (req,res) {
  verifyuser.getsecondmenu(req,res);
})
//具体功能

app.use('/insertfixissue',function(req,res){
  verifyuser. verifyfunction('/insertfixissue',req,res);
 })

 
app.use('/seefixissue',function(req,res){
  verifyuser. verifyfunction('/seefixissue',req,res);

 })
 app.use('/sysconfig',function(req,res){
  verifyuser. verifyfunction('/sysconfig',req,res);

 })


 app.use('/addcontacts',function(req,res){
  verifyuser. verifyfunction('/addcontacts',req,res);

  
})

app.use('/viewcontacts',function(req,res){
  verifyuser. verifyfunction('/viewcontacts',req,res);

  
})
//提交内容

//更改用户角色
app.use('/modifyuserrole',function(req,res){
 
  var q="update cf_buser set broleid=? where user_id=?";
  
    mysqld.dopostd(q,function(content) {
     return [
      content.broleid,
       content.user_id
      ]
    },req,res);
  })
//
app.use('/contactsubmit',function(req,res){
 
var q="insert into cf_contact set ?";

  mysqld.dopostd(q,function(content) {
    if(tool.limitinput(content.contactname,'contactname')|tool.limitinput(content.contactnum,'phonenum')|tool.limitinput(content.contactaddress,'contactaddress')|tool.limitinput(content.contactperson,'contactperson'))
    {
    return {flag:'字符超限！'};
  }
      
   return {
      contactname: content.contactname,
      phonenum:content.contactnum,
      contactaddress:content.contactaddress,
      contactperson:content.contactperson
      
    }
  },req,res);
})
////
app.use('/delcontact',function(req,res){
  var d=req.query.contactid.slice(3);

  var q="delete from cf_contact where contactid=?";
mysqld.databasequery(q,d,res,'get');

  })
////contactmodify

app.use('/contactmodify',function(req,res){

 
  var q="update cf_contact set contactname=?,phonenum=?,contactaddress=?,contactperson=? where contactid=?";

  mysqld.dopostd(q,function(content) {
    if(tool.limitinput(content.contactname,'contactname')|tool.limitinput(content.contactnum,'phonenum')|tool.limitinput(content.contactaddress,'contactaddress')|tool.limitinput(content.contactperson,'contactperson'))
    {
    return {flag:'字符超限！'};
  }
   return [
    
      content.contactname,
     content.contactnum,
    content.contactaddress,
      content.contactperson,
      content.contact_id
    ]
   
  },req,res);

  })

  app.use('/submitissue',function(req,res){
    var q="insert into cf_fixissues set ?";

  mysqld.dopostd(q,function(content) {
    if(tool.limitinput(content.issues_title,'issuestitle')|tool.limitinput(content.issues_content,'issuescontent'))
    {
    return {flag:'字符超限！'};
  }

   return {
      issues_title: content.issues_title,
      issues_content: tool.normalizeinput(content.issues_content),
      issues_category_id:content.issues_category_id 
    }
  },req,res);
  })


  app.use('/getissuescategory',function(req,res){
    var s='SELECT * FROM cf_fixissues_category;'
mysqld.databasequery(s,'',res,'get');
  })
///


app.use('/install',function(req,res){

  res.render("installwebsite.ejs",{ajaxdir:config.mybloghost});
})


app.use('/installdbs',function(req,res){
 fs.stat(configfilepath, function(err,Stats) {
  
    if(!Stats.isFile()){
      fs.writeFile(configfilepath, '',  function(err) {
        if (err) {
            return console.error(err);
        }
    })
    }else{
    fs.appendFile(configfilepath,'',function(error){
      if(error){
        console.log(error);
        return false;
      }
      console.log('写入成功');
    })}
});

 res.sendStatus(200);
})



app.use('/404',function(req,res){
 
  res.render("404.ejs");
  
})

   console.log('the port:'+config.serverPort+" has already!")  ;
app.listen(config.serverPort);