<template>
    <div class="plug_trun_page_wrap" @click="handleClick($event)"></div>
</template>
<script>
import plug from '../util/plug_turn_page'
export default {
    data(){
        return{
            currentPage: 1,
        }
    },
    props:['totalBlog'],
    methods:{
        initHtml(){
            const pageDom = document.querySelector('.plug_trun_page_wrap')
            const newDom = new plug({
                wrap: pageDom,
                currentPage: this.currentPage,
                allPage: Math.ceil(this.totalBlog / 10),
            })
            pageDom.appendChild(newDom)
        },
        handleClick(e){
            const result = this.bindEvent(e);
            this.$emit('handleChange',result)
        },
        bindEvent(e){
            const nums = document.querySelectorAll('.my_swiper_page .num');
            if(e.target.classList.contains('prev')){
                if(this.currentPage === 1) return;
                this.currentPage --;
            }else if(e.target.classList.contains('num')){
                this.currentPage = e.target.innerText;
                for(let i=0; i<nums.length; i++){
                    nums[i].classList.remove('current')
                }
                nums[this.currentPage - 1].classList.add('current');
            }else if(e.target.classList.contains('next')){
                if(this.currentPage >= Math.ceil(this.totalBlog / 10)) return;
                this.currentPage ++;
            }
            return this.currentPage;
        }
    },
    mounted(){
        this.initHtml();
    },
}
</script>

<style>
.plug_trun_page_wrap{
    display: inline-block;
    float: left;
    margin: 20px 0px;
    padding-left: 20px;
    box-sizing: border-box;
}
.my_swiper_page{
    display: flex;
    justify-content: flex-start;
}
.my_swiper_page li{
    padding: 3px 10px;
    border: 2px solid #ff7100;
    border-radius: 6px;
    cursor: pointer;
    transition-duration: .3s;
    margin-right: 5px;
    font-weight: bold;
    color: #666;
    user-select: none;
    background-color: #feddcc;
    opacity: .9;
}
.my_swiper_page li:hover{
    border-color: #ff7100;
    color: #ff7100;
}
.my_swiper_page li.current{
    border-color: #ff7100;
}
</style>