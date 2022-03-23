
var configs= {
    //基础配置
    serverPort: '3340',
   //mybloghost:'http://coachfox.cn/EDPprotal',
mybloghost:'http://127.0.0.1:3340',
    //database信息
   // database:'zuisudata',

    //mysql数据库链接配置信息
  localmysqlhost:{
        host:'132.232.109.62',
        user:'xiabin',
       
        //服务器上的密码用下面这个
        password:'753951xh',
        port:'3306',
        database:'EDPhelper'},

 //数据库连接
  /* localmysqlhost:{
    host:'127.0.0.1',
    user:'xiabin',
    //服务器上的密码用下面这个
    password:'741862xh',
    port:'3306',
    database:'edphelper'},*/

 // 系统基础配置
  beseconfig:{
    configpageallow:2,
    commontitlelimit:45,
    commonshorttitlelimit:20,
    commonlongcontentlimit:60000
  },
  //初始化设置
  systemname:''

};


module.exports=configs



