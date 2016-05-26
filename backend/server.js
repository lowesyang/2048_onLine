var websocket=require("ws").Server;
var ws=new websocket({port:9501});
var rooms=[];   // 4个房间

ws.on('connection',function(conn){
    conn.token=false;

    conn.on('message',function(message){
        var msgJson=JSON.parse(message);
        //console.log(msgJson)
        var user=msgJson.user;
        var roomId=msgJson.roomId;
        var token=msgJson.token;
        var info,comp,compete;
        if(!conn.token){
            if(typeof rooms[msgJson.roomId]=='undefined'){
                rooms[roomId]=new Array();
            }
            rooms[roomId].isGame=0;
            conn.user=user;
            conn.roomId=roomId;
            conn.token=token;
            rooms[roomId].push(conn);
        }

        if(rooms[roomId].length==3){    //出现三名玩家同时在房内
            conn.token=false;
            rooms[roomId].pop();
            info={
                code:-50
            };
            return conn.send(JSON.stringify(info));
        }

        if(rooms[roomId].length==2) {       //两个玩家均已进入房间
            if(msgJson.code==100){
                conn.roomId=roomId;
                compete=findCompetitor(rooms[roomId],token);
                var selfInfo=JSON.stringify({
                    code:100,
                    comp:compete.user
                });
                var compInfo=JSON.stringify({
                    code:100,
                    comp:conn.user
                })
                conn.send(selfInfo);
                compete.send(compInfo);
            }
            if(msgJson.code==0){    //准备
                rooms[roomId].isGame++;
                compete = findCompetitor(rooms[roomId], token);
                conn.beginPos=msgJson.beginPos;
                if(rooms[roomId].isGame==2){
                    var selfInfo = {
                        code: 1,
                        comp:compete.user,
                        beginPos: compete.beginPos
                    };
                    var competeInfo = {
                        code: 1,
                        comp:conn.user,
                        beginPos: conn.beginPos
                    };
                    conn.send(JSON.stringify(selfInfo));
                    compete.send(JSON.stringify(competeInfo));
                }
                else{
                    compete.send(JSON.stringify({code:0}));
                }
            }
            if (msgJson.code == 2) {
                info = {
                    code: 2,
                    beginPos: msgJson.beginPos,
                    actionCode:msgJson.actionCode
                };
                comp = findCompetitor(rooms[roomId], token);
                comp.send(JSON.stringify(info));
            }
            if (msgJson.code == -2) {   //游戏回合结束
                rooms[roomId].isGame--;
                conn.score=msgJson.score;
                if(!rooms[roomId].isGame){
                    var winInfo = { //胜利
                        code: 3
                    };
                    comp = findCompetitor(rooms[roomId], token);
                    var failInfo={  //失败
                        code:-3
                    };
                    var peace={     //平局
                        code:66
                    };
                    if(comp.score>conn.score) {
                        comp.send(JSON.stringify(winInfo));
                        conn.send(JSON.stringify(failInfo));
                    }
                    else if(comp.score<conn.score){
                        comp.send(JSON.stringify(failInfo));
                        conn.send(JSON.stringify(winInfo));
                    }
                    else{
                        comp.send(JSON.stringify(peace));
                        conn.send(JSON.stringify(peace));
                    }
                }
            }
        }
    });

    conn.on('close',function(){
        var target=rooms[conn.roomId].indexOf(conn);
        rooms[conn.roomId].splice(target,1);
        if(rooms[conn.roomId].length) {
            var compete = findCompetitor(rooms[conn.roomId], conn.token);
            var info = {
                code: -1
            };
            compete.send(JSON.stringify(info));
        }
    })
});

function findCompetitor(rooms,token){
    for(var i=0;i<rooms.length;i++){
        if(rooms[i].token!=token) break;
    }
    return rooms[i];
}

