const sequelize = require('./database.js')
const { DataTypes } = require('sequelize')
function reg(i){
    return i = i < 10 ? '0' + i : i;
}

const Tags = sequelize.define(
    "Tag",
    {
        tag:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        ctime:{
            type: DataTypes.DATE,
            allowNull: false,
            get(){
                const time = this.getDataValue("ctime");
                if(time){
                    return `${time.getFullYear()}-${reg(time.getMonth())}-${reg(time.getDate())}`
                }
                else return undefined;
            }
        },
        utime:{
            type: DataTypes.DATE,
            allowNull: false,
            get(){
                const utime = this.getDataValue("utime");//this是模型定义的对象
                if(utime){
                    return `${utime.getFullYear()}-${reg(utime.getMonth())}-${reg(utime.getDate())}`
                }
                else return undefined;
            }
        },
    },
    {
        createdAt: false,
        updatedAt: false,
        paranoid: false,
    }
)

module.exports = Tags;