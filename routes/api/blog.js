const express = require('express')
const router = express.Router();
const blogServ = require('../../service/blogServ')
const { asyncHandler } = require('../getSendResult')

router.get('/',asyncHandler(async (req, res)=>{
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    return await blogServ.getBlogs(page, limit);
}))

router.get('/simgle/:id',asyncHandler(async (req, res)=>{
    return await blogServ.getBlogById(req.params.id);
}))

router.get('/tag/',asyncHandler(async (req, res)=>{
    return await blogServ.getBlogByTagName(req.body.tags || req.query.tags);
}))

router.get('/keyword',asyncHandler(async (req, res)=>{
    return await blogServ.getBlogByKeyword(req.body.keyword || req.query.keyword);
}))

router.put('/:id',asyncHandler(async (req, res)=>{
    return await blogServ.updateBlog(req.params.id, req.body || req.query );
}))

router.delete('/',asyncHandler(async (req, res)=>{
    return await blogServ.deleteBlog(req.params.id);
}))

router.post('/',asyncHandler(async (req, res)=>{
    return await blogServ.addBlog(req.body || req.query);
}))

module.exports = router;