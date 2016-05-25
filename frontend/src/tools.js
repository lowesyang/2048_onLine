function getUserInfo(){
    var userName;
    while(typeof userName=='undefined' || userName=="" || userName==null){
        userName=prompt("请输入您的昵称~");
    }
    var roomId;
    while(typeof roomId=='undefined' || roomId=="" || userName==null){
        roomId=prompt("请输入房间号");
    }
    var token=Math.random()*1000000000000;  //为每个用户创建唯一的随机token（范围很大，产生重复的概率较少）
    return{
        userName:userName,
        roomId:roomId,
        token:token
    }
}

function asyncAlert(text){
    setTimeout(function(){
        alert(text);
    },0);
}

module.exports={
    getUserInfo:getUserInfo,
    asyncAlert:asyncAlert
}