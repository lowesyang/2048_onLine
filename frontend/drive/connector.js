(function(){
    var GAME=require("game");
    var tools=require("tools");
    var self=new GAME("self");
    var com=new GAME("com");
    var readyBtn=document.getElementById("readyBtn");
    var comState=document.getElementsByClassName("state")[0];

    readyBtn.isClick=1;
    readyBtn.addEventListener("click",getReady);

    if(!window.WebSocket){
        alert("您的浏览器不支持多人2048，请升级！");
        window.close();
    }
    var userInfo=tools.getUserInfo();
    var ws=new WebSocket("ws://127.0.0.1:9501");

    ws.userName=userInfo.userName;
    ws.roomId=userInfo.roomId;
    ws.token=userInfo.token;
    ws.onopen=function(){
        console.log("connection success");
        self.setNameBox(userInfo.userName);
        var info={  //有玩家进入
            code:100,
            user:userInfo.userName,
            roomId:userInfo.roomId,
            token:userInfo.token
        };
        ws.send(JSON.stringify(info));
    };

    ws.onmessage=function(e){
        var res=JSON.parse(e.data);
        //console.log(res);
        if(res.code==100){
            com.setNameBox(res.comp);
            readyBtn.isClick=0;
        }
        if(res.code==-50){  //房间已满
            userInfo.roomId=prompt("房间已满，请重新输入房间号:");
            while(typeof userInfo.roomId=='undefined' || userInfo.roomId==""){
                userInfo.roomId=prompt("房间已满，请重新输入房间号:");
            }
            ws.roomId=userInfo.roomId;
            var info={
                code:100,
                user:userInfo.userName,
                roomId:userInfo.roomId,
                token:userInfo.token
            };
            ws.send(JSON.stringify(info));
        }

        if(res.code==0){    //准备
            comState.innerHTML="已准备";
            comState.style.color="coral";
        }
        if(res.code==-1){
            tools.asyncAlert("对方已离开房间,您可以继续玩！");
            com.init();
            com.setNameBox("虚位以待");
            pageStateInit();
        }
        if(res.code==1){
            comState.innerHTML="进行中";
            comState.style.color="coral";
            readyBtn.innerHTML="进行中";
            readyBtn.backgroundColor="coral";
            //alert("游戏开始！");
            self.createBlock();
            com.beginPos=res.beginPos; //每次同步方块生成队列
            com.createBlock();
        }
        if(res.code==2){
            //console.log(res.actionCode);
            for(var i=0;i<res.beginPos.length;i++){
                var pos=res.beginPos[i],flag=0;
                for(var j=0;j<com.beginPos.length;j++){
                    var tmp=com.beginPos[j];
                    if(pos.x==tmp.x && pos.y==tmp.y && pos.num==tmp.num){
                        flag=1;
                        break;
                    }
                }
                if(!flag) com.beginPos.push(pos);
            }
            //com.beginPos=com.beginPos.concat(res.beginPos);  //一定要用数组连接，否则会因异步传输导致动作信息丢失
            com.slide(res.actionCode);
        }
        if(res.code==3 || res.code==-3 || res.code==66){//胜利或失败信息
            if(res.code==3) tools.asyncAlert("你赢了!");
            else if(res.code==-3) tools.asyncAlert("你输了!");
            else tools.asyncAlert("平局！");
            pageStateInit();
            com.init();
            self.init();
            readyBtn.isClick=0;
        }
    };

    ws.onclose=function(){
        console.log("断开连接");
    };

    ws.onerror=function(){
        console.log("error");
    };

    function getReady(){
        if(this.isClick) return;
        this.isClick=1;
        self.init(ws);
        com.init();
        this.innerHTML="已准备";
        this.style.backgroundColor="#1b76c4";
        var info={      //加入房间
            code:0,
            user:userInfo.userName,
            roomId:userInfo.roomId,
            token:userInfo.token,
            beginPos:self.beginPos
        };
        ws.send(JSON.stringify(info));
    }

    function pageStateInit(){
        readyBtn.innerHTML="准备";
        comState.innerHTML="未准备";
        readyBtn.style.backgroundColor="#24a7f0";
        comState.style.color="cornflowerblue";
    }

})();