var Block=require("block");

function GAME(type){
    this.stage=document.getElementById(type+"Stage");
    this.scoreBox=document.getElementById(type+"Score");
    this.nameBox=document.getElementById(type+"Name");
    this.control=type;

    //初始化
    this.init=function(){
        if(arguments[0]) {
            this.ws=arguments[0];
            this.setNameBox(arguments[0].userName)
        }
        this.clearStage();
        this.score=0;
        this.map=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]; //2048地图阵列
        this.blkArr=[];         //存储方块的数组
        this.maxNum=0;          //方块数
        this.score=0;           //分数初始化
        this.isKeyDown=0;       //记录键盘是否按下
        this.isMove=0;          //记录是否有移动
        this.moveNum=0;         //记录同时移动的操作数量，当有滑块仍在移动时禁止操作
        this.beginPos=[];       //方块记录队列，用于记录未渲染但已生成的方块
		var that=this;
        if(this.control=="self"){
            this.rand();
            this.rand();
            this.rand();
            window.onkeydown = function (event) {
                if (that.isKeyDown) return;
                if(that.moveNum>=1) return;
                var e = event || window.event;
                if (e && e.keyCode>=37 && e.keyCode<=40) {
                    that.isKeyDown = 1;
                    that.slide(e.keyCode);
                    that.moveNum++;
                }
            };
            window.onkeyup = function () {
                that.isKeyDown = 0;
            };
        }
        setInterval(function(){
            that.scoreBox.innerHTML=that.score;
        },10)
    };

    //渲染beginPos队列中的成员方块
    this.createBlock=function(){
        while(this.beginPos.length){
            var blk=new Block(),
                pos=this.beginPos.shift(),
                x=pos.x, y=pos.y;
            this.blkArr.push(blk);
            blk.create(x,y,this.stage);
            blk.setNumber(pos.num);
            this.map[y][x]=blk;
        }
    };

    //随机生成方块插入队列中，等待渲染
    this.rand=function(){
        var x, y;
        var newNum = Math.random() <= 0.6 ? 2 : 4;  //4的概率稍小
        x = Math.floor(Math.random() * 4);
        y = Math.floor(Math.random() * 4);
        while (this.map[y][x] != 0 || x == 4 || y == 4) {
            x = Math.floor(Math.random() * 4);
            y = Math.floor(Math.random() * 4);
        }
        this.beginPos.push({x:x,y:y,num:newNum});
        this.map[y][x]=1;
    };

    //设置顶端名字
    this.setNameBox=function(name){
        this.nameBox.innerHTML=name;
    };

    //方块合并
    this.merge=function(prevBlock,currBlock){
        var prev=prevBlock.block.innerHTML;
        var curr=currBlock.block.innerHTML;
        //console.log(prev,curr);
        if(prev==curr){
            if(!this.isMove) this.isMove=1;
            var prevx=prevBlock.x,
                prevy=prevBlock.y;
            prevBlock.position(currBlock.x,currBlock.y);
            currBlock.setNumber(curr * 2);
            prevBlock.block.style.zIndex=-1;
            this.map[prevy][prevx]=0;
            this.score+=curr*2;
            var that=this;
            setTimeout(function(){
                that.stage.removeChild(prevBlock.block);
                delete prevBlock;
            },300);
            return true;
        }
        return false;
    };

    //方块移动
    this.slide=function(keycode){
        var i, j, k, curr;
        if(keycode==37){//Left
            for(i=0;i<4;i++){
                k=0;
                for(j=0;j<3;j++){//所有块先移动
                    if(this.map[i][j]==0){
                        if(k==0) k=j+1;
                        while(k<4 && this.map[i][k]==0 && k++);
                        if(k==4) break;
                        this.map[i][k].position(j,i);
                        this.map[i][j]=this.map[i][k];
                        this.map[i][k]=0;
                    }
                }
                for(j=0;j<3;j++){//相邻等值块合并
                    if(this.map[i][j]!=0 && this.map[i][j+1]!=0) {
                        if(this.merge(this.map[i][j + 1], this.map[i][j])){
                            //防止相邻两两合并时方块无动画消失
                            curr=k=j+1;
                            while(k<4){
                                if(this.map[i][k]!=0){
                                    this.map[i][k].position(curr,i);
                                    this.map[i][curr++]=this.map[i][k];
                                    this.map[i][k]=0;
                                }
                                k++;
                            }
                        }
                    }
                }
                k=0;
                for(j=0;j<3;j++){//消除合并后可能产生的空块
                    if(this.map[i][j]==0){
                        if(k==0) k=j+1;
                        while(k<4 && this.map[i][k]==0 && k++);
                        if(k==4) break;
                        this.map[i][k].position(j,i);
                        this.map[i][j]=this.map[i][k];
                        this.map[i][k]=0;
                    }
                }
            }
        }
        if(keycode==38){//Top
            for(i=0;i<4;i++){
                k=0;
                for(j=0;j<3;j++){//所有块先移动
                    if(this.map[j][i]==0){
                        if(k==0) k=j+1;
                        while(k<4 && this.map[k][i]==0 && k++);
                        if(k==4) break;
                        this.map[k][i].position(i,j);
                        this.map[j][i]=this.map[k][i];
                        this.map[k][i]=0;
                    }
                }
                for(j=0;j<3;j++){//相邻等值块合并
                    if(this.map[j][i]!=0 && this.map[j+1][i]!=0) {
                        if(this.merge(this.map[j+1][i], this.map[j][i])){
                            //防止相邻两两合并时方块无动画消失
                            curr=k=j+1;
                            while(k<4){
                                if(this.map[k][i]!=0){
                                    this.map[k][i].position(i,curr);
                                    this.map[curr++][i]=this.map[k][i];
                                    this.map[k][i]=0;
                                }
                                k++;
                            }
                        }
                    }
                }
                k=0;
                for(j=0;j<3;j++){//消除合并后可能产生的空块
                    if(this.map[j][i]==0){
                        if(k==0) k=j+1;
                        while(k<4 && this.map[k][i]==0 && k++);
                        if(k==4) break;
                        this.map[k][i].position(i,j);
                        this.map[j][i]=this.map[k][i];
                        this.map[k][i]=0;
                    }
                }
            }
        }
        if(keycode==39){//Right
            for(i=0;i<4;i++){
                k=3;
                for(j=3;j>=1;j--){//所有块先移动
                    if(this.map[i][j]==0){
                        if(k==3) k=j-1;
                        while(k>=0 && this.map[i][k]==0 && k--);
                        if(k==-1) break;
                        this.map[i][k].position(j,i);
                        this.map[i][j]=this.map[i][k];
                        this.map[i][k]=0;
                    }
                }
                for(j=3;j>=1;j--){//相邻等值块合并
                    if(this.map[i][j]!=0 && this.map[i][j-1]!=0) {
                        if(this.merge(this.map[i][j - 1], this.map[i][j])){
                            //防止相邻两两合并时方块无动画消失
                            curr=k=j-1;
                            while(k>=0){
                                if(this.map[i][k]!=0){
                                    this.map[i][k].position(curr,i);
                                    this.map[i][curr--]=this.map[i][k];
                                    this.map[i][k]=0;
                                }
                                k--;
                            }
                        }
                    }
                }
                k=3;
                for(j=3;j>=1;j--){//消除合并后可能产生的空块
                    if(this.map[i][j]==0){
                        if(k==3) k=j-1;
                        while(k>=0 && this.map[i][k]==0 && k--);
                        if(k==-1) break;
                        this.map[i][k].position(j,i);
                        this.map[i][j]=this.map[i][k];
                        this.map[i][k]=0;
                    }
                }
            }
        }
        if(keycode==40){//Down
            for(i=0;i<4;i++){
                k=3;
                for(j=3;j>=1;j--){//所有块先移动
                    if(this.map[j][i]==0){
                        if(k==3) k=j-1;
                        while(k>=0 && this.map[k][i]==0 && k--);
                        if(k==-1) break;
                        this.map[k][i].position(i,j);
                        this.map[j][i]=this.map[k][i];
                        this.map[k][i]=0;
                    }
                }
                for(j=3;j>=1;j--){//相邻等值块合并
                    if(this.map[j][i]!=0 && this.map[j-1][i]!=0) {
                        if(this.merge(this.map[j-1][i], this.map[j][i])){
                            //防止相邻两两合并时方块无动画消失
                            curr=k=j-1;
                            while(k>=0){
                                if(this.map[k][i]!=0){
                                    this.map[k][i].position(i,curr);
                                    this.map[curr--][i]=this.map[k][i];
                                    this.map[k][i]=0;
                                }
                                k--;
                            }
                        }
                    }
                }
                k=3;
                for(j=3;j>=1;j--){//消除合并后可能产生的空块
                    if(this.map[j][i]==0){
                        if(k==3) k=j-1;
                        while(k>=0 && this.map[k][i]==0 && k--);
                        if(k==-1) break;
                        this.map[k][i].position(i,j);
                        this.map[j][i]=this.map[k][i];
                        this.map[k][i]=0;
                    }
                }
            }
        }
        if(this.control=="self") this.selfCheck(keycode);
    };

    this.selfCheck=function(keycode){   //己方检查游戏是否结束并生成新方块
        var that=this,info, i,j;
        setTimeout(function () {
            var numOfBlock = 0;
            for (i = 0; i < 4; i++) {
                for (j = 0; j < 4; j++) {
                    if (that.map[i][j] != 0){
                        numOfBlock++;
                        if(that.map[i][j].block.innerHTML>that.maxNum){
                            that.maxNum=that.map[i][j].block.innerHTML
                        }
                    }
                }
            }
            //console.log(numOfBlock)
            if (numOfBlock == 16 && !that.isMove) {
                alert("游戏结束,您的分数为["+that.score+"].");
                info={
                    code:-2,
                    user:that.ws.userName,
                    roomId:that.ws.roomId,
                    token:that.ws.token,
                    score:that.score
                };
                that.ws.send(JSON.stringify(info));
            }
            else {
                that.isMove=0;
                that.moveNum--;
                that.rand();
                info = {
                    code: 2,
                    user:that.ws.userName,
                    roomId:that.ws.roomId,
                    token:that.ws.token,
                    actionCode: keycode,
                    nwPos:that.beginPos[0]
                };
                that.ws.send(JSON.stringify(info));     //将新方块的位置发给对手
                that.createBlock();
            }
        }, 250)
    };

    this.comHandle=function(queue){      //对方2048处理指令队列
        var order;
        while(queue.length){
            order=queue.shift();
            this.beginPos.push(order.nwPos);
            this.slide(order.actionCode);
            this.createBlock();
        }
    };

    this.clearStage=function(){
        while(this.stage.hasChildNodes()){
            this.stage.removeChild(this.stage.firstChild);
        }
    }
}

module.exports=GAME;
