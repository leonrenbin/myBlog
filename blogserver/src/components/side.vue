<template>
    <div class="sideNav">
        <div class="right_module" id="random_title">
            <div class="title">随机标签云</div>
            <a 
                v-for="tag in tags" 
                :key="tag.id" 
                :style="{color:randomColor(), fontSize:randomSize()}"
                @click="getAllArticle(tag.tag)"
            >{{ tag.tag }}</a>
        </div>
        <div class="right_module" id="new_hot">
            <div class="title">最近热门</div>
            <ul>
                <li v-for="h in hotList" :key="h.id">
                    <a :href="h.link">{{ h.title }}</a>
                </li>
            </ul>
        </div>
        <div class="right_module" id="new_comments">
            <div class="title">最新评论</div>
            <ul>
                <li v-for="item in commentList" :key="item.id">
                    <div>
                        <span>{{ item.user_name }}</span>
                        <span>[{{ item.ctime }}]</span>
                    </div>
                    <p>{{ item.content }}</p>
                </li>
            </ul>
        </div>
        <div class="right_module" id="friend_link">
            <div class="title">友情链接</div>
            <span><a>啥也没有</a></span>
        </div>
    </div>
</template>

<script>
import tagApi from '../api/tags'
import capi from '../api/comments'
import blogApi from '../api/blog'
export default {
    data(){
        return{
            tags:[],
            hotList:[
                {title: '广告位招租', link: 'http://www.baidu.com', id:1},
            ],
            commentList:[],
            totalBlog: 0,
            currentPage: 1,
        }
    },
    computed:{
        randomColor: function(){
            return function(){
                var red = Math.floor(Math.random() * 255)
                var green = Math.floor(Math.random() * 255)
                var blue = Math.floor(Math.random() * 255)
                return `rgb(${red},${green},${blue})`
            }
        },
        randomSize: function(){
            return function(){
                var size = Math.random() * 20 + 12;
                return size + 'px';
            }
        },
    },
    methods:{
        async getTags(){
            await tagApi.getTags({
                page: 1,
                limit: 15
            }).then(res=>{
                this.tags = res.datas;
            })
        },
        async getCommentsByDesc(){
            await capi.getCommentsByDesc().then(res=>{
                this.commentList = res.datas;
            })
        },
        async getAllArticle(tag){
            await blogApi.getBlogByTagName({
                params:{
                    tags: tag
                }
            }).then(res =>{
                if(res){
                    this.totalBlog = res.total;
                    const articleList = document.querySelector('.article_list');
                    articleList.innerHTML = '';
                    let html = document.createElement('div');
                    let total = document.createElement('div');
                    total.innerHTML = `${res.total = res.total === 2 ? '两' : res.total} 篇文章`;
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
    },
    mounted(){
        this.getTags();
        this.getCommentsByDesc();
    },
}
</script>

<style>

</style>