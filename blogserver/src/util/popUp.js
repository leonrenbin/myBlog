//弹出框插件
const popUp = (function(){
    const plug = function(options){
        this.width = options.width;
        this.height = options.height;
        this.content = options.content;
        this.dom = document.createElement('div');
        plug.prototype.init = function(){
            this.dom.className = 'my_popUp';
            this.dom.style.width = this.width + 'px';
            this.dom.style.height = this.height + 'px';
            this.dom.innerText = this.content;
        }
    }
    
    return function(options){
        const newPlug = new plug(options);
        newPlug.init();
        return newPlug.dom;
    }
}())

export default popUp;