let sequelize = require('./database')
const { DataTypes } = require('sequelize')
function reg(i){
    return i = i < 10 ? '0' + i : i;
}

const About = sequelize.define(
    "Aboutblog",
    {
        title:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        content:{
            type: DataTypes.STRING(2000),
            allowNull: true,
        },
        ctime:{
            type: DataTypes.DATE,
            allowNull: true,
            get(){
                const ctime = this.getDataValue("ctime");//this是模型定义的对象
                if(ctime){
                    return `${ctime.getFullYear()}-${reg(ctime.getMonth())}-${reg(ctime.getDate())}`
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

module.exports = About;