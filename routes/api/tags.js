const express = require('express')
const router = express.Router();
const tagsServ = require('../../service/tagsServ')
const { asyncHandler } = require('../getSendResult')

router.get('/name/',asyncHandler(async (req, res)=>{
    return await tagsServ.gettagByname(req.body.tag || req.query.tag);
}))

router.get('/blog/:id',asyncHandler(async (req, res)=>{
    return await tagsServ.getTagById(req.params.id);
}))

router.get('/',asyncHandler(async (req, res)=>{
    const page = req.query.page || 1;
    const limit = req.query.limit || 100;
    return await tagsServ.getTags(page, limit);
}))

router.put('/',asyncHandler(async (req, res)=>{
    return await tagsServ.updateTags(req.params.id, req.query || req.body);
}))

router.delete('/',asyncHandler(async (req, res)=>{
    return await tagsServ.deleteTags(req.params.id);
}))

router.post('/',asyncHandler(async (req, res)=>{
    return await tagsServ.addTags(req.body || req.query);
}))

module.exports = router;