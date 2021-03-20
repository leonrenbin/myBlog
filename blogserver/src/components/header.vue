<template>
    <div class="header">
        <div class="container">
            <a @click="gohome" class="title">我的个人博客</a>
            <ul class="menu" ref="menu">
                <template v-for="(r,i) in routes">
                    <li 
                        :key="r.name" 
                        v-if="!r.meta.hide"
                        @click="addStyle(i)"
                        :class="{'active': i === getNowIndex}"
                    >
                        {{ r.meta.name }}
                    </li>
                </template>
            </ul>
            <div class="search">
                <input type="text" v-model="searchDate" placeholder="输入关键词查找文章">
                <button @click="handleSearch">搜索</button>
                <ul v-if="keyWordsList.length > 0">
                    <li>
                        <a  href="/detail"
                            @click="goDetail(k.id)" 
                            v-for="k in keyWordsList" 
                            :key="k.id"
                            v-html="fontColor(searchDate,k.title)"
                        >{{ k.title }}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import blogApi from '../api/blog'
export default {
    data(){
        return{
            searchDate: '',
            keyWordsList:[],
        }
    },
    computed:{
        ...mapState({
        }),
        routes(){
            return this.$router.options.routes;
        },
        getNowIndex(){
            return +localStorage.getItem('pageIndex');
        },
        isBlogger(){
            const bloggerid = localStorage.getItem('bloggerId')
            const bloggername = localStorage.getItem('bloggetName')
            if(bloggerid && bloggername)return true
            else return false
        },
    },
    methods:{
        ...mapMutations(['setPageIndex']),
        async handleSearch(){
            if(!this.searchDate) return;
            await blogApi.getBlogByKeyword({
                params:{
                    keyword: this.searchDate
                }
            }).then(res =>{
                this.keyWordsList = res.datas;
            })
        },
        gohome(){
            let home = document.querySelector('.header .container .menu li')
            home.click();
        },
        addStyle(index){
            localStorage.setItem('pageIndex', index)
            if(localStorage.getItem('pageIndex') === '1'){
                if(this.$router.history.current.name === 'Index') return;
                this.$router.push({
                    name: 'Home'
                })
            }else if(localStorage.getItem('pageIndex') === '2'){
                if(this.$router.history.current.name === 'Map') return;
                this.$router.push({
                    name: 'Map'
                })
            }else if(localStorage.getItem('pageIndex') === '3'){
                if(this.$router.history.current.name === 'About') return;
                this.$router.push({
                    name: 'About'
                })
            }else if(localStorage.getItem('pageIndex') === '4'){
                if(this.$router.history.current.name === 'Guestbook') return;
                this.$router.push({
                    name: 'Guestbook'
                })
            }else if(localStorage.getItem('pageIndex') === '6'){
                if(this.$router.history.current.name === 'Editor') return;
                this.$router.push({
                    name: 'Editor'
                })
            }
        },
        goEdit(index){
            if(this.$router.history.current.name === 'Editor') return;
            const oLi = document.querySelectorAll('.container .menu li')
            for(let i=0; i<oLi.length; i++){
                oLi[i].classList.remove('active')
            }
            oLi[index].classList.add('active')
            this.$router.push({
                name: 'Editor'
            })
        },
        goDetail(blogid){
            localStorage.setItem('blogIndex',blogid);
        },
        fontColor(searchDate, title){
            const reg = new RegExp(searchDate, 'g');//g是全局匹配
            return title.replace(reg, searchDate.fontcolor('red'));
        }
    },
    mounted(){
    },
}
</script>

<style>
    div.header{
        width: 100%;
        height: 100%;
    }
    
    @media (max-width : 1250px) {
        div.header .container{
            display: flex;
        }
    }
    @media (max-width : 1150px) {
        div.header .container .search{
            display: none;
        }
    }
    @import url('../assets/css/base.css');
</style>