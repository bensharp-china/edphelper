


const path=require('path');
var fs = require("fs");
const mysqld=require(path.join(__dirname, "./mysqldatautil.js"));        
const config=require(path.join(__dirname, "../../../config.js"));
const menudatapath=path.join(__dirname, "../../files/menudata")
//菜单生成
var uniqueId = 0;

//

var cfCore = {};
//
//准备放弃此方法
function menugenerate(createtype,roleid){
  // roleid =roleid || {};
var d='select * from cf_brole_function';
var s='select a.* from cf_brole_function a ,cf_brole_and_function b where a.brolefunctionid=b.brolefunctionid  and b.broleid=?';
switch (createtype) {
    case 'all':
        const promise1 = new Promise((resolve, reject) => {
            mysqld.databasequeryin(d,'',resolve);
          })
          const promise2 = new Promise((resolve, reject) => {
            mysqld.databasequeryin(s,'roleid',resolve);
          })
          Promise.all([promise1, promise2]).then(function(results){
          
              var data={'menus':[]};
                   for(var i=0;i<results[0].length;i++){
                      if(results[0][i].nodetype==0)
                      {    
                        data.menus.push({
                       'brolefunctionid': results[0][i].brolefunctionid,
                       'brolefunctionname':results[0][i].brolefunctionname,
                       'brolefunctionlocat':results[0][i].brolefunctionlocat,
                       'disable':'y',
                       'child':''
                      })
                    }}
                  
                    for(var j=0;j<data.menus.length;j++){
                var menusd={'menus':[]};
                          for(var k=0;k<results[0].length;k++){
                            if(results[0][k].nodebelong==data.menus[j].brolefunctionid){
                                {
                                    menusd.menus.push({
                                        'brolefunctionid': results[0][k].brolefunctionid,
                                        'brolefunctionname':results[0][k].brolefunctionname,
                                        'brolefunctionlocat':results[0][k].brolefunctionlocat,
                                        'disable':'y',
                                        'child':''
                                       })
                                    
                                    data.menus[j].child=menusd;
                                   
                            }
                        }
                          }
                    
                }
        
         
           var finalmenu="<ul id=\"cf_menu\">"+menuAssembler(data)+'</ul>';
          // 将生成的菜单写入文件。
        
                fs.writeFile(menudatapath,finalmenu,{} , function(err) {
                    if (err) {
                        throw err;
                    }
                
                })
           
         
             
         });
        break;
    case 'role':

    break;
}


}


//深层复制对象
function type(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
}
function objId(obj) {
    if (!obj['__id']) {
        Object.defineProperty(obj, '__id', { value: ++uniqueId });
    }
    return obj['__id'];
}
 function deepClone(o, visited) {
    visited = visited || {};

    var clone, id;
    switch (type(o)) {
        case 'Object':
            id = objId(o);
            if (visited[id]) {
                return visited[id];
            }
            clone = /** @type {Record<string, any>} */ ({});
            visited[id] = clone;

            for (var key in o) {
                if (o.hasOwnProperty(key)) {
                    clone[key] = deepClone(o[key], visited);
                }
            }

            return /** @type {any} */ (clone);

        case 'Array':
            id = objId(o);
            if (visited[id]) {
                return visited[id];
            }
            clone = [];
            visited[id] = clone;

            (/** @type {Array} */(/** @type {any} */(o))).forEach(function (v, i) {
                clone[i] = deepClone(v, visited);
            });

            return /** @type {any} */ (clone);

        default:
            return o;
    }
}

//菜单组装器
function menuAssembler(data){
   var menustring='';
    for(var i=0;i<data.menus.length;i++){
        
        if(data.menus[i].child){   
            menustring+='<li>'+data.menus[i].brolefunctionname+'&nbsp&nbsp<input type=\"checkbox\" id=\"'+data.menus[i].brolefunctionid+'\" /><ul>'+
            menuAssembler(data.menus[i].child)
           + "</ul></li>";
        }else{
            menustring+='<li>'+data.menus[i].brolefunctionname+ '&nbsp&nbsp<input type=\"checkbox\" id=\"'+data.menus[i].brolefunctionid+'\"></li>';
        }
        
    }
 
    return menustring;
}


//输入规范化
 function normalizeinput(str){
    if(str.length == 0) return "";
             s = str.replace(/&/g,"&amp;");
             s = s.replace(/</g,"&lt;");
             s = s.replace(/>/g,"&gt;");
             s = s.replace(/ /g,"&nbsp;");
             s = s.replace(/\'/g,"&#39;");
             s = s.replace(/\"/g,"&quot;");
             return s;  


 }
//限制字符量输入
function limitinput(str,type){
    switch (type) {
        case 'contactname':
        case 'contactaddress':
        case 'issuestitle':
            return getBytesLength(str)>=config.beseconfig.commontitlelimit
        case 'contactperson':
        case 'phonenum':
            return getBytesLength(str)>=config.beseconfig.commonshorttitlelimit
        case 'issuescontent':
            return getBytesLength(str)>=config.beseconfig.commonlongcontentlimit
        
  
        

    }

    
   
}
//获取字符串字节大小
function getBytesLength(str) {   
    var totalLength = 0;     
    var charCode;  
    for (var i = 0; i < str.length; i++) {  
        charCode =str.charCodeAt(i);  
        if (charCode < 0x007f)  {     
            totalLength++;     
        } else if ((0x0080 <= charCode) && (charCode <= 0x07ff))  {     
            totalLength += 2;     
        } else if ((0x0800 <= charCode) && (charCode <= 0xffff))  {     
            totalLength += 3;   
        } else{  
            totalLength += 4;   
        }          
    }  
    return totalLength;   
}  


//菜单生成器
function menugenerateall(roleid){
    var d='select * from menuview where broleid=?';
    const promise= new Promise((resolve, reject) => {
        if(roleid){
        mysqld.databasequeryin(d,roleid,resolve);
    } 
      });
   promise.then(function(data){
  console.log(data)
   // mkmenu(data);
   })


  
    
}

function mkmenu(data){
    var menu=[];

   //做菜单映射
   digui(menu);

//读取映射然后拼装MNEU
/*for(var k=0;k<menuys.length;k++){
    if(menuys[k].menuid==data[k].brolefunctionid)
    {  
        var menuno={"menuid":data[k].brolefunctionid,
         "text":data[k].brolefunctionname,
         "url":data[k].brolefunctionlocat,
         "child":[]
          
        }
        
        if(menuys[k].child.length!=0){
        for(var q=0;q<menuys[k].child.length;q++){
//再来个FOR循环，从data里面取出brolefunctionid和menuys[k].child[i]相等的数据 然后在push进menuno.child
          for(var z=0;z<data.length;z++){
              if(menuys[k].child[q]==data[z].brolefunctionid){
                var nodet={"menuid":data[z].brolefunctionid,
                "text":data[z].brolefunctionname,
                "url":data[z].brolefunctionlocat,
                "child":[]}
              }
              menuno.child.push(nodet); 
          }
      
          menu.push(menuno);
            
        }
    }

    
    }
}*/
    
    console.log(menu)  ;
 
     return menu;
}

//递归函数
function digui(menu){
    for(var i=0;i<data.length;i++){
        var d={"menuid":data[i].brolefunctionid,"child":[]};
        for(var j=0;j<data.length;j++){
            if(data[i].brolefunctionid==data[j].parentid){
             d.child.push(data[j].brolefunctionid);
                           digui(data[j]);
            }
        }
        menu.push(d);
            }
}

module.exports={menugenerate,deepClone,normalizeinput,getBytesLength,limitinput,menugenerateall}