var websocket=require("ws").Server;
var ws=new websocket({port:9501});
var rooms=[];   // 4个房间

ws.on('connection',function(conn){
    conn.user=false;

    conn.on('message',function(message){
        var msgJson=JSON.parse(message);
        //console.log(msgJson)
        var user=msgJson.user;
        var roomId=msgJson.roomId;
        var token=msgJson.token;
        var info,comp;
        if(!conn.user){
            if(typeof rooms[msgJson.roomId]=='undefined'){
                rooms[roomId]=new Array();
            }
            conn.user=user;
            conn.beginPos=msgJson.beginPos;
            conn.roomId=roomId;
            conn.token=token;
            rooms[roomId].push(conn);
        }
        if(rooms[roomId].length==2) {
            if (msgJson.code == 0) {
                var self = findSelf(rooms[roomId], token);
                var compete = findCompetitor(rooms[roomId], token);
                var selfInfo = {
                    code: 1,
                    comp:compete.user,
                    beginPos: compete.beginPos
                };
                var competeInfo = {
                    code: 1,
                    comp:self.user,
                    beginPos: self.beginPos
                };
                self.send(JSON.stringify(selfInfo));
                compete.send(JSON.stringify(competeInfo));
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
            if (msgJson.code == -2) {
                info = {
                    code: 3
                };
                comp = findCompetitor(rooms[roomId], token);
                comp.send(JSON.stringify(info));
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

function findSelf(rooms,token){
    for(var i=0;i<rooms.length;i++){
        if(rooms[i].token==token) break;
    }
    return rooms[i];
}

function findCompetitor(rooms,token){
    for(var i=0;i<rooms.length;i++){
        if(rooms[i].token!=token) break;
    }
    return rooms[i];
}

