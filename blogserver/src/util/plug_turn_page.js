//翻页插件
const Plug = (function(){
    const page = function(options){
        this.currentPage = options.currentPage || 1;
        this.wrap = options || document.body;
        this.allPage = options.allPage || 1;
        this.dom = document.createElement('ul');
        this.dom.className = 'my_swiper_page';
        this.code = 5;
    }
    page.prototype.init = function(){
        this.initStyle();
        this.bindEvent();
    }
    page.prototype.initStyle = function(){
        this.dom.innerHTML = '';
        if(this.currentPage > 1){
            const prev = document.createElement('li')
            prev.title = '上一页'
            prev.className = 'prev'
            prev.innerText = '<'
            this.dom.appendChild(prev)
        }
        if(this.allPage <= 5){
            for(let i=1; i<=this.allPage; i++){
                const oli = document.createElement('li')
                oli.className = 'num'
                oli.innerText = i
                if(this.currentPage === i){
                    oli.classList.add('current');
                }
                this.dom.appendChild(oli)
            }
        }else{
            if(this.currentPage - this.code >= 1 && this.currentPage + this.code <= this.allPage){
                for(let i=this.currentPage - this.code; i< this.currentPage + this.code; i++){
                    const oli = document.createElement('li')
                    oli.className = 'num'
                    oli.innerText = i
                    if(this.currentPage === i){
                        oli.classList.add('current');
                    }
                    this.dom.appendChild(oli)
                }
            }else if(this.currentPage + this.code > this.allPage){
                for(let i=this.currentPage - 3; i<this.allPage; i++){
                    const oli = document.createElement('li')
                    oli.className = 'num'
                    oli.innerText = i
                    if(this.currentPage === i){
                        oli.classList.add('current');
                    }
                    this.dom.appendChild(oli)
                }
            }else if(this.currentPage - this.code < 1){
                for(let i=1; i<= 10; i++){
                    const oli = document.createElement('li')
                    oli.className = 'num'
                    oli.innerText = i
                    if(this.currentPage === i){
                        oli.classList.add('current');
                    }
                    this.dom.appendChild(oli)
                }
            }
        }
        if(this.currentPage < this.allPage){
            const next = document.createElement('li')
            next.title = '下一页'
            next.className = 'next'
            next.innerText = '>'
            this.dom.appendChild(next)
        }
    }
    page.prototype.bindEvent = function(){

    }
    return function(options){
        const newPage = new page(options);
        newPage.init();
        return newPage.dom;
    }
})()

export default Plug;