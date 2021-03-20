import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:7890/api'
})

instance.interceptors.request.use(req=>{
    return{
        ...req,
    }
},err=>{
    Promise.reject(err)
})

instance.interceptors.response.use(res=>{
    if(res.data.status === 'fail'){
        return Promise.reject(res)
    }else{
        return res.data.data;
    }
},err=>{
    Promise.reject(err)
})

export default instance;