const express = require('express')
const router = express.Router();
const everydayServ = require('../../service/everydayServ')
const { asyncHandler } = require('../getSendResult')

router.get('/',asyncHandler(async (req, res)=>{
    return await everydayServ.getLast();
}))

router.post('/',asyncHandler(async (req, res)=>{
    return await everydayServ.addEveryDay(req.body || req.query);
}))

module.exports = router;