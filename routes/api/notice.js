const express = require('express')
const router = express.Router();
const noticeServ = require('../../service/notice')
const { asyncHandler } = require('../getSendResult')

router.get('/:id',asyncHandler(async (req, res)=>{
    return await noticeServ.getNotice(req.params.id);
}))
router.put('/:id',asyncHandler(async (req, res)=>{
    return await noticeServ.updateNotice(req.params.id, req.body);
}))

module.exports = router;