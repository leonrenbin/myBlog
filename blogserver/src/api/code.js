import axios from './axios'

export default{
    getCode(params){
        return axios.get('/code/',params)
    },
}