const EveryDay = require('../models/everyday')
exports.addEveryDay = async function(EveryDayObj){
    const res = await EveryDay.create(EveryDayObj);
    return res.toJSON();
}

exports.getLast = async function(){
    const res = await EveryDay.findOne({
        order:[
            ['id','DESC']//id倒序
        ]
    })
    if(res){
        return res.toJSON();
    }else return null;
}