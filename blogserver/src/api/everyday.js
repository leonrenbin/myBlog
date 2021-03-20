import axios from './axios'

export default{
    getLast(){
        return axios.get('/everyday/')
    },
    addEveryDay(params){
        return axios.post('/everyday/', params)
    },
}