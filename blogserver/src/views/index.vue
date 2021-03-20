<template>
    <div class="wrapper_main">
        <div class="index_wrapper">
            <header class="header">
                <base-header />
            </header>
            <div class="content">
                <div class="content_left">
                    <div class="every_day" id="every_day">
                        <span>每日一句</span>
                        <p v-html="getContent"></p>
                    </div>
                    <!-- 文章列表 -->
                    <div class="article_list" id="article_list" @click="goDetail($event)">
                        
                    </div>
                    <plug-trun-page :totalBlog="totalBlog" @handleChange="handleChange" />
                </div>
                <div class="content_right">
                    <base-side />
                </div>
            </div>
            <footer>
                <base-footer />
            </footer>
        </div>
    </div>
</template>

<script>
import baseHeader from '../components/header'
import baseSide from '../components/side'
import baseFooter from '../components/footer'
import plugTrunPage from '../components/plug_trun_page'
import everyApi from '../api/everyday'
import blogApi from '../api/blog';
export default {
    components:{
        baseSide,
        baseFooter,
        baseHeader,
        plugTrunPage
    },
    data(){
        return{
            content: "",
            articleList: [],
            totalBlog: 0,
            currentPage: 1,
        }
    },
    computed:{
        getContent: function(){
            return this.content;
        },
    },
    created:function(){
        
    },
    methods:{
        goDetail(e){//去详情页
            const id = e.target.classList[1];//得到博客的id号
            localStorage.setItem('blogIndex',id)
        },
        async getEveryDay(){//每日一句
            await everyApi.getLast().then(res=>{
                if(res){
                    this.content = res.content;
                }
            })
        },
        async getBlogs(page){
            await blogApi.getBlogs({
                page: page,
                limit: 10,
            }).then(res =>{
                if(res){
                    this.totalBlog = res.total;
                    const articleList = document.querySelector('.article_list');
                    articleList.innerHTML = '';
                    let html = document.createElement('div');
                    let total = document.createElement('div');
                    total.className = 'total_article'
                    total.innerHTML = `<b>${res.total = res.total === 2 ? '两' : res.total}</b> 篇文章`;
                    html.innerHTML = '';
                    for(let i=0; i< res.datas.length; i++){
                        html.innerHTML += `
                        <div class="article">
                            <h3>
                                <a href="/detail" class="article_title ${res.datas[i].id}">${res.datas[i].title}</a>
                            </h3>
                            <div class="article_content">${res.datas[i].content}</div>
                            <div class="article_foot">
                                发布于${res.datas[i].ctime} |  浏览：${res.datas[i].views} | Tags：${res.datas[i].tags}
                            </div>
                        </div>  
                        `;
                    }
                    articleList.appendChild(total)
                    articleList.appendChild(html)
                }
            })
        },
        handleChange(index){
            this.getBlogs(index);
        },
    },
    mounted(){
        this.getEveryDay();
        this.getBlogs(this.currentPage);
    }
}
</script>

<style>
@import url('../assets/css/base.css');
.wrapper_main{
    background-image: url('../assets/img/background.jpg');
    background-repeat: no-repeat;
    background-clip:content-box;
    background-position: top;
    background-size: cover;
    background-attachment: fixed;
    position: relative;
    overflow: hidden;
    margin: 0 auto;
}
.every_day{
    text-align: left;
    background-color: rgba(255, 255, 255, .92);
    width: 100%;
    border-radius: 5px;
    padding: 10px 15px;
    box-sizing: border-box;
    margin-top: 20px;
}
.every_day::before{
    font-family: MyIcon;
    content: "\e122";
    font-size: 12px;
    color: teal;
    position: relative;
    display: block;
    height: 0px;
    left: 72px;
}
.every_day > span, .every_day > p{
    display: block;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
    color: royalblue;
}
.every_day > p{
    color: #1f4172;
}
.article_list{
    width: 100%;
    border-radius: 5px;
    margin-top: 15px;
}

.article_list .article{
    margin-top: 15px;
    background-color: rgba(255, 255, 255, .92);
    display: inline-block;
    width: 100%;
    border-radius: 5px;
    box-shadow: 3px 4px 10px rgba(180, 102, 99, .3);
    overflow: hidden;
    text-align: left;
}
.total_article{
    background-color: rgba(255, 255, 255, .92);
    padding: 5px 0px 5px 10px;
    text-align: left;
    font-weight: bold;
    color: lightsalmon;
    border-radius: 4px;
}
.total_article b{
    color: lightcoral;
}
.article_list h3{
    display: block;
    padding-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.article_list h3 a{
    font-size: 20px;
    color: #1f4172;
    transition-duration: .3s;
}
.article_list h3:hover a{
    color:slateblue;
}
.article_list .article_content{
    font-size: 14px;
    color: #13102b;
    padding: 0px 10px 0px 10px;
    text-align: left;
    line-height: 24px;
    max-height: 150px;
    overflow: hidden;
}
.article_list .article_foot{
    color: #eee;
    background-color: rgba(252,100,83, .92);
    padding: 5px;
}
</style>