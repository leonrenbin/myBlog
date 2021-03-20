<template>
    <div class="guestbook">
        <div class="guestbook_wrapper">
            <header class="header">
                <base-header />
            </header>
            <div class="content">
                <div class="content_left">
                    <div 
                        class="description" 
                        @mouseover="showCancelBtn($event)" 
                        @mouseout="hideCancelBtn($event)"
                        @click="followOrAttack($event)"
                    ></div>

                    <div class="bloggerLogin_wrap">
                        <form>
                            <span class="cancel_btn" @click="cancel_login($event)">关闭</span>
                            <label for="bloggerid">
                                <span>尊贵的博主殿下 <b>账号:</b> </span>
                                <input id="bloggerid" autocomplete="off" type="text" v-model="BloggerLoginInfo.loginId">
                            </label>
                            <label for="bloggerpwd">
                                <span>尊贵的博主殿下 <b>密码:</b> </span>
                                <input id="bloggerpwd" autocomplete="off" type="password" v-model="BloggerLoginInfo.loginPwd">
                            </label>
                            <div class="loginbtn">
                                <button @click="handleLogin($event)">飞升成为博主</button>
                                <button @click="cancel_login($event)">贬为游民</button>
                            </div>
                        </form>
                    </div>
                    <base-comment :commentator="commentator" @reloadPage="reloadPage" />

                    <div class="blog_comments_wrap">
                        <blog-comments @handleFn="handleFn" />
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
import baseHeader from '../components/header'
import baseSide from '../components/side'
import baseFooter from '../components/footer'
import baseComment from '../components/comment'
import blogComments from '../components/blog_comments'
import noticeApi from '../api/notice'
import { mapMutations } from 'vuex'
import bloggerApi from '../api/blogger'
export default {
    components:{
        baseSide,
        baseFooter,
        baseHeader,
        baseComment,
        blogComments,
    },
    data(){
        return{
            commentator:{//评论者
                name: '',
                id: '',
                email: '',
                content: '',//的评论内容
                previd: '',
                prevname: '',
                pid: '',
                pname: '',
                floor: '',
            },
            healthValue: 10000,
            BloggerInfo: [],
            blogger_content: '',
            timer: null,

            flag : true,
            first : 0,
            second : 0,

            BloggerLoginInfo:{
                loginId: '',
                loginPwd: '',
            }
        }
    },
    computed:{
        isBlogger(){
            const bloggerid = localStorage.getItem('bloggerId')
            const bloggername = localStorage.getItem('bloggetName')
            if(bloggerid && bloggername)return true
            else return false
        },
    },
    methods:{
        bloodLoss(max, min){
            return Math.floor(Math.random() * (max - min) + min)
        },
        async getNotice(){
            await noticeApi.getNoticeById({//我的留言
                id: 1,
            }).then(res=>{
                this.blogger_content = res.content;
                this.getBlogger(res.content);
            })
        },
        async getBlogger(content){
            await bloggerApi.getBlogger().then(res=>{
                this.BloggerInfo = res.datas[0];
                this.initHTML(content,this.BloggerInfo);
            })
        },
        initHTML(content,BloggerInfo){
            const description = document.querySelector('.description');
            description.innerHTML = '';
            const html = document.createElement('div');
            html.innerHTML = `
                <div class="avatar">
                    <span class="user_avatar"></span>
                    <div class="bloggerLogin" title="你是管理员吗?">管理员登录</div>
                </div>
                <div class="blogger_info">
                    <div class="main">
                        <span class="blogger_name">${BloggerInfo.name}</span>
                        <span>粉丝: <b>${BloggerInfo.fans}</b></span>
                        <div class="bogger_health_value">
                            <i class=""></i>
                            血量: <b>${BloggerInfo.health}</b>
                            <b class="blood_loos">-1</b>
                        </div>
                        <div class="blooger_leaving_msg">${content}</div>
                    </div>
                    <div class="action">
                        <span class="follow">关注❤</span>
                        <span class="cancel_follow">取关🤬</span>
                        <span class="attack">揍他👊</span>
                        <span class="friendshipTip">想👊我 ? 先关注</span>
                    </div>
                </div>
            `;
            description.appendChild(html)
            this.judgeIsFollow();
        },
        judgeIsFollow(){
            const isFollow = localStorage.getItem('isFollow')
            if(isFollow == 'true'){
                const follow = document.querySelector('.blogger_info .follow')
                follow.classList.add('followed');
                follow.innerHTML = `已关注<b>❤</b>`;
            }
        },
        handleFn(id,name,content,email,previd,prevname,pid, pname, floor){
            this.commentator.name = name;
            this.commentator.id = id;
            this.commentator.email = email;
            this.commentator.content = content;
            this.commentator.previd = previd;
            this.commentator.prevname = prevname;
            this.commentator.pid = pid;
            this.commentator.pname = pname;
            this.commentator.floor = floor;
        },
        reloadPage(res){
        },
        async followOrAttack(e){
            if(e.target.classList.contains('follow')){//关注
                const isFollow = localStorage.getItem('isFollow')
                if(isFollow == 'false'){//未关注
                    let res = await bloggerApi.updateBlogger({
                        id: 1,
                        fans: +this.BloggerInfo.fans + 1,
                    })
                    if(res){
                        localStorage.setItem('isFollow', true)
                        const follow = document.querySelector('.blogger_info .follow')
                        follow.classList.add('followed');
                        this.BloggerInfo.fans ++;
                        this.initHTML(this.blogger_content,this.BloggerInfo);
                    }
                }
            }else if(e.target.classList.contains('attack')){//揍我
                const isFollow = localStorage.getItem('isFollow')
                if(isFollow == 'true'){//点了关注才能开心的揍我
                    clearTimeout(this.timer)
                    this.timer = null;
                    let date = new Date();//防止用程序程序点击
                    let one = date.getTime();
                    if(this.flag){
                        this.first = one;
                        this.flag = false
                    }else{
                        this.second = one;
                        this.flag = true;
                    }
                    if(this.second > this.first){
                        var end = this.second - this.first;
                        if(end < 150){
                            return;
                        }
                    }
                    let blood = this.bloodLoss(4,0);//每次被锤，掉的血
                    const dontAttack = document.querySelector('.blogger_info .bogger_health_value i')
                    dontAttack.className = 'background';
                    if(this.BloggerInfo.health < 10000){
                        blood = 1.5;
                        const friendshipTip = document.querySelector('.blogger_info .friendshipTip')
                        friendshipTip.innerHTML = `快没血了,轻点锤`;
                        dontAttack.classList.remove('background')
                        dontAttack.classList.add('dontAttack')
                        friendshipTip.style.display = 'block';
                        setTimeout(() => {
                            friendshipTip.style.display = 'none'
                        }, 500);
                    }
                    if(this.BloggerInfo.health < 100){
                        blood = 1;
                        const friendshipTip = document.querySelector('.blogger_info .friendshipTip')
                        friendshipTip.innerHTML = `快住手,我快死了`;
                        friendshipTip.style.display = 'block';
                        setTimeout(() => {
                            friendshipTip.style.display = 'none'
                        }, 1000);
                    }
                    const blood_loos = document.querySelector('.blogger_info .blood_loos')
                    blood_loos.innerHTML = `-${blood}`;
                    blood_loos.style.opacity = 1;
                    this.timer = setTimeout(() => {
                        blood_loos.style.opacity = 0;
                    }, 1000);
                    let res = await bloggerApi.updateBlogger({
                        id: 1,
                        health: +this.BloggerInfo.health - blood,
                    })
                    if(res){
                        this.BloggerInfo.health -= +blood;
                        this.initHTML(this.blogger_content,this.BloggerInfo);
                    }
                }else if(isFollow == 'false'){//没关注？有好的提醒一下先关注
                    const friendshipTip = document.querySelector('.blogger_info .friendshipTip')
                    friendshipTip.style.display = 'block'
                    setTimeout(() => {
                        friendshipTip.style.display = 'none'
                    }, 1000);
                }
            }else if(e.target.classList.contains('cancel_follow')){//取关
                let res = await bloggerApi.updateBlogger({
                    id: 1,
                    fans: +this.BloggerInfo.fans - 1,
                })
                if(res){
                    localStorage.setItem('isFollow', false)
                    const follow = document.querySelector('.blogger_info .follow')
                    follow.classList.remove('followed');
                    this.BloggerInfo.fans --;
                    this.initHTML(this.blogger_content,this.BloggerInfo);
                }
            }else if(e.target.classList.contains('bloggerLogin')){//登录
                if(this.isBlogger){//已经登录，点击则取消登录
                    localStorage.removeItem('bloggerId')
                    localStorage.removeItem('bloggetName')
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                }else{
                    this.initLogin();
                }
            }
        },
        async showCancelBtn(e){
            if(e.target.classList.contains('followed') || e.target.classList.contains('cancel_follow')){
                clearTimeout(this.timer)
                const cancelFollow = document.querySelector('.blogger_info .cancel_follow')
                cancelFollow.style.display = 'block'
            }
            if(e.target.classList.contains('user_avatar') || e.target.classList.contains('avatar')){
                if(this.isBlogger){
                    const bloggerLogin = document.querySelector('.avatar .bloggerLogin');
                    bloggerLogin.innerHTML = '退出登录';
                }
                clearTimeout(this.timer)
                const bloggerLogin = document.querySelector('.description .bloggerLogin')
                bloggerLogin.style.display = 'block'
            }
        },
        hideCancelBtn(e){
            if(e.target.classList.contains('followed') || e.target.classList.contains('cancel_follow')){
                const cancelFollow = document.querySelector('.blogger_info .cancel_follow')
                this.timer = setTimeout(() => {
                    cancelFollow.style.display = 'none'
                }, 500);
            }
            if(e.target.classList.contains('bloggerLogin')){
                const bloggerLogin = document.querySelector('.description .bloggerLogin')
                this.timer = setTimeout(() => {
                    bloggerLogin.style.display = 'none'
                }, 1000);
            }
        },
        initLogin(){//生成登录文本框
            const bloggerLogin_wrap = document.querySelector('.bloggerLogin_wrap');
            bloggerLogin_wrap.style.display = 'block';
        },
        cancel_login(e){
            e.preventDefault();
            const bloggerLogin_wrap = document.querySelector('.bloggerLogin_wrap');
            bloggerLogin_wrap.style.display = 'none';
        },
        async handleLogin(e){
            e.preventDefault();
            if(!this.BloggerLoginInfo.loginId || !this.BloggerLoginInfo.loginPwd){
                return
            }
            await bloggerApi.login({
                loginId: this.BloggerLoginInfo.loginId,
                loginPwd: this.BloggerLoginInfo.loginPwd
            }).then(res =>{
                localStorage.setItem('bloggerId',res.id)
                localStorage.setItem('bloggetName', res.name)
                setTimeout(() => {
                    location.reload();
                }, 500);
            })
        },
    },
    mounted(){
        this.getNotice();
    },
}
</script>
<style>
.guestbook{
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
.description{
    margin-top: 80px;
    background-color: #fefefe;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 15px;
    margin-bottom: 20px;
    position: relative;
    opacity: .92;
}
.description >div{
    text-align: left;
    font-size: 16px;
    padding: 5px 0px 0px 10px;
    box-sizing: border-box;
    font-weight: bold;
    color: #2653af;
}
.description >div .avatar{
    background: hsla(0,0%,100%,.8);
    padding: 8px;
    width: 122px;
    height: 122px;
    border-radius: 50%;
    position: absolute;
    left: 20px;
    top: -50px;
    text-align: center;
}
.description >div .avatar .bloggerLogin{
    position: absolute;
    bottom: -20px;
    left: 50%;
    display: inline-block;
    transform: translateX(-50%);
    padding: 5px 10px;
    box-sizing: border-box;
    width: 100%;
    cursor: pointer;
    transition-duration: .2s;
    border-radius: 4px;
    display: none;
}
.description >div .avatar .bloggerLogin:hover{
    background-color: #faa;
}
.description >div .avatar span{
    background-image: url('../assets/img/master.jpg');
    display: block;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    border-radius: 50%;
    cursor: pointer;
}
.description >div .blogger_info{
    margin-left: 200px;
    display: flex;
    justify-content: space-around;
}
.description >div .blogger_info .main{
    width: 70%;
    /* overflow: hidden; */
}
.description >div .blogger_info .main > span{
    font-weight: 400;
}
.description >div .blogger_info .main > span b{
    color: #ff7299;
}
.description >div .blogger_info .main span.blogger_name{
    display: inline-block;
    font-size: 24px;
    font-weight: bold;
    margin-right: 10px;
}
.description >div .blogger_info .main .blooger_leaving_msg{
    display: inline-block;
    width: 100%;
}
.description >div .blogger_info .main .blooger_leaving_msg font{
    padding: 5px 0;
    line-height: 20px;
    overflow: hidden;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:3;
}
.description >div .blogger_info .main .blooger_leaving_msg p{
    margin: 0;
    padding: 5px 0;
    line-height: 20px;
    font-weight: 400;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:3;
}
.description >div .blogger_info .main .bogger_health_value{
    display: inline-block;
    height: 22px;
    float: right;
    position: relative;
}
.description >div .blogger_info .main .bogger_health_value b{
    font-size: 22px;
    margin-left: 5px;
    color: #f30;
    cursor: default;
    padding: 3px;
    border-radius: 4px;
    transition-duration: .2s;
    line-height: 22px;
    z-index: 999;
    background-color: #fff;
    opacity: 1;
}
.description >div .blogger_info .main .bogger_health_value i{
    display: block;
    width: 30px;
    height: 30px;
    background-image: url('../assets/img/得瑟.gif');
    background-repeat: no-repeat;    
    background-size: 100% 100%;
    position: absolute;
    right: 77px;
    top: -10px;
    z-index: 9;
}
.description >div .blogger_info .main .bogger_health_value .dontAttack{
    background-image: url('../assets/img/cry.jpg');
}
.description > div .blogger_info .main b.blood_loos{
    position: absolute;
    right: 10px;
    bottom: -20px;
    display: block;
    padding: 3px 10px;
    color: #1f4172;
    font-size: 12px;
    font-weight: bold;
    opacity: 0;
}

.description >div .blogger_info .action{
    width: 30%;
    display: inline-block;
    text-align: center;
}
.description > div .blogger_info .action span{
    height: 28px;
    background: #fd4c5d;
    border: 1px solid #fd4c5d;
    border-radius: 5px;
    line-height: 28px;
    text-align: center;
    font-size: 14px;
    margin: 0px 10px 20px 0;
    transition-duration: .2s;
    cursor: pointer;
    user-select: none;
    position: relative;
}
.description > div .blogger_info .action .cancel_follow{
    position: absolute;
    width: 60px;
    right: -15px;
    top: 15px;
    margin: 0;
    display: block;
    background: #fff;
    color: #fd3c4b;
    display: none;
}
.description > div .blogger_info .action .cancel_follow:hover{
    background: #fd3c4b;
    color: #fff;
}
.description >div .blogger_info .action .follow{
    display: inline-block;
    width: 104px;
    background: #fff;
    color: #fd4c5b;
}
.description >div .blogger_info .action .follow:hover{
    background: #fd3c4b;
    color: #fff;
}
.description >div .blogger_info .action .follow.followed{
    color: #fff;
    background: #fd4c5b;
}
.description >div .blogger_info .action .follow.followed b{
    color: #f00;
    text-shadow: 0px 0px 2px #000;
    margin-left: 3px;
}
.description >div .blogger_info .action .attack{
    display: inline-block;
    width: 104px;
    background: #fd4c5b;
    color: #fff;
    opacity: .9;
}
.description >div .blogger_info .action .attack:hover{
    background: #fd3c1b;
    opacity: 1;
}
.description >div .blogger_info .action .friendshipTip{
    position: absolute;
    right: 50px;
    top: 105px;
    background-color: #fff;
    border-color: transparent;
    height: 0;
    padding: 0;
    line-height: 0;
    font-size: 12px;
    color: #f00;
    display: none;
}
.blog_comments{
    width: 100%;
}
.blog_comments_wrap{
    background-color: rgba(254, 254, 254, .92);
}

.content_left .bloggerLogin_wrap{
    position: absolute;
    background-color: rgba(0, 0, 0, .52);
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 999999;
    display: none;
}
.content_left .bloggerLogin_wrap form{
    width: 370px;
    height: 300px;
    background-color: rgba(255, 255, 255, .92);
    padding: 10px;
    border-radius: 4px;
    left: 50%;
    top: 250px;
    transform: translateX(-50%);
    box-sizing: border-box;
    position: fixed;
    overflow: hidden;
}
.content_left .bloggerLogin_wrap form span.cancel_btn{
    color: #444;
    position: absolute;
    right: 0;
    top: 0px;
    padding: 2px 8px;
    background-color: #ff7299;
    border-radius: 4px;
    font-size: 12px;
    line-height: 20px;
    font-weight: bold;
    cursor: pointer;
}
.content_left .bloggerLogin_wrap form label{
    display: flex;
    width: 100%;
    margin-top: 40px;
    flex-wrap: wrap;
}
.content_left .bloggerLogin_wrap form label span{
    font-size: 14px;
    color: #2653af;
}
.content_left .bloggerLogin_wrap form label span b{
    color: #fd4c5d;
    font-weight: bold;
}
.content_left .bloggerLogin_wrap form label input{
    width: 100%;
    margin-top: 10px;
    padding: 5px 0px 5px 10px;
    border: 1px solid #ff7299;
    color: #00a1d6;
}
.content_left .bloggerLogin_wrap form .loginbtn{
    display: flex;
    width: 100%;
    margin-top: 30px;
    justify-content: center
}
.content_left .bloggerLogin_wrap form .loginbtn button{
    border: 1px solid #ff7299;
    margin: 0px 10px;
    font-size: 14px;
    padding: 3px 10px;
    color: #1f4172;
    font-weight: bold;
}
.content_left .bloggerLogin_wrap form .loginbtn button:hover{
    background-color: #ff7299;
}
</style>