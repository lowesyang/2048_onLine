(function(){
    var GAME=require("game");
    var self=new GAME("self");
    var com=new GAME("com");

    if(!window.WebSocket){
        alert("您的浏览器不支持多人2048，请升级！");
        window.close();
    }
    var userInfo=getUserInfo();
    var ws=new WebSocket("ws://127.0.0.1:9501");

    ws.userName=userInfo.userName;
    ws.roomId=userInfo.roomId;
    ws.token=userInfo.token;
    ws.onopen=function(){
        console.log("connection success");
        self.init(ws);
        com.init();
        var info={      //加入房间
            code:0,
            user:userInfo.userName,
            roomId:userInfo.roomId,
            token:userInfo.token,
            beginPos:self.beginPos
        };
        var msg=JSON.stringify(info);
        ws.send(msg);
        self.createBlock();
    };

    ws.onmessage=function(e){
        var res=JSON.parse(e.data);
        console.log(res);
        if(res.code==-1){
            alert("对方已离开房间,您可以继续玩！");
            com.init();
        }
        if(res.code==1){
            //alert("游戏开始！");
            com.setNameBox(res.comp);
            com.beginPos=res.beginPos; //每次同步方块生成队列
            com.createBlock();
        }
        if(res.code==2){
            //console.log(res.actionCode);
            com.beginPos=res.beginPos;
            com.slide(res.actionCode);
        }
        if(res.code==3){    //胜利信息
            alert("你赢了,可以继续玩!");
        }
    };

    ws.onclose=function(){
        console.log("断开连接");
    };

    ws.onerror=function(){
        console.log("error");
    };

    function getUserInfo(){
        var userName;
        while(typeof userName=='undefined' || userName=="" || userName==null){
            userName=prompt("请输入您的昵称~");
        }
        var roomId;
        while(typeof roomId=='undefined' || roomId=="" || userName==null){
            roomId=prompt("请输入房间号");
        }
        var token=Math.random()*100000000;
        return{
            userName:userName,
            roomId:roomId,
            token:token
        }
    }
})();