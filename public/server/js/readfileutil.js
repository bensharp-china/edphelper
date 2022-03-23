const fs=require('fs');
let out="";
const path=require('path');
function outputfile(filepath){
out=fs.readFileSync(filepath,'utf-8');
return out;
}

function filefoldermaker(systempicpath,shppicfolder)
{
    fs.exists(path.join(systempicpath,shppicfolder), function(exists) {
        if(exists){
          console.log("目录已经存在！");
        }else{
          fs.mkdir(path.join(systempicpath,shppicfolder),function(err){
              if (err) {
                  return console.error(err);
              }
              console.log("目录创建成功！");
           });
        }
      
  });
}
module.exports={outputfile,filefoldermaker}