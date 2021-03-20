const Blogger = require('../models/blogger')
const md5 = require('md5')

exports.addBlogger = async function(blogObj){
    const res = await Blogger.create(blogObj);
    return res.toJSON();
}

exports.deleteBlogger = async function(blogId){
    return await Blogger.destroy({
        where:{
            id: blogId
        }
    });
}

exports.updateBlogger = async function(id,blogObj){
    if(blogObj == -1){
        const res = await Blogger.findByPk(id)
        if(res.fans == 0){
            return;
        }
    }
    return await Blogger.update(blogObj,{
        where:{
            id,
        }
    });
}

exports.getBlogger = async function(page, limit){
    const res = await Blogger.findAndCountAll({
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

exports.getBloggerById = async function(id){
    const res = await Blogger.findByPk(id);
    if(res){
        return res.toJSON();
    }else return null;
}

exports.login = async function(loginId,loginPwd){
    loginPwd = md5(loginPwd)
    const res = await Blogger.findOne({
        where:{
            loginId: loginId,
            loginPwd: loginPwd,
        }
    });
    if(res && res.id){
        return res.toJSON();
    }else return null;
}