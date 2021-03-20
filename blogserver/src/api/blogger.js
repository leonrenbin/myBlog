import axios from './axios'

export default{
    getBlogger(params){
        return axios.get('/blogger/', params)
    },
    getBloggerById(params){
        return axios.get('/blogger/'+params.id)
    },
    updateBlogger(params){
        return axios.put('/blogger/put/'+params.id, params)
    },
    deleteBlogger(params){
        return axios.delete('/blogger/'+params.id)
    },
    addBlogger(params){
        return axios.post('/blogger/', params)
    },
    login(params){
        return axios.post('/blogger/login', params)
    }
}