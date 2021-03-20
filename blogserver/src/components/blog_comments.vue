<template>
    <!-- 别人的留言板 -->
    <div class="comments_wrap">
        <span class="blo_comments_msg"><b>{{ total }}</b> 留言</span>
        <template v-for="(list,i) in commentList">
            <div class="blog_comment" v-if="list.floor == 1 && !+list.blog_id > 0" :key="list.id">
                <span class="spanContent">
                    <div class="avatar">
                        <i class="masterAvatar avatar"></i>
                        <i v-if="list.isBlogger == 'true'" class="blogger avatar"></i>
                    </div>
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
                                    list.parent_id,list.parent_name,list.floor
                            )"> 回复 </a>
                        </div>
                        <div class="comment_box">
                            <template v-for="(data) in totalEveryLevelSon[i]">
                                <div class="moreConent" :key="data.id" v-if="data.floor == 2">
                                    <span>
                                        <div class="avatar">
                                            <i class="floorAvatar avatar"></i>
                                            <i v-if="data.isBlogger == 'true'" class="blogger avatar"></i>
                                        </div>
                                        <div class="text">
                                            <b>{{ data.user_name }}</b>
                                            <div class="reply_content">{{ data.content }}</div>
                                            <div class="other_msg">
                                                <span>{{ data.ctime }}</span>
                                                <a @click="handleReply
                                                    (data.id, data.user_name, 
                                                    data.content,data.email, 
                                                    data.prev_id,data.prev_name,
                                                    data.parent_id, data.parent_name,data.floor)
                                                "> 回复 </a>
                                            </div>
                                        </div>
                                        <template v-for="lv3 in allLevel3Data[i]">
                                            <div class="reply_comment_wrap" v-if="lv3 != [] && lv3.floor >= 3" :key="lv3.id">
                                                <span>
                                                    <div class="avatar">
                                                        <i class="floorAvatar avatar"></i>
                                                        <i v-if="lv3.isBlogger == 'true'" class="blogger avatar"></i>
                                                    </div>
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
                                                                lv3.parent_id, lv3.parent_name,lv3.floor)
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
                <span class="showmore" v-if="allLevel3Data[i] && allLevel3Data[i].length > 2">
                    <p>剩余
                        <b>{{ allLevel3Data[i].length -3 }}</b> 条评论
                        <a v-if="allLevel3Data[i].length -3 > 0" @click="showMoreContent(i)">点击查看</a>
                    </p>
                </span>
            </div>
        </template>
        <div class="plug_wrap">
            <plug-trun-page />
        </div>
    </div>
</template>

<script>
import plugTrunPage from './plug_trun_page'
import { mapMutations } from 'vuex'
import capi from '../api/comments'
export default {
    components:{
        plugTrunPage,
    },
    data(){
        return{
            commentList:[],
            nowIndex: 1,
            total: 0,
            showMore: false,
            sonSelfId: [],
            floorId: [],
            currentPage: 1,
            totalEveryLevelSon : [],//每个楼层的所有子评论
            
            allLevel3Data: [],
        }
    },
    computed:{
    },
    mounted(){
        this.getCommentsData();
    },
    methods:{
        ...mapMutations(['setCommentator','setIsReply']),
        async getCommentsData(){
            await capi.getComments({
                page: this.nowIndex,
            }).then(res=>{
                this.initData(res);
                let count = 0;
                for(let i=0; i<res.datas.length; i++){
                    if(!+res.datas[i].blog_id > 0){
                        count ++;
                    }
                }
                this.total = count;
            })
        },
        initData(res){
            this.commentList = [];
            this.sonIds = [];
            this.sonNames = [];
            this.floorId = [];

            let parent = [];
            for(let i=0; i<res.datas.length; i++){
                let item = res.datas[i];
                if(item.id == +item.parent_id){
                    parent.push(item)
                }
            }
            this.commentList = parent//得到所有的楼主
            if(res.datas.length === 1) return;

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

            //每个楼层的所有3级评论
            for(let i=0; i<this.totalEveryLevelSon.length; i++){
                let arr = [];
                let newarr = [];
                for(let j=0; j<this.totalEveryLevelSon[i].length; j++){
                    for(let k=0; k<res.datas.length; k++){
                        if(res.datas[k].prev_id != '' 
                        && res.datas[k].parent_id == this.totalEveryLevelSon[i][j].parent_id 
                        || res.datas[k].prev_id == this.totalEveryLevelSon[i][j].id
                        ){
                            arr.push(res.datas[k])
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
        },
        showMoreContent(index){
            this.showMore = !this.showMore;
            const showMore = document.querySelectorAll('.spanContent .comment_box')
            const moreBtn = document.querySelectorAll('.blog_comment .showmore')
            showMore[index].classList.add('showMore')
            moreBtn[index].style.display = 'none';
        },
        handleReply(id,name,content,email, previd, prevname,pid, pname,floor){//点击回复
            this.$emit('handleFn',id,name,content,email, previd,prevname,pid, pname,floor)
        },
    },
}
</script>

<style>
@import url('../assets/css/blog_comments.css');
</style>