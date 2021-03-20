const aboutme = require('../models/aboutme')
const aboutBlog = require('../models/aboutBlog')

exports.updateMe = async function(id,obj){
    return await aboutme.update(obj,{
        where:{
            id,
        }
    });
}
exports.getMe = async function(id){
    const res = await aboutme.findByPk(id);
    if(res){
        return res.toJSON();
    }else return null;
}

exports.addMe = async function(obj){
    const res = await aboutme.create(obj)
    if(res){
        return res.toJSON();
    }else return null;
}

exports.updateBlog = async function(id,obj){
    return await aboutBlog.update(obj,{
        where:{
            id,
        }
    });
}
exports.getBlogById = async function(id){
    const res = await aboutBlog.findByPk(id);
    if(res){
        return res.toJSON();
    }else return null;
}

exports.addBlog = async function(obj){
    const res = await aboutBlog.create(obj)
    if(res){
        return res.toJSON();
    }else return null;
}