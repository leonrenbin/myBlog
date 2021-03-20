const Mapping = require('../models/tag_blog_mapping')
exports.addMapping = async function(MappingObj){
    const res = await Mapping.create(MappingObj);
    return res.toJSON();
}

exports.deleteMapping = async function(MappingId){
    return await Mapping.destroy({
        where:{
            id: MappingId
        }
    });
}

exports.updateMapping = async function(id,MappingObj){
    return await Mapping.update(MappingObj,{
        where:{
            id,
        }
    });
}

exports.getMappings = async function(page, limit){
    const res = await Mapping.findAndCountAll({
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

exports.getMappingById = async function(id){
    const res = await Mapping.findByPk(id);
    if(res){
        return res.toJSON();
    }else return null;
}