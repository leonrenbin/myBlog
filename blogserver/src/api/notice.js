import axios from './axios'

export default{
    getNoticeById(params){
        return axios.get('/notice/'+params.id)
    },
    updateNotice(params){
        return axios.put('/notice/'+params.id, params)
    },
}