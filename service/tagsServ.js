const Tags = require('../models/tags')

exports.addTags = async function(TagsObj){
    const res = await Tags.create(TagsObj);
    return res.toJSON();
}

exports.deleteTags = async function(TagsId){
    return await Tags.destroy({
        where:{
            id: TagsId
        }
    });
}

exports.updateTags = async function(id,TagsObj){
    return await Tags.update(TagsObj,{
        where:{
            id,
        }
    });
}

exports.getTags = async function(page, limit){
    const res = await Tags.findAndCountAll({
        offset: (page - 1) * limit,
        limit: +limit,
    })
    if(res){
        return{
            total: res.count,
            datas: JSON.parse(JSON.stringify(res.rows))
        }
    }else return null;
}

exports.getTagById = async function(id){
    const res = await Tags.findByPk(id);
    if(res){
        return res.toJSON();
    }else return null;
}

exports.gettagByname = async function(name){
    const res = await Tags.findOne({
        where:{
            tag: name,
        }
    });
    if(res){
        return res.toJSON();
    }else return null;
}