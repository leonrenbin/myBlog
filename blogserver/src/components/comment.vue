<template>
<!-- 发表评论 -->
    <div class="commentx_wrap">
        <div class="pub_comment">
            <p class="parent" v-if="commentator.id">别回复 <b>{{ commentator.name }}</b> : <b>{{ commentator.content }}</b></p>
            <p class="parent" v-if="!commentator.id">别发评论</p>
        </div>
        <p class="cancelreply" @click="cancelReply" v-if="commentator.id">点击这里不会取消回复</p>
        <div class="commentor">
            <input type="text" 
                v-model="replyContent.name" 
                id="commentor_name" 
                placeholder="别写外号"
                autocomplete="off"
            >
            <span class="hide_nickName hideDom" v-if="hide_nickName">来者何人,报上名来</span>
            <span class="hide_nameTooLong hideDom" v-if="hide_nameTooLong">名太长了记不住</span>
            <input type="text" 
                v-model="replyContent.email" 
                id="commentor_email" 
                placeholder="别写邮箱"
                autocomplete="off"
            >
            <span class="hide_email hideDom" v-if="hide_email">不写也可以的其实...</span>
            <span class="hide_emailError hideDom" v-if="hide_emailError">这里错啦,要怎么写还要我教?</span>
        </div>
        <textarea v-model="replyContent.content" placeholder="别写评论"></textarea>
        <span class="hide_content hideDom" v-if="hide_content">意念交流?</span>
        <div class="validate_code">
            <input type="text" 
                v-model="validate_code" 
                placeholder="别写验证码"
            >
            <span v-if="hide_vCode" class="hide_vCode hideDom">我说不写你就不写?</span>
            <div class="v_code" @click="getCode" :class="{'background':!code.text}">
                <span v-if="!code.text">别获取验证码</span>
                <span class="hide_code hideDom" v-if="hide_code">暗号不对</span>
            </div>
        </div>
        <div class="submit">
            <button @click="handleSubmit">别提交留言</button>
            <button @click="handleCancel">重写吧</button>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import codeApi from '../api/code'
import cApi from '../api/comments'
import bloggerApi from '../api/blogger'
export default {
    data(){
        return{
            ...mapState({
                isReply: (state)=>state.isReply,
            }),
            replyContent:{//你回复别人所需填写的内容
                name: '',
                email: '',
                content: '',
            },
            validate_code:'',
            code: {
                svg:'',
                text: '',
            },
            sonId: '',
            sonName: '',
            blogId: 0,
            blogger: [],
            hide_nickName: false,
            hide_nameTooLong: false,
            hide_email: false,
            hide_emailError: false,
            hide_content: false,
            hide_vCode: false,
            hide_code: false,
        }
    },
    props:['commentator'],
    computed:{
        getTime(){
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();
            const house = date.getHours();
            const minute = date.getMinutes();
            return `${year}-${this.reg(month+1)}-${this.reg(day)} ${this.reg(house)}:${this.reg(minute)}`;
        },
        randomId(){
            return Math.floor(Math.random() * 100000000000);
        },
        isBlogger(){
            const bloggerid = localStorage.getItem('bloggerId')
            const bloggername = localStorage.getItem('bloggetName')
            if(bloggerid && bloggername)return 'true'
            else return 'false'
        },
    },
    methods:{
        reg(i){
            return i = i < 10 ? '0' + i : i;
        },
        getFloor(){
            if(this.commentator.floor == 1){
                return '1'
            }else if(this.commentator.floor == 2){
                return '2'
            }else{
                return '3'
            }
        },
        async handleSubmit(){
            const result = this.judge();
            if(result == false){
                setTimeout(() => {
                    this.hide_nickName = false;
                    this.hide_nameTooLong = false;
                    this.hide_email = false;
                    this.hide_emailError = false;
                    this.hide_content = false;
                    this.hide_vCode = false;
                    this.hide_code = false;
                }, 3000);
                return false;
            }
            
            let floor = this.getFloor();
            if(this.$router.history.current.name === "Detail"){
                this.blogId = localStorage.getItem('blogIndex')//得到博客id
            }
            const isblogger = this.isBlogger;
            if(this.commentator.id !== ''){//如果传递过来的数据不是空的，表示回复别人
                await cApi.addComments({
                    blog_id: this.blogId,//博客id
                    parent_id: this.commentator.pid,//楼主id
                    parent_name: this.commentator.pname,
                    prev_id: this.commentator.id,//上一楼id
                    prev_name: this.commentator.name,
                    user_name: this.replyContent.name,
                    content: this.replyContent.content,
                    email: this.replyContent.email,
                    ctime: this.getTime,
                    isBlogger: isblogger,
                    floor: +floor + 1,
                }).then(res=>{
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                })
            }else{//否则是新增一条新评论
                await cApi.addComments({
                    blog_id: this.blogId,
                    parent_id: '',//新增的评论，它的pname是自己，下面同理
                    parent_name: this.replyContent.name,
                    prev_id: '',
                    prev_name: '',
                    user_name: this.replyContent.name,
                    content: this.replyContent.content,
                    email: this.replyContent.email,
                    ctime: this.getTime,
                    isBlogger: isblogger,
                    floor: 1,
                }).then(res=>{
                    cApi.updateComments({
                        id: res.id,
                        parent_id: res.id,
                    }).then((res)=>{
                        setTimeout(() => {
                            location.reload();
                        }, 500);
                    })
                })
            }
            await bloggerApi.updateBlogger({
                id: 1,
                health: +this.blogger.health + 1
            })
        },
        judge(){
            const regex6 = /^\w{5,10}@[a-z0-9]{2,3}\.[com]+$|\,$/;
            this.code.text = this.code.text.toLowerCase();
            this.validate_code = this.validate_code.toLowerCase();
            if(this.replyContent.name === ''){
                this.hide_nickName = true;
                return false;
            };
            if(this.replyContent.name.length >10){
                this.hide_nameTooLong = true;
                return false;
            };
            if(this.replyContent.email){
                if(!regex6.test(this.replyContent.email)){
                    this.hide_emailError = true;
                    return false;
                }else{
                    this.hide_email = true;
                }
            }
            if(this.replyContent.content === ''){
                this.hide_content = true;
                return false;
            };
            if(!this.validate_code){
                this.hide_vCode = true;
                return false;
            }
            if(this.validate_code !== this.code.text){
                this.hide_code = true;
                return false;
            }
            return true;
        },
        handleCancel(){
            this.cancelReply();
        },
        async getCode(){
            if(this.replyContent.name === '')return;
            await codeApi.getCode({
                params: {
                    name:this.replyContent.name
                }
            }).then(res=>{
                this.code.svg = res.data;
                this.code.text = res.text;
                this.createCtx(res.data);
            })
        },
        createCtx(data){
            const codeDom = document.querySelector('.validate_code .v_code');
            codeDom.innerHTML = '';
            const svg = document.createElement('div')
            svg.innerHTML = data;
            codeDom.appendChild(svg)
        },
        cancelReply(){
            this.commentator.name = '';
            this.commentator.id = '';
            this.commentator.email = '';
            this.commentator.content = '';
            this.commentator.previd = '';
            this.commentator.prevname = '';
            this.commentator.pid = '';
            this.commentator.pname = '';
            this.commentator.floor = '';
        },
        async getBlogger(){
            await bloggerApi.getBlogger().then(res=>{
                this.blogger = res.datas[0]
            })
        }
    },
    mounted(){
        this.getBlogger();
    },
}
</script>

<style>
.commentx_wrap{
    position: relative;
    width: 100%;
    margin-top: 30px;
    display: flex;
    padding: 15px;
    box-sizing: border-box;
    border-radius: 8px;
    background-color: rgba(254, 254, 254, .9);
    flex-wrap: wrap;
    box-shadow: 0px 0px 12px rgba(160, 180, 200, .3);
}
.commentx_wrap input{
    margin-right: 20px;
    border: none;
    border: 1px solid #ddd;
    border-radius: 6px;
    color: #555;
    font-size: 16px;
    padding: 5px 0px 5px 10px;
}
.commentx_wrap .cancelreply{
    cursor: pointer;
    transition-duration: .2s;
    margin: 0;
    font-size: 14px;
    color: #2b92e4;
}
.commentx_wrap .cancelreply:hover{
    color: #1f4172;
}
.commentx_wrap .pub_comment{
    font-weight: bold;
    color: #666;
    width: 100%;
    height: 20px;
    padding: 10px 0px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.commentx_wrap .pub_comment p.parent{
    margin: 0;
}
.commentx_wrap .pub_comment p.parent b{
    color: #2b92e4;
}
.commentx_wrap .commentor{
    width: 100%;
    padding: 10px 0px;
    text-align: left;
    position: relative;
}
.commentx_wrap .commentor input#commentor_name{
    width: 30%;
}
.commentx_wrap .commentor .hide_nickName{
    top: 40px;
    left: 6px;
}
.commentx_wrap .commentor .hide_nameTooLong{
    top: 40px;
    left: 6px;
}
.commentx_wrap .commentor .hide_email{
    top: 40px;
    left: 270px;
}
.commentx_wrap .hide_content{
    top: 137px;
    left: 25px;
}
.commentx_wrap .commentor .hide_emailError{
    top: 40px;
    left: 270px;
}
.commentx_wrap .commentor input#commentor_email{
    width: 60%;
}
.commentx_wrap textarea{
    width: 100%;
    min-height: 100px;
    padding: 10px 0px;
    resize: none;
    border: 1px solid #ddd;
    opacity: .72;
    border-radius: 6px;
    color: #555;
    font-family: '微软雅黑';
    font-size: 16px;
    padding: 5px 0px 5px 10px;
}
.commentx_wrap .validate_code{
    width: 100%;
    padding: 10px 0px;
    text-align: left;
    display: flex;
    position: relative;
}
.commentx_wrap .validate_code .v_code{
    display: block;
    width: 150px;
    height: 30px;
    border-radius: 6px;
    text-align: center;
    line-height: 30px;
    font-weight: bold;
    color: #ff7100;
    cursor: pointer;
    margin-left: 30px;
    transition-duration: .1s;
    position: relative;
}

.commentx_wrap .validate_code .v_code.background{
    background-color: #eee;
    width: 150px;
    opacity: .92;
    margin-left: 30px;
}

.commentx_wrap .validate_code .v_code:hover{
    color: #999;
}
.commentx_wrap .validate_code .v_code svg{
    border-radius: 6px;
}
.commentx_wrap .validate_code .hide_vCode{
    top: 42px;
    left: 8px;
}
.commentx_wrap .validate_code .v_code .hide_code{
    padding: 0px 5px;
    top: -18px;
    left: 40px;
    font-weight: 400;
    line-height: 18px;
}
.commentx_wrap .submit{
    width: 100%;
    padding: 10px 0px;
    text-align: left;
}
.commentx_wrap .submit button{
    padding: 5px 15px 5px 15px;
    background-color: #fff;
    margin-right: 20px;
    border: 2px solid #ddd;
    border-radius: 6px;
    color: #666;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition-duration: .3s;
}
.commentx_wrap .submit button:hover{
    border-color: #00a1d6;
    color: #00a1d6;
}
.hideDom{
    position: absolute;
    display: block;
    font-size: 0.5rem;
    color: #f00;
    background-color: thistle;
    padding: 3px 5px;
    border-radius: 3px;
    z-index: 100;
    text-shadow: 1px 0px 0px rgba(0, 0, 0, .9);
}
</style>