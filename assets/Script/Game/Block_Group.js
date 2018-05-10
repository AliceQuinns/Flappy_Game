cc.Class({
    extends: cc.Component,

    properties: {
        parents: cc.Node,//canvas节点
        Block: cc.Prefab,//单个方块
        Block_Group: cc.Prefab,//方块容器
        BlockGroupCreate: {default:240,tooltip:"方块容器生成速度 反比"},
        BlockGroupMoveSpeen: {default:100,tooltip:"方块容器移动速度 每帧移动距离 正比"},
        BlockPoolSize: {default:20,tooltip:"初始化方块对象池的数量"},
        score: cc.Node,//分数节点
        scoreSize: {default:1,tooltip:"分数单次增加数量"},
        Aggressivity:{default:1,tooltip:"子弹攻击力"}
    },
    BlockPool:null,//方块对象池
    BlockGroupHeight: 0,//方块高度与宽度

    onLoad () {},

    init: function(target){
        this.target = target.node;//入口节点
        this.target_scene = target;// 入口环境
    },

    // 创建节点池  可以使用组件节点池
    createPool: function(type,target,size,nodepool_Type){
        if(nodepool_Type){
            this[target] = new cc.NodePool(nodepool_Type);
        }else{
            this[target] = new cc.NodePool();
        }
        for(let i=size;i--;){
            let Node = cc.instantiate(type);
            this[target].put(Node);
        }
    },

    // 方块容器生成
    createBlockGroupObj: function(data){
        let self = this,Block_Group=this.node.y;//当前方块容器的总高度;
        if(data.length>=5){
            console.log('连续方块容器数量超过5排 游戏难度不符合');
            return;
        }
        for(let i = 0;i<data.length;i++){
            // 计算单个方块的高度和宽度
            let height =  this.target.width/data[i].length;
            // 创建方块容器
            let target = cc.instantiate(this.Block_Group);
            target.parent = this.target;//添加到世界
            target.zIndex=98;
            target.setContentSize(this.parents.width,height);//修改方块容器宽高
            target.setPosition(cc.v2(0,Block_Group));
            // 记录总高度
            Block_Group += height;
            // 修改方块容器变量
            this.BlockGroupHeight = height;
            // 初始化方块容器
            target.getComponent('Block_Group_Obj').init(self,data[i]);
        }
    },

    // 回收节点
    deletePool:function(type,target){
        //判断是否为数组
        if(Object.prototype.toString.bind(target)()==="[object Array]"){
            for(let i =0;i<=target.length;i++){
                this[type].put(target[i]);
            }
        }else{
            this[type].put(target);
        }
    },

    // sw为true修改分数 false获取分数
    setScore (sw){
        if(sw){
            this.score.getComponent('Score').setScore(this.scoreSize);
        }else{
            return Number(this.score.getComponent(cc.Label).string);
        }
    },

    //随机算法
    getRandomInt: function(min,max){
        return Math.floor(Math.random()*(max-min)+min);
    },

    start () {
        this.BlockGroupPoolTime=0;// 控制方块组创建变量
        this.createPool(this.Block,'BlockPool',this.BlockPoolSize,"Block");//创建方块对象池
    },

    update (dt) {
        // 方块组生成
        if(this.BlockGroupPoolTime>=this.BlockGroupCreate){
            this.createBlockGroupObj(this.target_scene.getRouter());// 读取配置表并生成方块组
            this.BlockGroupPoolTime = 0;
        }
        this.BlockGroupPoolTime++;
    },
});
