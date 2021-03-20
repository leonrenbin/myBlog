<template>
    <div class="setmap">
        <header class="header">
            <base-header />
        </header>
        <div class="wrapper_map">
            <!-- <div class="title">个人博客's SitMap</div> -->
            <ul class="link">
                <li v-for="r in router" :key="r">
                    <a>{{ r }}</a>
                    <span>>></span>
                </li>
            </ul>
            <div class="blog_list">
                <span>最新文章</span>
                <ul>
                    <li @click="goDetail(b.id)" v-for="b in blogList" :key="b.id">
                        <a href="/detail">{{ b.title }}</a>
                    </li>
                </ul>
            </div>
            <div class="footer">
                <span>Baidu-SiteMap   Latest Update: 2021-03-08 10:36:27</span>
                <span>Powered by Baidu SiteMap Generator   © 2008-2015 某某某</span>
            </div>
        </div>
    </div>
</template>

<script>
import baseHeader from '../components/header'
import blogApi from '../api/blog'
import { mapState, mapMutations } from 'vuex'
export default {
    components:{
        baseHeader
    },
    data(){
        return{
            blogList:[],
            router: [],
        }
    },
    methods:{
        ...mapMutations(['setBlogIndex']),
        goDetail(index){
            // this.setBlogIndex(index);
            localStorage.setItem('blogIndex', index)
        },
        async getData(){
            await blogApi.getBlogs({
                page: 1,
                limit: 100,
            }).then(res=>{
                this.blogList = res.datas;
            })
        },
        strorageRoute(){
            localStorage.setItem('subRoute', this.$router.currentRoute.meta.name)
        },
        readRoute(){
            const parent = localStorage.getItem('parentRoute')
            const sub = localStorage.getItem('subRoute')
            this.router = [parent,sub];
        },
    },
    mounted(){
        this.strorageRoute();
        this.getData();
        this.readRoute();
    },
}
</script>

<style>
@font-face{
    font-family: "MyIcon";
    src: url('../assets/font/glyphicons-halflings-regular.woff2');
}
.setmap{
    background-image: url('../assets/img/background.jpg');
    background-repeat: no-repeat;
    background-clip:content-box;
    background-position: top;
    background-size: cover;
    background-attachment: fixed;
    position: relative;
    max-width: 1980px;
    overflow: hidden;
    margin: 0 auto;
    height: 100%;
}
.setmap header{
    width: 100%;
}
.setmap .wrapper_map a{
    text-decoration: none;
}
.wrapper_map{
    margin-top: 60px;
    width: 100%;
    padding: 0px 30px;
    box-sizing: border-box;
}
.setmap .wrapper_map .title{
    width: 100%;
    text-align: center;
    font-weight: 600;
    line-height: 50px;
    font-size: 20px;
}
.setmap .wrapper_map .link{
    border:  1px solid #eee;
    padding: 20px 10px;
    width: 100%;
    margin: 0px auto;
    text-align: left;
    box-sizing: border-box;
    background-color: rgba(186,91,80, .8);
    display: flex;
}
.setmap .wrapper_map .link li{
    margin-right: 10px;
}
.setmap .wrapper_map .link li a{
    color: #eee;
    font-weight: bold;
    font-size: 16px;
    margin-right: 10px;
    cursor: pointer;
}
.setmap .wrapper_map .link li span{
    color: #444;
    font-weight: bold;
    font-size: 16px;
}
.setmap .wrapper_map .blog_list{
    width: 100%;
    border: 1px solid #eee;
    box-sizing: border-box;
    margin: 10px auto;
    /* padding: 10px; */
    font-size: 14px;
    font-weight: bold;
    text-align: left;
    background-color: rgba(192,88,80,.92);
}
.setmap .wrapper_map .blog_list span{
    display: inline-block;
    padding: 10px;
    color: #3a353f;
    font-size: 18px;
    font-weight: bold;
}
.setmap .wrapper_map .blog_list ul{
    font-size: 14px;
    font-weight: bold;
    width: 100%;
    margin: 10px auto;
}
.setmap .blog_list ul li{
    margin-top: 5px;
    padding: 7px 10px;
    transition-duration: .2s;
}
.setmap .blog_list ul li:hover{
    background-color: rgba(80,86,136, .8);
    box-shadow: 1px 0px 8px rgba(43,146,228,0.1);
}
.setmap .wrapper_map .blog_list ul li:hover a{
    color: #f1ece1;
}
.setmap .wrapper_map .blog_list ul li a{
    color: #34312f;
    font-weight: bold;
    display: block;
    width: 100%;
    cursor: pointer;
    transition-duration: .1s;
    font-size: 16px;
    line-height: 28px;
}
.footer{
    padding: 10px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    background-color: rgb(252, 186, 42);
    margin-top: 50px;
}
.footer span{
    width: 100%;
    display: block;
    line-height: 30px;
    font-weight: bold;
    color: #666;
}

</style>