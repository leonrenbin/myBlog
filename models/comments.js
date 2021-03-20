const sequelize = require('./database.js')
const { DataTypes } = require('sequelize')
function reg(i){
    return i = i < 10 ? '0' + i : i;
}

const Comment = sequelize.define(
    "Comment",
    {
        blog_id:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        parent_id:{//楼主id
            type: DataTypes.STRING,
            allowNull: true,
        },
        parent_name:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        prev_id:{//回复谁，那个人的id
            type: DataTypes.STRING,
            allowNull: true,
        },
        prev_name:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        content:{
            type: DataTypes.STRING(2000),
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        ctime:{
            type: DataTypes.DATE,
            allowNull: false,
            get(){
                const time = this.getDataValue("ctime");
                if(time){
                    return `${time.getFullYear()}-${reg(time.getMonth()+1)}-${reg(time.getDate())}`
                }
                else return undefined;
            }
        },
        isBlogger: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        floor:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        createdAt: false,
        updatedAt: false,
        paranoid: false,
    }
)

module.exports = Comment;