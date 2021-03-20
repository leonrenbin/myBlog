import axios from './axios'

export default{
    getMappings(params){
        return axios.get('/mapping/', params)
    },
    getMappingById(params){
        return axios.get('/mapping/'+params.id)
    },
    updateMapping(params){
        return axios.put('/mapping/'+params.id, params)
    },
    deleteMapping(params){
        return axios.delete('/mapping/'+params.id)
    },
    addMapping(params){
        return axios.post('/mapping/', params)
    },
}