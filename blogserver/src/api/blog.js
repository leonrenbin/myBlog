import axios from './axios'

export default{
    getBlogs(params){
        return axios.get('/blog/', params)
    },
    getBlogById(params){
        return axios.get('/blog/simgle/'+params.id)
    },
    getBlogByTagName(params){
        return axios.get('/blog/tag/', params)
    },
    getBlogByKeyword(params){
        return axios.get('/blog/keyword', params)
    },
    updateBlog(params){
        return axios.put('/blog/'+params.id, params)
    },
    deleteBlog(params){
        return axios.delete('/blog/'+params.id)
    },
    addBlog(params){
        return axios.post('/blog/', params)
    },
}