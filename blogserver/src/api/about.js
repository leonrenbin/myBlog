import axios from './axios'

export default{
    getMe(params){
        return axios.get('/about/me/'+params.id)
    },
    updateMe(params){
        return axios.put('/about/me/'+params.id, params)
    },

    getBlogById(params){
        return axios.get('/about/blog/'+params.id)
    },
    updateBlog(params){
        return axios.put('/about/blog/'+params.id, params)
    },
}