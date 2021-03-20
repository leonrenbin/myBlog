<template>
    <div class="editor_wrap">
        <header class="header">
            <base-header />
        </header>
        <div class="choose">
            <button 
                v-for="(c, i) in chooseList" 
                :key="c"
                @click="handleClick(i)"
                :class="{'active': i === nowIndex}"
            >{{ c }}</button>
        </div>
        <div class="showAndHide">
            <div class="everyday_bind" v-if="EveryDayBind">
                <span>添加<b> 每日一句 </b>内容: </span>
            </div>
            <div class="blog_bind" v-if="showBlogBind">
                <div class="blog_title">
                    <span>标题 :</span>
                    <input type="text" v-model="blogEdit.title" placeholder="输入博客标题">
                </div>
                <div class="blog_tags">
                    <span>标签 :</span>
                    <input type="text" v-model="blogEdit.tags" placeholder="输入博客标签">
                    <i @click="getBlogtags" :class="{'active': showTags}"></i>
                    <ul v-if="blogTags.length > 0 && showTags">
                        <li 
                            v-for="(t) in blogTags" 
                            :key="t.id"
                            @click="putTagToIpt(t.tag)"
                        >{{ t.tag }}</li>
                    </ul>
                </div>
            </div>
            <div class="about_me_bind" v-if="aboutMeBind">
                <span>添加<b> 关于我 </b>的内容: </span>
            </div>
            <div class="about_blog_bind" v-if="aboutAboutBind">
                <span>添加<b> 关于博客 </b>的内容: </span>
            </div>
            <div class="guestbook_bind" v-if="guestBookBind">
                <span>让别人看到你的<b> 留言 </b>: </span>
            </div>
        </div>
        <div class="editor" id="editor"></div>
        <div class="submit">
            <button @click="handleSubmit">提交</button>
            <button @click="handleCancel">不写了</button>
        </div>
        <footer>
            <base-footer />
        </footer>
    </div>
</template>

<script>
import baseHeader from '../components/header'
import baseFooter from '../components/footer'
import E from 'wangeditor'
import popupPlug from '@/util/popUp'

import blogApi from '../api/blog'
import commentsApi from '../api/comments'
import everydayApi from '../api/everyday'
import mappingApi from '../api/mapping'
import tagsApi from '../api/tags'
import aboutApi from '../api/about'
import noticeApi from '../api/notice'
import { mapMutations } from 'vuex'

export default {
    components:{
        baseHeader,
        baseFooter
    },
    data(){
        return{
            chooseList:['每日一句','博客','关于我','关于博客','留言'],
            nowIndex: 0,
            blogEdit:{
                title: '',
                tags: '',
            },
            EveryDayBind: true,
            showBlogBind: false,
            aboutMeBind: false,
            aboutAboutBind: false,
            guestBookBind: false,
            content:{
                everyDayContent: '',
                blogContent: '',
                aboutMeContent: '',
                aboutBlogContent: '',
                guestBookContent: '',//留言
            },
            editorContent: '',
            blogId: 0,
            blogTags: [],
            showTags: false,
        }
    },
    computed:{
        getTime(){
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth()+1;
            const day = date.getDate();
            const house = date.getHours();
            const minute = date.getMinutes();
            return `${year}-${this.reg(month)}-${this.reg(day)} ${this.reg(house)}:${this.reg(minute)}`;
        },
    },
    methods:{
        ...mapMutations(['setshowPopup']),
        reg(i){
            return i = i < 10 ? '0' + i : i;
        },
        wang_editor(content){
            const editor = new E('#editor');
            editor.config.onchange = (html)=>{
                this.editorContent = html;
            }
            editor.create();
            editor.txt.html(content)
        },
        handleClick(index){
            this.nowIndex = index;
            if(this.nowIndex === 0){
                this.clear();
                !this.EveryDayBind ? this.EveryDayBind = true : ''
            }
            if(this.nowIndex === 1){
                this.clear();
                !this.showBlogBind ? this.showBlogBind = true : ''
            }
            if(this.nowIndex === 2){
                this.clear();
                !this.aboutMeBind ? this.aboutMeBind = true : ''
            }
            if(this.nowIndex === 3){
                this.clear();
                !this.aboutAboutBind ? this.aboutAboutBind = true : ''
            }
            if(this.nowIndex === 4){
                this.clear();
                !this.guestBookBind ? this.guestBookBind = true : ''
            }
        },
        clear(){
            this.EveryDayBind = false;
            this.showBlogBind = false;
            this.aboutMeBind = false;
            this.aboutAboutBind = false;
            this.guestBookBind = false;
        },
        async handleSubmit(){
            if(this.EveryDayBind === true){//每日一句
                this.content.everyDayContent = this.editorContent;
                if(!this.content.everyDayContent === true) return;
                await everydayApi.addEveryDay({
                    content: this.content.everyDayContent,
                    ctime: this.getTime
                }).then(res =>{
                    if(res){
                        this.handleEnd(0);
                    }
                })
            }
            if(this.showBlogBind === true){//编写博客
                if(this.blogEdit.tags.charAt(this.blogEdit.tags.length-1) === ','){
                    let tag = this.blogEdit.tags;
                    this.blogEdit.tags = tag.substring(0,tag.lastIndexOf(','))
                }
                this.content.blogContent = this.editorContent;
                if(!this.blogEdit.title === true || !this.blogEdit.tags === true) return;
                if(!this.content.blogContent === true) return;
                this.blogEdit.tags = this.blogEdit.tags.replace(/ /g,"").replace(/，/g, ",")
                let tags = this.blogEdit.tags.split(',')
                await blogApi.addBlog({//先添加博客
                    title: this.blogEdit.title,
                    tags: this.blogEdit.tags,
                    content: this.content.blogContent,
                    ctime: this.getTime,
                    utime: this.getTime,
                    views: 0,
                }).then((res)=>{
                    this.blogId = res.id;
                })
                for(let i=0; i<tags.length; i++){
                    let tagid = 0;
                    let result = await tagsApi.gettagByname({//再添加标签
                        params: {
                            tag: tags[i]
                        }
                    })
                    if(!result){//如果标签不存在
                        await tagsApi.addTags({//则添加标签
                            tag: tags[i],
                            ctime: this.getTime,
                            utime: this.getTime
                        }).then(res=>{
                            tagid = res.id;
                        })
                        await mappingApi.addMapping({//添加映射：多个标签id，对应一个博客id
                            tag_id: tagid,
                            blog_id: this.blogId,
                            ctime: this.getTime,
                            utime: this.getTime
                        }).then(res =>{
                            if(res){
                                this.handleEnd(0);
                            }
                        })
                    }
                }
            }
            if(this.aboutMeBind === true){//关于我
                this.content.aboutMeContent = this.editorContent;
                if(!this.content.aboutMeContent === true) return;
                await aboutApi.updateMe({
                    id:1,
                    content: this.content.aboutMeContent,
                    ctime: this.getTime
                }).then(res =>{
                    if(res){
                        this.handleEnd(2);
                    }
                })
            }
            if(this.aboutAboutBind === true){//关于博客
                this.content.aboutBlogContent = this.editorContent;
                if(!this.content.aboutBlogContent === true) return;
                await aboutApi.updateBlog({
                    id:1,
                    content: this.content.aboutBlogContent,
                    ctime: this.getTime
                }).then(res =>{
                    if(res){
                        this.handleEnd(2);
                    }
                })
            }
            if(this.guestBookBind === true){//留言
                this.content.guestBookContent = this.editorContent;
                if(!this.content.guestBookContent === true) return;
                const res = await noticeApi.updateNotice({
                    id:1,
                    content: this.content.guestBookContent,
                    ctime: this.getTime
                })
                if(res){
                    this.handleEnd(3);
                }
            }
        },
        handleEnd(index){
            const oLi = document.querySelectorAll('.header .container .menu li')
            for(let i=0; i<oLi.length; i++){
                oLi[i].classList.remove('active')
            }
            let _this = this;
            setTimeout(() => {
                _this.handleCancel();
            }, 500);
            this.createPopup();
            const popup = document.querySelector('.my_popUp');
            setTimeout(() => {
                popup.classList.add('hideStyle');
                oLi[index].click();
            }, 1000);
            setTimeout(() => {
                document.body.removeChild(popup);
                _this.setshowPopup(false);
            }, 2000);
        },
        handleCancel(){
            this.blogEdit.title = '';
            this.blogEdit.tags = '';
            this.content.everyDayContent = '';
            this.content.blogContent = '';
            this.content.aboutMeContent = '';
            this.content.aboutBlogContent = '';
            this.content.guestBookContent = '';
            this.editorContent = '';
            this.wang_editor('')
        },
        createPopup(){
            const popup = popupPlug({
                width: 300,
                height: 50,
                dom: '',
                content: '发布成功',
            })
            document.body.appendChild(popup);
        },
        async getBlogtags(){
            if(this.showTags.length > 0)return;
            await tagsApi.getTags().then(res=>{
                this.blogTags = res.datas;
                this.showTags = !this.showTags;
            })
        },
        putTagToIpt(name){
            this.blogEdit.tags += `${name},`;
        }
    },
    mounted(){
        this.wang_editor();
    },
}
</script>

<style>
.editor_wrap{
    height: 100%;
    text-align: center;
    padding: 0px 0px;
    box-sizing: border-box;
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
.editor_wrap header{
    position: relative;
}
.editor_wrap .choose{
    width: 100%;
    background-color: #fbf0e8;
    padding: 40px 0px;
    margin-top: 40px;
    opacity: .92;
}
.editor_wrap .choose button.active{
    border-color: #e18574;
    background-color: rgba(252,100,83,.9);
    color: #fff;
}

.showAndHide{
    width: 100%;
    padding: 30px 40px;
    box-sizing: border-box;
    background-color: rgba(252,100,83,.7);
    margin-top: 40px;
    text-align: left;
    color: #666;
    font-weight: bold;
}
.showAndHide b{
    font-size: 18px;
}
.showAndHide .blog_bind{
    display: flex;
    width: 100%;
}
.showAndHide .blog_bind input{
    margin-left: 10px;
    font-size: 16px;
    letter-spacing: 1px;
    min-width: 400px;
    color: #555;
    box-sizing: border-box;
}
.showAndHide .blog_bind > div{
    margin-right: 20px;
}
.showAndHide .blog_bind  .blog_tags{
    position: relative;
}
.showAndHide .blog_bind  .blog_tags i{
    position: absolute;
    display: block;
    right: 10px;
    top: 10px;
    width: 0px;
    height: 0px;
    border-top: 7px solid transparent;
    border-left: 10px solid #00a3af;
    border-bottom: 7px solid transparent;
    cursor: pointer;
    transition-duration: .3s;
    user-select: none;
}
.showAndHide .blog_bind  .blog_tags i.active{
    transform: rotate(90deg);
}
.showAndHide .blog_bind  .blog_tags > ul {
    position: absolute;
    width: 400px;
    max-height: 100px;
    background-color: rgba(255, 255, 255, .92);
    border-radius: 4px;
    right: 0px;
    top: 30px;
    padding: 5px 10px;
    box-sizing: border-box;
}
.showAndHide .blog_bind  .blog_tags > ul li{
    display: inline-block;
    margin-right: 5px;
    cursor: pointer;
    transition-duration: .1s;
    font-weight: 400;
    font-size: 14px;
}
.showAndHide .blog_bind  .blog_tags > ul li:hover{
    color: salmon;
}


#editor{
    opacity: .92;
    margin-top: 50px;
    padding: 0px 30px;
    text-align: left;
}
.editor_wrap .submit{
    margin-top: 30px;
    width: 100%;
}
.editor_wrap button{
    border: none;
    background-color: #fff;
    opacity: .92;
    cursor: pointer;
    border-radius: 6px;
    border: 2px solid #5e6d6d;
    padding: 5px 15px;
    font-weight: bold;
    margin-right: 40px;
    text-align: left;
    color: #666;
    font-size: 16px;
    transition-duration: .3s;
}
.editor_wrap button:hover{
    border-color: #e18574;
    color: #fc6453;
}
.editor_wrap footer{
    margin-top: 100px;
}
</style>