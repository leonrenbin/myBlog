<template>
    <div class="about">
        <div class="about_wrapper">
            <header class="header">
                <base-header />
            </header>
            <div class="content">
                <div class="content_left">
                    <div class="main_content">
                        <div class="about_me about_">
                            <h2 v-if="about_me.title" class="about_title">{{ about_me.title }}</h2>
                        </div>
                        <div class="about_blog about_">
                            <h2 v-if="about_blog.title" class="about_title">{{ about_blog.title }}</h2>
                        </div>
                        <div class="pub_comment_wrap">
                            <base-comments :commentator="commentator" />
                        </div>
                        <div class="b_comments_wrap">
                            <blog-comments @handleFn="handleFn" />
                        </div>
                    </div>
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
import baseSide from '../components/side'
import baseFooter from '../components/footer'
import baseHeader from '../components/header'
import blogComments from '../components/blog_comments'
import baseComments from '../components/comment'
import aboutApi from '../api/about'
export default {
    components:{
        baseSide,
        baseFooter,
        baseHeader,
        blogComments,
        baseComments,
    },
    data(){
        return{
            about_me:{},
            about_blog:{},
            commentator:{//评论者
                name: '',
                id: '',
                email: '',
                content: '',//的评论内容
                uid: '',
            },
        }
    },
    methods:{
        async getDate(){
            let resp = await aboutApi.getMe({
                id:1
            })
            if(resp){
                this.about_me = resp;
                const aboutMe = document.querySelector('.about_me');
                const html = document.createElement('div')
                html.innerHTML = resp.content;
                aboutMe.appendChild(html);
            }
            await aboutApi.getBlogById({
                id:1
            }).then(res=>{
                this.about_blog = res;
                const aboutBlog = document.querySelector('.about_blog');
                const html = document.createElement('div')
                html.innerHTML = res.content;
                aboutBlog.appendChild(html);
            })
        },
        handleFn(id,name,content,email,uid){
            this.commentator.name = name;
            this.commentator.id = id;
            this.commentator.email = email;
            this.commentator.content = content;
            this.commentator.uid = uid;
        }
    },
    mounted(){
        this.getDate();
    },
}
</script>

<style>
.about{
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
}
.main_content{
    width: 100%;
    text-align: left;
}
.main_content .about_{
    margin-top: 30px;
    padding: 10px;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, .92);
}
.main_content .about_ > h1, h2, h3, h4, h5, h6, p, font{
    line-height: 24px;
}
.main_content .about_ >div{
    margin-top: 10px;
}
.main_content .about_ h2.about_title{
    margin: 0;
    font-size: 20px;
    line-height: 24px;
    color: #555;
    padding: 0px 0px 20px 0;
    border-bottom: 1px solid #777;
}
.main_content .b_comments_wrap{
    background-color: rgba(255, 255, 255, .92);
    padding: 10px;
    box-sizing: border-box;
    margin-top: 30px;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, .08);
    border-radius: 4px;
}
.main_content .about_ ul{
    width: 100%;
}
.main_content .about_ ul li{
    font-weight: bold;
    color: #666;
    padding: 0px 0px;
    width: 100%;
}


.b_comments_wrap{
    width: 100%;
}
</style>