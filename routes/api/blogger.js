const express = require('express');
const md5 = require('md5');
const router = express.Router();
const bloggerServ = require('../../service/bloggerServ')
const { asyncHandler } = require('../getSendResult')

router.put('/put/:id',asyncHandler(async (req, res)=>{
    return await bloggerServ.updateBlogger(req.params.id,req.body || req.query);
}))

router.get('/',asyncHandler(async (req, res)=>{
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    return await bloggerServ.getBlogger(page, limit);
}))

router.get('/:id',asyncHandler(async (req, res)=>{
    return await bloggerServ.getBloggerById(req.params.id);
}))

router.delete('/',asyncHandler(async (req, res)=>{
    return await bloggerServ.deleteBlogger(req.params.id);
}))

router.post('/',asyncHandler(async (req, res)=>{
    if(req.body.loginPwd){
        req.body.loginPwd = md5(req.body.loginPwd)
    }
    console.log(req.body);
    return await bloggerServ.addBlogger(req.body || req.query);
}))

router.post('/login',asyncHandler(async (req, res)=>{
    const result = await bloggerServ.login(req.body.loginId , req.body.loginPwd);
    if(result){
        const value = result.id;
        res.cookie('token', value, {
            path: '/login',
            domain: 'localhost',
            maxAge: 360 * 24 * 3600 * 1000,
        }),
        res.header('authorization', value)
    }
    return result;
}))
module.exports = router;