const Blog = require('../models/blog')
const { Op } = require('sequelize');
const { tableName } = require('../models/blog');

exports.addBlog = async function(blogObj){
    const res = await Blog.create(blogObj);
    return res.toJSON();
}

exports.deleteBlog = async function(blogId){
    return await Blog.destroy({
        where:{
            id: blogId
        }
    });
}

exports.updateBlog = async function(id,blogObj){
    return await Blog.update(blogObj,{
        where:{
            id,
        }
    });
}

exports.getBlogs = async function(page, limit){
    const res = await Blog.findAndCountAll({
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

exports.getBlogById = async function(id){
    const res = await Blog.findByPk(id);
    if(res){
        return res.toJSON();
    }else return null;
}

exports.getBlogByTagName = async function(tags){
    const where = {};
    if(tags){
        where.tags = {
            [Op.like]: `%${tags}%`,
        }
    }
    const res = await Blog.findAndCountAll({
        where,
    })
    if(res){
        return{
            total: res.count,
            datas: JSON.parse(JSON.stringify(res.rows))
        }
    }else return null;
}

exports.getBlogByKeyword = async function(title){
    const where = {};
    if(title){
        where.title = {
            [Op.like]: `%${title}%`,
        }
    }
    const res = await Blog.findAndCountAll({
        where,
    })
    if(res){
        return{
            total: res.count,
            datas: JSON.parse(JSON.stringify(res.rows))
        }
    }else return null;
}