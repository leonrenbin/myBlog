import axios from './axios'

export default{
    getTags(params){
        return axios.get('/tags/', params)
    },
    getTagById(params){
        return axios.get('/tags/'+params.id)
    },
    updateTags(params){
        return axios.put('/tags/'+params.id, params)
    },
    deleteTags(params){
        return axios.delete('/tags/'+params.id)
    },
    addTags(params){
        return axios.post('/tags/', params)
    },
    gettagByname(params){
        return axios.get('/tags/name/',params)
    }
}