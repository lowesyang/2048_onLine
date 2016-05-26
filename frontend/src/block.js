function Block(){
    this.number=0;
    this.position=function(x,y){
        this.x=x;
        this.y=y;
        this.block.style.marginLeft=x*(this.width+this.offset)+"px";
        this.block.style.marginTop=y*(this.height+this.offset)+"px";
    };
    this.create=function(x,y,stage){
        var nwBlock=document.createElement("div");
        nwBlock.className="block";
        this.block=nwBlock;
        this.width=this.height=100;
        this.x=x;
        this.y=y;
        this.offset=7;
        this.position(x,y);
        stage.appendChild(nwBlock);
    };
    this.setNumber=function(num){
        this.number=num;
        this.block.innerHTML=num;
        switch(parseInt(this.number)){
            case 2:this.block.style.backgroundColor="#3399cc";
                this.block.style.color="white";
                break;
            case 4:this.block.style.backgroundColor="#ff9900";
                this.block.style.color="white";
                break;
            case 8:this.block.style.backgroundColor="#ffcc33";
                this.block.style.color="white";
                break;
            case 16:this.block.style.backgroundColor="#ff6600";
                this.block.style.color="white";
                break;
            case 32:this.block.style.backgroundColor="#009966";
                this.block.style.color="white";
                break;
            case 64:this.block.style.backgroundColor="#33cc99";
                this.block.style.color="white";
                break;
            case 128:this.block.style.backgroundColor="#cc6600";
                this.block.style.color="white";
                break;
            case 256:this.block.style.backgroundColor="#cccc33";
                this.block.style.color="white";
                break;
            case 512:this.block.style.backgroundColor="#663399";
                this.block.style.color="white";
                break;
            case 1024:this.block.style.backgroundColor="#ff6666";
                this.block.style.color="white";
                break;
            case 2048:this.block.style.backgroundColor="#333399";
                this.block.style.color="white";
                break;
            case 4096:this.block.style.backgroundColor="#cc3366";
                this.block.style.color="white";
                break;
            case 8192:this.block.style.backgroundColor="#666666";
                this.block.style.color="white";
                break;
            case 16384:this.block.style.backgroundColor="#996600";
                this.block.style.color="white";
                break;
            case 32768:this.block.style.backgroundColor="#003300";
                this.block.style.color="white";
                break;
            case 65536:this.block.style.backgroundColor="#ccccff";
                this.block.style.color="white";
                break;
            case 131072:this.block.style.backgroundColor="#336666";
                this.block.style.color="white";
                break;
            case 262144:this.block.style.backgroundColor="#cc9966";
                this.block.style.color="white";
                break;
            case 524288:this.block.style.backgroundColor="#996633";
                this.block.style.color="white";
                break;
        }
    };
}

module.exports=Block;