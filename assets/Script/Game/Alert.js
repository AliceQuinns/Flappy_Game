cc.Class({
    extends: cc.Component,

    properties: {
        top:cc.Node,
        bottom:cc.Node,
        top_length:{default:0,tooltip:"top组件移动距离"},
        bottom_length:{default:0,tooltip:"bottom组件移动距离"}
    },

    init(){
        // 提高页面层级
        this.node.zIndex = 200;

        // 开启动画
        this.Action_move(true);

        // 开始游戏按钮
        this.click(cc.find("/bottom/start", this.node),()=>{
            this.Action_move();//开启反向动画
            window.setTimeout(()=>{
                cc.director.loadScene("Index");
            },1000);
        });
    },

    // 绑定事件
    click:(target,callback)=>{
        target.on(cc.Node.EventType.TOUCH_START,(e)=>{
            callback(e);
        })
    },

    // 移动动画
    Action_move(Reversal){
        if(Reversal){
            this.top.runAction(cc.moveBy(0.5,0,-(this.top.y-this.top_length)).easing(cc.easeExponentialInOut()));
            this.bottom.runAction(cc.moveBy(0.8,0,Number(this.bottom_length)).easing(cc.easeExponentialInOut()));
        }else{
            this.top.runAction(cc.moveBy(0.5,0,880).easing(cc.easeExponentialInOut()));
            this.bottom.runAction(cc.moveBy(0.5,0,Number(-this.bottom_length)).easing(cc.easeExponentialInOut()));
        }
    },

    onLoad () {},

    start () {

    },

    // update (dt) {},
});
