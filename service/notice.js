const Notice = require('../models/notice')

exports.updateNotice = async function(id,obj){
    return await Notice.update(obj,{
        where:{
            id,
        }
    });
}
exports.getNotice = async function(id){
    const res = await Notice.findByPk(id);
    if(res){
        return res.toJSON();
    }else return null;
}