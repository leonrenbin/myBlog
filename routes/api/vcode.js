const express = require('express')
const router = express.Router();
const svgCaptcha = require('svg-captcha')
const { asyncHandler } = require('../getSendResult')

router.get('/',asyncHandler(async (req, res)=>{
    if(req.body !== {}){
        const captcha = svgCaptcha.create({
            size: 5,//5个长度
            fontSize: 50,
            width: 150,
            height: 50,
            background: '#5e6d6d',
        });
        res.send({
            data:{
                text: captcha.text,
                data: captcha.data
            }
        })
    }else{
        res.send({
            data:{
                text: '',
                data: '请先填写呢称'
            }
        })
    }
    
}))

module.exports = router;