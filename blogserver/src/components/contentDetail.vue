<template>
<!-- 博客详情页 -->
    <div class="detail">
        <header class="header">
            <base-header />
        </header>
        <div class="content">
            <div class="content_left">
                <div class="detail_header">
                    <ul class="current_position">
                        <span class="title">当前位置: </span>
                        <li v-for="r in routes" :key="r">
                            <a>{{ r }}</a>
                            <span>>></span>
                        </li>
                    </ul>
                    <h2 class="title">{{ blogData.title }}</h2>
                    <ul class="detail_msg">
                        <li>
                            <span>作者: </span>
                            <a>{{ blogger.name }}</a>
                        </li>
                        <li>
                            <span>标签: </span>
                            <a>{{ blogData.tags }}</a>
                        </li>
                        <li>
                            <span>发布于: </span>
                            <a>{{ blogData.ctime }}</a>
                        </li>
                        <li>
                            <span>浏览: </span>
                            <a>{{ blogData.views }}</a>
                        </li>
                        <li>
                            <span v-if="!commentList.length">没有评论</span>
                            <span v-else>
                                目前有
                                <a>{{ commentList.length }}</a>
                                条评论
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="detail_content" id="detail_content">
                    <!-- 正文内容 -->
                </div>
                <!-- 自己发表评论 -->
                <div class="comment">
                    <base-comment :commentator="commentator" />
                </div>
                <!-- 别人的评论 -->
                <template v-for="(list,i) in commentList">
                    <div class="blog_comment_wrapper" v-if="!list.prev_id && commentList != []" :key="list.id">
                        <div class="blog_comment">
                            <span class="spanContent">
                                <i class="masterAvatar avatar"></i>
                                <div class="text">
                                    <b class="floor_master">{{ list.user_name }}:</b>
                                    <div class="reply_content">{{ list.content }}</div>
                                    <div class="other_msg">
                                        <b v-if="list.parent">
                                            <a>@{{ list.parent }}</a>
                                        </b>
                                        <span>{{ list.ctime }}</span>
                                        <a 
                                            @click="handleReply(
                                                list.id, list.user_name,list.content, list.email,
                                                list.prev_id,list.prev_name,
                                                list.parent_id,list.parent_name
                                            )"> 回复 </a>
                                    </div>
                                    <div class="comment_box">
                                        <template v-for="data in totalEveryLevelSon[i]">
                                            <div class="moreConent" :key="data.id">
                                                <span>
                                                    <i class="floorAvatar avatar"></i>
                                                    <div class="text">
                                                        <b>{{ data.user_name }}</b>
                                                        <div class="reply_content">{{ data.content }}</div>
                                                        <div class="other_msg">
                                                            <span>{{ data.ctime }}</span>
                                                            <a @click="handleReply(
                                                                data.id, data.user_name, 
                                                                data.content,data.email, 
                                                                data.prev_id,data.prev_name,
                                                                data.parent_id, data.parent_name
                                                            )
                                                            "> 回复 </a>
                                                        </div>
                                                    </div>
                                                    <template v-for="lv3 in allLevel3Data[i]">
                                                        <div class="reply_comment_wrap" v-if="lv3 != [] && lv3.prev_id == data.id" :key="lv3.id">
                                                            <span>
                                                                <i class="floorAvatar avatar"></i>
                                                                <div class="text">
                                                                    <div class="reply_content">
                                                                        <b>{{ lv3.user_name }}</b>
                                                                        回复
                                                                        <b class="reply_name">@{{ lv3.prev_name }}</b>
                                                                        <b class="reply_text">: {{ lv3.content }}</b>
                                                                    </div>
                                                                    <div class="other_msg">
                                                                        <span>{{ lv3.ctime }}</span>
                                                                        <a @click="handleReply
                                                                            (lv3.id, lv3.user_name, 
                                                                            lv3.content,lv3.email, 
                                                                            lv3.prev_id,lv3.prev_name,
                                                                            lv3.parent_id, lv3.parent_name)
                                                                        "> 回复 </a>
                                                                    </div>
                                                                </div>
                                                            </span>
                                                        </div>
                                                    </template>
                                                </span>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </span>
                            <span class="showmore" v-if="allLevel3Data[i] && allLevel3Data[i].length >= 3">
                                <p>剩余
                                    <b>{{ allLevel3Data[i].length -2 }}</b> 条评论, 
                                    <a @click="showMoreContent(i)">点击查看</a>
                                </p>
                            </span>
                        </div>
                    </div>
                </template>
            </div>
            <div class="content_right">
                <base-side />
            </div>
        </div>
        <footer>
            <base-footer />
        </footer>
    </div>
</template>

<script>
import baseHeader from './header'
import baseSide from './side'
import baseFooter from './footer'
import baseComment from './comment'
import blogApi from '../api/blog'
import bloggerApi from '../api/blogger'
import capi from '../api/comments'
import { mapState } from 'vuex'
export default {
    components:{
        baseSide,
        baseFooter,
        baseHeader,
        baseComment
    },
    data(){
        return{
            blogData:[],
            routes:[],
            commentator:{//评论者
                name: '',
                id: '',
                email: '',
                content: '',//的评论内容
                previd: '',
                prevname: '',
                pid: '',
                pname: '',
            },
            blogger: [],
            commentList: [],
            floorId: [],
            totalEveryLevelSon: [],
            allLevel3Data: [],
        }
    },
    computed:{
        ...mapState({
            nowIndex: (state)=>state.blogIndex,
        }),
    },
    methods:{
        async getBlogs(){
            const id = localStorage.getItem('blogIndex')
            await blogApi.getBlogById({
                id,
            }).then(res=>{
                this.blogData = res;
                this.initStyle(res.content);
                this.addViews(id);
            })
        },
        async getBlogger(){
            await bloggerApi.getBlogger().then(res=>{
                this.blogger = res.datas[0];
            })
        },
        async getCommentsData(id){
            await capi.getCommentsByBlogid({
                params:{
                    blogid: id
                }
            }).then(res=>{
                let parent = [];
                for(let i=0; i<res.datas.length; i++){
                    let item = res.datas[i];
                    if(item.id == +item.parent_id){
                        parent.push(item)
                    }
                }
                this.commentList = parent//得到所有的楼主
                for(let i=0; i<parent.length; i++){
                    let floor = [];
                    floor.push(
                        res.datas.filter(item=>{ //楼层id，二级评论
                            return item.prev_id == parent[i].id && item.prev_id != '';
                        })
                    )
                    this.floorId.push(floor)
                }
                for(let i=0; i<this.floorId.length; i++){
                    let arr = [];
                    for(let j=0; j<this.floorId[i].length; j++){
                        arr.push(...this.floorId[i][j])
                    }
                    this.totalEveryLevelSon.push(arr)//每个楼层的所有二级评论
                }

                for(let i=0; i<this.totalEveryLevelSon.length; i++){
                    let arr = [];
                    let newarr = [];
                    for(let j=0; j<this.totalEveryLevelSon[i].length; j++){
                        for(let k=0; k<res.datas.length; k++){
                            if(res.datas[k].prev_name != this.totalEveryLevelSon[i][j].prev_name){
                                if(
                                    res.datas[k].prev_id != '' 
                                    && res.datas[k].parent_id == this.totalEveryLevelSon[i][j].parent_id 
                                    || res.datas[k].prev_id == this.totalEveryLevelSon[i][j].id
                                ){
                                    arr.push(res.datas[k])
                                }
                            }
                        }
                    }
                    for (const key of arr) {
                        if(newarr.indexOf(key) === -1){
                            newarr.push(key)
                        }
                    }
                    this.allLevel3Data.push(newarr)
                }
            })
        },
        initStyle(content){
            const detailContent = document.querySelector('#detail_content');
            const html = document.createElement('div');
            html.innerHTML = content;
            detailContent.appendChild(html);
        },
        async addViews(id){
            await blogApi.updateBlog({
                id,
                views: +this.blogData.views + 1,
            }).then(()=>{
                this.getCommentsData(id);
            })
        },
        storageRouter(){//存储路由
            localStorage.setItem('parentRoute', '博客首页');
            localStorage.setItem('subRoute', this.$router.history.current.meta.name);
        },
        readRouter(){//加载路由
            const parentRoute = localStorage.getItem('parentRoute');
            const subRoute = localStorage.getItem('subRoute');
            this.routes = [parentRoute,subRoute];
        },
        handleReply(id,name,content,email, previd, prevname,pid, pname){
            this.commentator.name = name;
            this.commentator.id = id;
            this.commentator.email = email;
            this.commentator.content = content;
            this.commentator.previd = previd;
            this.commentator.prevname = prevname;
            this.commentator.pid = pid;
            this.commentator.pname = pname;
        },
        showMoreContent(index){
            this.showMore = !this.showMore;
            const showMore = document.querySelectorAll('.spanContent .comment_box')
            const moreBtn = document.querySelectorAll('.blog_comment .showmore')
            showMore[index].classList.add('showMore')
            moreBtn[index].style.display = 'none';
        },
    },
    mounted(){
        this.storageRouter();
        this.getBlogs();
        this.readRouter();
        this.getBlogger();
    },
}
</script>

<style>
@import url('../assets/css/contentDetail.css');
</style>