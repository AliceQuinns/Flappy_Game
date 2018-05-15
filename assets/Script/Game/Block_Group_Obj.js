cc.Class({
    extends: cc.Component,

    properties: {
        Blockchildren: [],//当前方块组下的全部方块
        Box_Collider_botton: 10,//底部包围盒高度
    },

    MaxY: 0,// Y轴回收峰值

    onLoad () {},

    init: function(target,data){
        this.moveSpeen = target.BlockGroupMoveSpeen;// 移动速度
        this.target = target;// 父节点
        this.BlockPool4 = target.BlockPool4;// 4级方块对象池
        this.BlockPool5 = target.BlockPool5;// 5级方块对象池
        this.configure = data;// 配置表
        this.BlockWidth = target.BlockGroupHeight;// 方块的宽高
        this.limitLeft = -(this.node.width/2);// 方块组最左边坐标
        this.MaxY=-(this.target.parents.height/2+this.node.height);//回收最大距离
        this.createBlock(); //生成方块
    },

    // 方块生成函数
    createBlock: function(){
        let self = this;
        for(let i=0;i<self.configure.length;i++){
            let content = self.configure[i];// 单个方块配置
            // 如果有配置且方块的生命值大于0
            if(content && content.life > 0){
                let target = self.PullPool(self.configure.length);//创建方块
                target.parent=self.node;
                let target_x = self.limitLeft+self.BlockWidth*i;//当前方块x轴坐标
                target.setPosition(cc.v2(target_x,0));
                let Block = target.getComponent('Block');
                // 判断节点是否可移动
                if(content.move){
                    let left_position = cc.p(target_x-(self.BlockWidth*content.moveLeft),0);//左移的终点坐标
                    let right_position = cc.p(target_x+(self.BlockWidth*(content.moveRight)),0);//右移的终点坐标
                    Block.Block_move(left_position,right_position);//控制方块移动
                   // console.log("left",left_position,"right",right_position);
                }
                try{
                    Block.init(content,this.target,this.node,`BlockPool${self.configure.length}`);//初始化方块
                    // console.time("test");
                    // //修改包围盒
                    // let Box_collider = Block.getComponent(cc.BoxCollider);
                    // Box_collider.size=cc.size(self.BlockWidth,self.BlockWidth);
                    // Box_collider.offset=cc.v2(self.BlockWidth>>1,self.BlockWidth>>1);
                    // console.timeEnd("test");
                }catch(e){
                    console.log('Block对象无法调用init方法');
                }
            }
        }
    },

    // 请求对象
    PullPool: function(len){
        let target,pool=this.target;
        let BlockPool = pool[`BlockPool${len}`];//获取节点池
        if(BlockPool.size()>0){
            target = BlockPool.get();
        }else{
            target = cc.instantiate(this.target.Block);// new方块对象
            let BlockWidth = this.target.target.width/len;
            target.width = BlockWidth;
            target.height = BlockWidth;
            //修改包围盒
            let Box_collider = target.getComponent(cc.BoxCollider);
            Box_collider.size=cc.size(BlockWidth,BlockWidth);
            Box_collider.offset=cc.v2(BlockWidth>>1,BlockWidth>>1);
        }
        return target;
    },

    start () {

    },

    update (dt) {
        if(this.target){
            if(this.node.y<=this.MaxY){
                this.target.deletePool(`BlockPool${this.configure.length}`,this.node.getChildByName("Block"));//回收方块节点
                this.node.destroy();//删除方块容器
            }else{
                this.node.y-=this.moveSpeen*dt;
            }
        }
    },
});
