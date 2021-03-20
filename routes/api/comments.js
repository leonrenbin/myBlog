const express = require('express')
const router = express.Router();
const CommentServ = require('../../service/commentServ')
const { asyncHandler } = require('../getSendResult')

router.get('/blog',asyncHandler(async (req, res)=>{
    console.log(req.body, req.query);
    const page = req.query.page || 1;
    const limit = req.query.limit || 1000;
    return await CommentServ.getCommentsByBlogid(page, limit, req.body.blogid || req.query.blogid);
}))

router.get('/desc',asyncHandler(async (req, res)=>{//降序排序
    const page = req.query.page || 1;
    const limit = req.query.limit || 6;
    return await CommentServ.getCommentsByDesc(page, limit);
}))

router.get('/',asyncHandler(async (req, res)=>{//所有评论数据
    const page = req.query.page || 1;
    const limit = req.query.limit || 5000;
    return await CommentServ.getComments(page, limit);
}))

router.get('/ten',asyncHandler(async (req, res)=>{//11条评论数据
    const page = req.query.page || 1;
    const limit = req.query.limit || 11;
    return await CommentServ.getComments11(page, limit);
}))

router.get('/three',asyncHandler(async (req, res)=>{//4条评论数据
    const page = req.query.page || 1;
    const limit = req.query.limit || 4;
    return await CommentServ.getComments4(page, limit);
}))

router.get('/:id',asyncHandler(async (req, res)=>{
    return await CommentServ.getCommentsById(req.params.id);
}))

router.delete('/',asyncHandler(async (req, res)=>{
    return await CommentServ.deleteComments(req.params.id);
}))

router.post('/',asyncHandler(async (req, res)=>{
    return await CommentServ.addComments(req.body);
}))

router.put('/:id',asyncHandler(async (req, res)=>{
    return await CommentServ.updateComments(req.params.id, req.body);
}))

module.exports = router;