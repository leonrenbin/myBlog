const express = require('express')
const router = express.Router();
const AboutServ = require('../../service/about')
const { asyncHandler } = require('../getSendResult')

router.get('/me/:id',asyncHandler(async (req, res)=>{
    return await AboutServ.getMe(req.params.id);
}))
router.put('/me/:id',asyncHandler(async (req, res)=>{
    return await AboutServ.updateMe(req.params.id,req.body || req.query);
}))
router.post('/me',asyncHandler(async (req, res)=>{
    return await AboutServ.addMe(req.body || req.query);
}))

router.get('/blog/:id',asyncHandler(async (req, res)=>{
    return await AboutServ.getBlogById(req.params.id);
}))
router.put('/blog/:id',asyncHandler(async (req, res)=>{
    console.log(req.params.id,  req.query, req.body);
    return await AboutServ.updateBlog(req.params.id, req.body || req.query);
}))
router.post('/blog',asyncHandler(async (req, res)=>{
    return await AboutServ.addBlog(req.body || req.query);
}))

module.exports = router;