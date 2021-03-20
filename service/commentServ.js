const Comments = require('../models/comments')
exports.addComments = async function(CommentsObj){
    const res = await Comments.create(CommentsObj);
    return res.toJSON();
}

exports.updateComments = async function(id,CommentsObj){
    return await Comments.update(CommentsObj,{
        where:{
            id,
        }
    });
}

exports.deleteComments = async function(CommentsId){
    return await Comments.destroy({
        where:{
            id: CommentsId
        }
    });
}

exports.getComments = async function(page, limit){//所有评论数据
    const res = await Comments.findAndCountAll({
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

exports.getComments4 = async function(page, limit){//4条评论数据
    const res = await Comments.findAndCountAll({
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

exports.getComments11 = async function(page, limit){//11条评论数据
    const res = await Comments.findAndCountAll({
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

exports.getCommentsByDesc = async function(page, limit){
    const res = await Comments.findAndCountAll({
        offset: (page - 1) * limit,
        limit: +limit,
        order:[
            ['id','DESC']//id倒序
        ]
    })
    if(res){
        return{
            total: res.count,
            datas: JSON.parse(JSON.stringify(res.rows))
        }
    }else return null;
}

exports.getCommentsById = async function(id){
    const res = await Comments.findByPk(id);
    if(res){
        return res.toJSON();
    }else return null;
}

exports.getCommentsByBlogid = async function(page, limit, blogid){
    const res = await Comments.findAndCountAll({
        offset: (page - 1) * limit,
        limit: +limit,
        order:[
            ['id','DESC']
        ],
        where:{
            blog_id: blogid
        }
    })
    if(res){
        return{
            total: res.count,
            datas: JSON.parse(JSON.stringify(res.rows))
        }
    }else return null;
}