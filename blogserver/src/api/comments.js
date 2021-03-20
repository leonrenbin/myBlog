import axios from './axios'

export default{
    getComments(params){//all
        return axios.get('/comments/', params)
    },
    getCommentsByBlogid(params){
        return axios.get('/comments/blog', params)
    },
    getComments11(params){//11
        return axios.get('/comments/ten', params)
    },
    getComments4(params){//4
        return axios.get('/comments/three', params)
    },
    getCommentsByDesc(){
        return axios.get('/comments/desc')
    },
    getCommentsById(params){
        return axios.get('/comments/'+params.id)
    },
    deleteComments(params){
        return axios.delete('/comments/'+params.id)
    },
    addComments(params){
        return axios.post('/comments/', params)
    },
    updateComments(params){
        return axios.put('/comments/'+params.id, params)
    },
}