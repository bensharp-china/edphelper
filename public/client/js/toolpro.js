
/**工具模块：验证输入 */
// 日期
var datechck=/^(\d{4})(-|\/)(\d{1,2})\2(\d{1,2})$/ ;
//空
var emptychck=/\S/;
//纯数字验证
var numchck=/^[0-9]*$/;
//身份证
var identifychck=/^\d{15}|\d{18}$ /;
//账号
var accountchck=/^[a-zA-Z]\w{0,}$/;
//密码
var passwordchck=/^[A-Za-z0-9]\w{0,}$/;
//数据库名称，不能只是数字
var databasenamechck=/^[a-zA-Z]\w{1,}$/;
//IP地址
var ipaddresschck=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/

function cf_checkinput(content,what){
    var result;
switch(what)
{ 
  case 'date':
    result=content.match(datechck);
  
    break;
    case 'empty':
    result=content.match(emptychck); 
      break;
      case 'num':
      result=content.match(numchck);  
      break;
      case 'indentify':
      result=content.match(identifychck);  
      break;
      case 'account':
      result=content.match(accountchck);
      break;
      case 'password':
        result=content.match(passwordchck);
        break;
        case 'databasename':
          result=content.match(databasenamechck);
        break;  
        case 'ipaddress':
          result=content.match(ipaddresschck);
          break;
}

 return result?true:false;

}


function cf_erralert(){

}