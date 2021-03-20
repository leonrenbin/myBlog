const express = require('express')
const router = express.Router();
const mappingServ = require('../../service/mappingServ')
const { asyncHandler } = require('../getSendResult')

router.get('/',asyncHandler(async (req, res)=>{
    const page = req.query.page || 1;
    const limit = req.puery.limit || 100;
    return await mappingServ.getMappings(page, limit);
}))

router.get('/mapping/:id',asyncHandler(async (req, res)=>{
    return await mappingServ.getMappingById(req.params.id);
}))

router.delete('/',asyncHandler(async (req, res)=>{
    return await mappingServ.deleteMapping(req.params.id);
}))

router.put('/',asyncHandler(async (req, res)=>{
    return await mappingServ.updateMapping(req.params.id, req.query || req.body);
}))

router.post('/',asyncHandler(async (req, res)=>{
    return await mappingServ.addMapping(req.body || req.query);
}))

module.exports = router;