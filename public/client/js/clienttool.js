function makehtmlnode(data,datatype,nodetype,nodeparent){
    var da="";
    switch (nodetype) {
        case 'select':
            switch (datatype) {
                case 'contact':
                    for(var i=0;i<data.length;i++){
                        da+=" <tr><td id=\"ctn"+data[i].contactid+"\">"+data[i].contactname+"</td><td id=\"ctp"+data[i].contactid+"\">"+data[i].contactperson+"</td><td id=\"ctph"+data[i].contactid+"\">"+data[i].phonenum+"</td><td id=\"cta"+data[i].contactid+"\">"+data[i].contactaddress+"</td>"+
                          "<td><input id=\"mod"+data[i].contactid+"\" type=\"button\" value=\"修改\" onclick=\"modifywindow(this)\" />&nbsp<input id=\"del"+data[i].contactid+"\" type=\"button\"  onclick=\"delcontact(this)\" value=\"删除\"/></td></tr>";
                      }
                    $('#'+nodeparent).html(da); 
                    break;
           
            }
   
         break;
    
       
    }

}