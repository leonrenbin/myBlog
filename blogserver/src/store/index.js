import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pageIndex: 1,
    blogIndex: 1,
    commentator:{//评论者
      name: '',
      id: '',
      email: '',
      content: '',//的评论内容
    },
    isReply: false,
    showPopup: false,
  },
  mutations: {
    setPageIndex(state, index){
      state.pageIndex = index;
    },
    setBlogIndex(state, index){
      state.blogIndex = index;
    },
    setCommentator(state,obj){
      state.commentator.name = obj.name;
      state.commentator.id = obj.id;
      state.commentator.email = obj.email;
      state.commentator.content = obj.content;
    },
    setIsReply(state,bool){
      state.isReply = bool;
    },
    setshowPopup(state, bool){
      state.showPopup = bool;
    },
  },
  actions: {
  },
  modules: {
  }
})
